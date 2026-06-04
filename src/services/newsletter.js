async function parseJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

export async function createNewsletterSubscriber({ email, source }) {
  const response = await fetch("/.netlify/functions/create-newsletter-subscriber", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, source }),
  });

  const payload = await parseJson(response);

  if (!response.ok) {
    throw new Error(payload.error || "Unable to save your newsletter signup");
  }

  return payload;
}

export async function updateNewsletterSubscriberPreferences(payload) {
  const response = await fetch(
    "/.netlify/functions/update-newsletter-subscriber-preferences",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const body = await parseJson(response);

  if (!response.ok) {
    throw new Error(body.error || "Unable to save your newsletter preferences");
  }

  return body;
}