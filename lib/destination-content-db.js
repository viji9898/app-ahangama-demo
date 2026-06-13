import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const ENTITY_CONFIG = {
  venues: {
    table: "venues",
    tagTable: "venue_tags",
    tagKey: "venue_id",
    titleColumn: "name",
    descriptionColumn: "short_description",
    destinationColumn: "destination",
    areaColumn: "area",
    publishedFilter: "status = 'active'",
  },
  places: {
    table: "places",
    tagTable: "place_tags",
    tagKey: "place_id",
    titleColumn: "name",
    descriptionColumn: "description",
    destinationColumn: "destination",
    areaColumn: "area",
  },
  experiences: {
    table: "experiences",
    tagTable: "experience_tags",
    tagKey: "experience_id",
    titleColumn: "name",
    descriptionColumn: "description",
    destinationColumn: "destination",
    areaColumn: "area",
  },
  articles: {
    table: "articles",
    tagTable: "article_tags",
    tagKey: "article_id",
    titleColumn: "title",
    descriptionColumn: "excerpt",
    publishedFilter: "published = TRUE",
  },
  events: {
    table: "events",
    tagTable: "event_tags",
    tagKey: "event_id",
    titleColumn: "title",
    descriptionColumn: "description",
    destinationColumn: "destination",
    areaColumn: "area",
  },
};

let pool;

function getConnectionString() {
  return process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || "";
}

function getPool() {
  if (!pool) {
    const connectionString = getConnectionString();

    if (!connectionString) {
      throw new Error(
        "Missing database connection. Expected NETLIFY_DATABASE_URL or DATABASE_URL.",
      );
    }

    pool = new Pool({ connectionString });
  }

  return pool;
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized || null;
}

function normalizeTextArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map(normalizeText).filter(Boolean))];
}

function normalizeLimit(value, fallback = 24) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(Math.max(parsed, 1), 100);
}

function getEntityConfig(entityType) {
  const config = ENTITY_CONFIG[entityType];

  if (!config) {
    throw new Error(`Unsupported destination content entity type: ${entityType}`);
  }

  return config;
}

function addCommonFilters({ config, filters, values, destination, area, category, featured }) {
  if (config.publishedFilter) {
    filters.push(config.publishedFilter);
  }

  if (config.destinationColumn && destination) {
    values.push(destination);
    filters.push(`${config.destinationColumn} = $${values.length}`);
  }

  if (config.areaColumn && area) {
    values.push(area);
    filters.push(`${config.areaColumn} = $${values.length}`);
  }

  if (category) {
    values.push(category);
    filters.push(`category = $${values.length}`);
  }

  if (featured !== null && featured !== undefined) {
    values.push(Boolean(featured));
    filters.push(`featured = $${values.length}`);
  }
}

function addTagFilter({ config, filters, values, tagSlugs }) {
  const normalizedTagSlugs = normalizeTextArray(tagSlugs);

  if (!normalizedTagSlugs.length) {
    return;
  }

  values.push(normalizedTagSlugs);
  filters.push(`EXISTS (
    SELECT 1
    FROM ${config.tagTable} entity_tags
    JOIN tags ON tags.id = entity_tags.tag_id
    WHERE entity_tags.${config.tagKey} = entity.id
      AND tags.slug = ANY($${values.length}::text[])
  )`);
}

function addSearchFilter({ config, filters, values, query }) {
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return;
  }

  values.push(`%${normalizedQuery.toLowerCase()}%`);
  filters.push(`(
    lower(COALESCE(entity.${config.titleColumn}, '')) LIKE $${values.length}
    OR lower(COALESCE(entity.${config.descriptionColumn}, '')) LIKE $${values.length}
    OR lower(COALESCE(entity.category, '')) LIKE $${values.length}
  )`);
}

function buildWhere(filters) {
  return filters.length ? `WHERE ${filters.join(" AND ")}` : "";
}

function mapEntityRow(row) {
  return {
    entityType: row.entity_type,
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    destination: row.destination,
    area: row.area,
    featured: row.featured,
    priorityScore: row.priority_score,
    imageUrl: row.image_url,
    tags: row.tags || [],
    raw: row.raw,
  };
}

