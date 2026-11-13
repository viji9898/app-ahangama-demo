import assert from "node:assert/strict";
import process from "node:process";
import test from "node:test";
import {
  getMetaConfig,
  isMetaConfigured,
  listInstagramMedia,
  metaGraphRequest,
  normalizeGraphApiVersion,
} from "../lib/meta-instagram.js";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const ENV_KEYS = [
  "META_SYSTEM_USER_ACCESS_TOKEN",
  "META_PAGE_ID",
  "META_INSTAGRAM_ACCOUNT_ID",
  "META_GRAPH_API_VERSION",
];

const VALID_ENV = {
  META_SYSTEM_USER_ACCESS_TOKEN: "EAAfake-system-user-token-0000000000",
  META_PAGE_ID: "1234567890",
  META_INSTAGRAM_ACCOUNT_ID: "9876543210",
  META_GRAPH_API_VERSION: "v23.0",
};

async function withEnv(overrides, run) {
  const saved = {};
  for (const key of ENV_KEYS) saved[key] = process.env[key];

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }

  try {
    return await run();
  } finally {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
}

async function withFetch(fakeFetch, run) {
  const original = globalThis.fetch;
  globalThis.fetch = fakeFetch;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/* ------------------------------------------------------------------ */
/* Configuration                                                       */
/* ------------------------------------------------------------------ */

test("meta config reports missing variables without exposing values", async () => {
  await withEnv(
    {
      META_SYSTEM_USER_ACCESS_TOKEN: undefined,
      META_PAGE_ID: undefined,
      META_INSTAGRAM_ACCOUNT_ID: undefined,
      META_GRAPH_API_VERSION: undefined,
    },
    () => {
      const config = getMetaConfig();

      assert.equal(config.configured, false);
      assert.equal(isMetaConfigured(), false);
      assert.deepEqual(config.missing.sort(), [...ENV_KEYS].sort());
      assert.equal(config.hasAccessToken, false);
      assert.equal("accessToken" in config, false);
      assert.equal(JSON.stringify(config).includes("EAA"), false);
    },
  );
});

test("meta config normalizes the graph version and validates numeric ids", async () => {
  await withEnv(VALID_ENV, () => {
    assert.equal(normalizeGraphApiVersion("23.0"), "v23.0");
    assert.equal(normalizeGraphApiVersion("v23.0"), "v23.0");
    assert.equal(normalizeGraphApiVersion("23"), "");
    assert.equal(normalizeGraphApiVersion("vNext"), "");

    const config = getMetaConfig();
    assert.equal(config.configured, true);
    assert.equal(config.graphApiVersion, "v23.0");
    assert.equal(config.pageId, VALID_ENV.META_PAGE_ID);
  });

  await withEnv(
    { ...VALID_ENV, META_PAGE_ID: "page-123" },
    () => {
      const config = getMetaConfig();
      assert.equal(config.configured, false);
      assert.match(config.invalid.join(" "), /META_PAGE_ID must be numeric/);
    },
  );
});

/* ------------------------------------------------------------------ */
/* Requests                                                            */
/* ------------------------------------------------------------------ */

test("requests fail fast when meta is not configured", async () => {
  await withEnv(
    { ...VALID_ENV, META_SYSTEM_USER_ACCESS_TOKEN: undefined },
    async () => {
      let called = false;

      await withFetch(
        async () => {
          called = true;
          return jsonResponse({});
        },
        async () => {
          const result = await metaGraphRequest("me");
          assert.equal(result.ok, false);
          assert.equal(result.error.code, "META_NOT_CONFIGURED");
          assert.equal(called, false);
        },
      );
    },
  );
});

test("authenticates with a bearer header and keeps the token out of the URL", async () => {
  await withEnv(VALID_ENV, async () => {
    let captured;

    await withFetch(
      async (url, options) => {
        captured = { url: String(url), options };
        return jsonResponse({ id: VALID_ENV.META_PAGE_ID, name: "Page" });
      },
      async () => {
        const result = await metaGraphRequest(VALID_ENV.META_PAGE_ID, {
          params: { fields: "id,name" },
        });

        assert.equal(result.ok, true);
        assert.equal(result.data.name, "Page");
        assert.equal(
          captured.options.headers.Authorization,
          `Bearer ${VALID_ENV.META_SYSTEM_USER_ACCESS_TOKEN}`,
        );
        assert.equal(
          captured.url.includes(VALID_ENV.META_SYSTEM_USER_ACCESS_TOKEN),
          false,
        );
        assert.equal(captured.url.includes("access_token"), false);
        assert.match(captured.url, /\/v23\.0\/1234567890\?/);
        assert.match(captured.url, /fields=id%2Cname/);
      },
    );
  });
});

test("maps token errors and redacts token material from messages", async () => {
  await withEnv(VALID_ENV, async () => {
    await withFetch(
      async () =>
        jsonResponse(
          {
            error: {
              message: `Invalid OAuth access token ${VALID_ENV.META_SYSTEM_USER_ACCESS_TOKEN}`,
              code: 190,
              error_subcode: 463,
              fbtrace_id: "trace-1",
            },
          },
          400,
        ),
      async () => {
        const result = await metaGraphRequest("me");

        assert.equal(result.ok, false);
        assert.equal(result.error.code, "META_TOKEN_EXPIRED");
        assert.equal(
          result.error.message.includes(
            VALID_ENV.META_SYSTEM_USER_ACCESS_TOKEN,
          ),
          false,
        );
        assert.match(result.error.message, /\[redacted\]/);
        assert.match(result.error.hint, /META_SYSTEM_USER_ACCESS_TOKEN/);
        assert.equal(result.error.fbtraceId, "trace-1");
      },
    );
  });
});

test("maps permission errors and keeps the insights scope hint", async () => {
  await withEnv(VALID_ENV, async () => {
    await withFetch(
      async () =>
        jsonResponse(
          {
            error: {
              message: "(#200) Requires instagram_manage_insights permission",
              code: 200,
            },
          },
          403,
        ),
      async () => {
        const result = await metaGraphRequest("me");

        assert.equal(result.ok, false);
        assert.equal(result.error.code, "META_PERMISSION_DENIED");
        assert.match(result.error.hint, /instagram_manage_insights/);
      },
    );
  });
});

test("reports timeouts without leaking request details", async () => {
  await withEnv(VALID_ENV, async () => {
    await withFetch(
      async () => {
        const error = new Error("The operation was aborted");
        error.name = "AbortError";
        throw error;
      },
      async () => {
        const result = await metaGraphRequest("me");

        assert.equal(result.ok, false);
        assert.equal(result.error.code, "META_TIMEOUT");
        assert.equal(
          result.error.message.includes(
            VALID_ENV.META_SYSTEM_USER_ACCESS_TOKEN,
          ),
          false,
        );
      },
    );
  });
});

test("media helper targets the configured account with a bounded limit", async () => {
  await withEnv(VALID_ENV, async () => {
    let captured = "";

    await withFetch(
      async (url) => {
        captured = String(url);
        return jsonResponse({ data: [] });
      },
      async () => {
        const result = await listInstagramMedia({ limit: 2 });

        assert.equal(result.ok, true);
        assert.match(
          captured,
          new RegExp(`/v23\\.0/${VALID_ENV.META_INSTAGRAM_ACCOUNT_ID}/media\\?`),
        );
        assert.match(captured, /limit=2/);
        assert.match(captured, /media_product_type/);
      },
    );
  });
});