export async function listDestinationContent({
  entityType,
  destination = null,
  area = null,
  category = null,
  featured = null,
  tagSlugs = [],
  limit = 24,
} = {}) {
  const config = getEntityConfig(entityType);
  const values = [];
  const filters = [];

  addCommonFilters({
    config,
    filters,
    values,
    destination: normalizeText(destination),
    area: normalizeText(area),
    category: normalizeText(category),
    featured,
  });
  addTagFilter({ config, filters, values, tagSlugs });

  values.push(normalizeLimit(limit));

  const result = await getPool().query(
    `
      SELECT
        $${values.length + 1}::text AS entity_type,
        entity.id,
        entity.slug,
        entity.${config.titleColumn} AS title,
        entity.category,
        entity.${config.descriptionColumn} AS description,
        ${config.destinationColumn ? `entity.${config.destinationColumn}` : "NULL"} AS destination,
        ${config.areaColumn ? `entity.${config.areaColumn}` : "NULL"} AS area,
        entity.featured,
        entity.priority_score,
        ${config.table === "articles" ? "entity.featured_image" : "entity.image_url"} AS image_url,
        COALESCE(
          ARRAY_AGG(tags.slug ORDER BY tags.slug) FILTER (WHERE tags.slug IS NOT NULL),
          ARRAY[]::text[]
        ) AS tags,
        TO_JSONB(entity.*) AS raw
      FROM ${config.table} entity
      LEFT JOIN ${config.tagTable} entity_tags
        ON entity_tags.${config.tagKey} = entity.id
      LEFT JOIN tags
        ON tags.id = entity_tags.tag_id
      ${buildWhere(filters)}
      GROUP BY entity.id
      ORDER BY entity.featured DESC, entity.priority_score DESC, entity.updated_at DESC
      LIMIT $${values.length}
    `,
    [...values, entityType],
  );

  return result.rows.map(mapEntityRow);
}

export async function searchDestinationContent({
  query,
  destination = null,
  tagSlugs = [],
  limit = 40,
} = {}) {
  const entityTypes = Object.keys(ENTITY_CONFIG);
  const perEntityLimit = Math.max(Math.ceil(normalizeLimit(limit, 40) / entityTypes.length), 5);
  const resultSets = await Promise.all(
    entityTypes.map((entityType) => {
      const config = ENTITY_CONFIG[entityType];
      const values = [];
      const filters = [];

      addCommonFilters({
        config,
        filters,
        values,
        destination: normalizeText(destination),
        area: null,
        category: null,
        featured: null,
      });
      addSearchFilter({ config, filters, values, query });
      addTagFilter({ config, filters, values, tagSlugs });

      values.push(perEntityLimit);

      return getPool().query(
        `
          SELECT
            $${values.length + 1}::text AS entity_type,
            entity.id,
            entity.slug,
            entity.${config.titleColumn} AS title,
            entity.category,
            entity.${config.descriptionColumn} AS description,
            ${config.destinationColumn ? `entity.${config.destinationColumn}` : "NULL"} AS destination,
            ${config.areaColumn ? `entity.${config.areaColumn}` : "NULL"} AS area,
            entity.featured,
            entity.priority_score,
            ${config.table === "articles" ? "entity.featured_image" : "entity.image_url"} AS image_url,
            COALESCE(
              ARRAY_AGG(tags.slug ORDER BY tags.slug) FILTER (WHERE tags.slug IS NOT NULL),
              ARRAY[]::text[]
            ) AS tags,
            TO_JSONB(entity.*) AS raw
          FROM ${config.table} entity
          LEFT JOIN ${config.tagTable} entity_tags
            ON entity_tags.${config.tagKey} = entity.id
          LEFT JOIN tags
            ON tags.id = entity_tags.tag_id
          ${buildWhere(filters)}
          GROUP BY entity.id
          ORDER BY entity.featured DESC, entity.priority_score DESC, entity.updated_at DESC
          LIMIT $${values.length}
        `,
        [...values, entityType],
      );
    }),
  );

  return resultSets
    .flatMap((result) => result.rows.map(mapEntityRow))
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, normalizeLimit(limit, 40));
}

export async function listRecommendations({
  destination = "ahangama",
  tagSlugs = [],
  categories = [],
  entityTypes = ["venues", "places", "experiences", "events", "articles"],
  limit = 20,
} = {}) {
  const normalizedTags = normalizeTextArray(tagSlugs);
  const normalizedCategories = normalizeTextArray(categories);
  const safeEntityTypes = entityTypes.filter((entityType) => ENTITY_CONFIG[entityType]);
  const perEntityLimit = Math.max(Math.ceil(normalizeLimit(limit, 20) / safeEntityTypes.length), 5);

  const resultSets = await Promise.all(
    safeEntityTypes.map((entityType) => {
      const config = ENTITY_CONFIG[entityType];
      const values = [];
      const filters = [];

      addCommonFilters({
        config,
        filters,
        values,
        destination: normalizeText(destination),
        area: null,
        category: null,
        featured: null,
      });

      if (normalizedCategories.length) {
        values.push(normalizedCategories);
        filters.push(`entity.category = ANY($${values.length}::text[])`);
      }

      if (normalizedTags.length) {
        values.push(normalizedTags);
        filters.push(`EXISTS (
          SELECT 1
          FROM ${config.tagTable} recommendation_tags
          JOIN tags ON tags.id = recommendation_tags.tag_id
          WHERE recommendation_tags.${config.tagKey} = entity.id
            AND tags.slug = ANY($${values.length}::text[])
        )`);
      }

      values.push(normalizedTags);
      const tagScoreParam = values.length;
      values.push(perEntityLimit);

      return getPool().query(
        `
          SELECT
            $${values.length + 1}::text AS entity_type,
            entity.id,
            entity.slug,
            entity.${config.titleColumn} AS title,
            entity.category,
            entity.${config.descriptionColumn} AS description,
            ${config.destinationColumn ? `entity.${config.destinationColumn}` : "NULL"} AS destination,
            ${config.areaColumn ? `entity.${config.areaColumn}` : "NULL"} AS area,
            entity.featured,
            entity.priority_score,
            ${config.table === "articles" ? "entity.featured_image" : "entity.image_url"} AS image_url,
            COALESCE(
              ARRAY_AGG(tags.slug ORDER BY tags.slug) FILTER (WHERE tags.slug IS NOT NULL),
              ARRAY[]::text[]
            ) AS tags,
            TO_JSONB(entity.*) AS raw,
            entity.priority_score
              + CASE WHEN entity.featured THEN 10 ELSE 0 END
              + COUNT(tags.slug) FILTER (WHERE tags.slug = ANY($${tagScoreParam}::text[])) * 5
              AS recommendation_score
          FROM ${config.table} entity
          LEFT JOIN ${config.tagTable} entity_tags
            ON entity_tags.${config.tagKey} = entity.id
          LEFT JOIN tags
            ON tags.id = entity_tags.tag_id
          ${buildWhere(filters)}
          GROUP BY entity.id
          ORDER BY recommendation_score DESC, entity.priority_score DESC, entity.updated_at DESC
          LIMIT $${values.length}
        `,
        [...values, entityType],
      );
    }),
  );

  return resultSets
    .flatMap((result) => result.rows.map(mapEntityRow))
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, normalizeLimit(limit, 20));
}

export async function listRelatedArticles({ entityType, entityId, limit = 12 } = {}) {
  const normalizedEntityId = normalizeText(entityId);
  const relation = {
    venues: { table: "article_venues", key: "venue_id" },
    places: { table: "article_places", key: "place_id" },
    experiences: { table: "article_experiences", key: "experience_id" },
  }[entityType];

  if (!relation || !normalizedEntityId) {
    return [];
  }

  const result = await getPool().query(
    `
      SELECT articles.*
      FROM articles
      JOIN ${relation.table}
        ON ${relation.table}.article_id = articles.id
      WHERE ${relation.table}.${relation.key} = $1
        AND articles.published = TRUE
      ORDER BY articles.featured DESC, articles.priority_score DESC, articles.published_at DESC NULLS LAST
      LIMIT $2
    `,
    [normalizedEntityId, normalizeLimit(limit, 12)],
  );

  return result.rows;
}

export async function listEntityTags({ entityType, entityId } = {}) {
  const config = getEntityConfig(entityType);
  const normalizedEntityId = normalizeText(entityId);

  if (!normalizedEntityId) {
    return [];
  }

  const result = await getPool().query(
    `
      SELECT tags.*
      FROM tags
      JOIN ${config.tagTable} entity_tags
        ON entity_tags.tag_id = tags.id
      WHERE entity_tags.${config.tagKey} = $1
      ORDER BY tags.tag_type, tags.name
    `,
    [normalizedEntityId],
  );

  return result.rows;
}
