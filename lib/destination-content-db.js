import process from "node:process";
import pg from "pg";

const { Pool } = pg;

const ENTITY_CONFIG = {
  venues: {
    entityType: "venue",
    table: "venues",
    tagTable: "venue_tags",
    tagKey: "venue_id",
    titleColumn: "name",
    descriptionColumn: "short_description",
    destinationColumn: "destination",
    areaColumn: "area",
    imageColumn: "image_url",
    publishedFilter: "status = 'published' AND editorial_status <> 'hidden'",
    completenessFields: [
      "name",
      "slug",
      "category",
      "short_description",
      "long_description",
      "area",
      "destination",
      "image_url",
      "ai_summary",
    ],
  },
  places: {
    entityType: "place",
    table: "places",
    tagTable: "place_tags",
    tagKey: "place_id",
    titleColumn: "name",
    descriptionColumn: "description",
    destinationColumn: "destination",
    areaColumn: "area",
    imageColumn: "image_url",
    publishedFilter: "status = 'published' AND editorial_status <> 'hidden'",
    completenessFields: [
      "name",
      "slug",
      "category",
      "description",
      "area",
      "destination",
      "latitude",
      "longitude",
      "image_url",
      "ai_summary",
    ],
  },
  experiences: {
    entityType: "experience",
    table: "experiences",
    tagTable: "experience_tags",
    tagKey: "experience_id",
    titleColumn: "name",
    descriptionColumn: "description",
    destinationColumn: "destination",
    areaColumn: "area",
    imageColumn: "image_url",
    publishedFilter: "status = 'published' AND editorial_status <> 'hidden'",
    completenessFields: [
      "name",
      "slug",
      "category",
      "description",
      "area",
      "destination",
      "image_url",
      "ai_summary",
    ],
  },
  articles: {
    entityType: "article",
    table: "articles",
    tagTable: "article_tags",
    tagKey: "article_id",
    titleColumn: "title",
    descriptionColumn: "excerpt",
    imageColumn: "featured_image",
    publishedFilter:
      "(status = 'published' OR published = TRUE) AND editorial_status <> 'hidden'",
    completenessFields: [
      "title",
      "slug",
      "category",
      "excerpt",
      "featured_image",
      "author",
      "published_at",
      "ai_summary",
    ],
  },
  events: {
    entityType: "event",
    table: "events",
    tagTable: "event_tags",
    tagKey: "event_id",
    titleColumn: "title",
    descriptionColumn: "description",
    destinationColumn: "destination",
    areaColumn: "area",
    imageColumn: "image_url",
    publishedFilter: "status = 'published' AND editorial_status <> 'hidden'",
    completenessFields: [
      "title",
      "slug",
      "category",
      "description",
      "destination",
      "area",
      "start_datetime",
      "image_url",
      "ai_summary",
    ],
  },
};

const ENTITY_TYPE_ALIASES = Object.fromEntries(
  Object.entries(ENTITY_CONFIG).flatMap(([key, config]) => [
    [key, key],
    [config.entityType, key],
  ]),
);

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

function getEntityKey(entityType) {
  const normalizedEntityType = ENTITY_TYPE_ALIASES[entityType];

  if (!normalizedEntityType) {
    throw new Error(
      `Unsupported destination content entity type: ${entityType}`,
    );
  }

  return normalizedEntityType;
}

function getEntityConfig(entityType) {
  return ENTITY_CONFIG[getEntityKey(entityType)];
}

function getSingularEntityType(entityType) {
  return getEntityConfig(entityType).entityType;
}

function addCommonFilters({
  config,
  filters,
  values,
  destination,
  area,
  category,
  featured,
  editorialStatus,
  status,
  includeDrafts = false,
}) {
  if (!includeDrafts && config.publishedFilter) {
    filters.push(config.publishedFilter);
  }

  if (status) {
    values.push(status);
    filters.push(`entity.status = $${values.length}`);
  }

  if (editorialStatus) {
    values.push(editorialStatus);
    filters.push(`entity.editorial_status = $${values.length}`);
  }

  if (config.destinationColumn && destination) {
    values.push(destination);
    filters.push(`entity.${config.destinationColumn} = $${values.length}`);
  }

  if (config.areaColumn && area) {
    values.push(area);
    filters.push(`entity.${config.areaColumn} = $${values.length}`);
  }

  if (category) {
    values.push(category);
    filters.push(`entity.category = $${values.length}`);
  }

  if (featured !== null && featured !== undefined) {
    values.push(Boolean(featured));
    filters.push(`entity.featured = $${values.length}`);
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
    FROM ${config.tagTable} entity_tags_filter
    JOIN tags ON tags.id = entity_tags_filter.tag_id
    WHERE entity_tags_filter.${config.tagKey} = entity.id
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
    OR lower(COALESCE(entity.ai_summary, '')) LIKE $${values.length}
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
    editorialStatus: row.editorial_status,
    status: row.status,
    priorityScore: row.priority_score,
    recommendationScore: row.recommendation_score,
    contentCompletenessScore: row.content_completeness_score,
    imageUrl: row.image_url,
    tags: row.tags || [],
    raw: row.raw,
  };
}

function buildEntityQuery({
  config,
  filters,
  limitParam,
  entityTypeParam,
  scoreExpression = null,
}) {
  const scoreSelect = scoreExpression
    ? `, ${scoreExpression} AS recommendation_score`
    : "";
  const scoreOrder = scoreExpression ? "recommendation_score DESC," : "";

  return `
    SELECT
      $${entityTypeParam}::text AS entity_type,
      entity.id,
      entity.slug,
      entity.${config.titleColumn} AS title,
      entity.category,
      entity.${config.descriptionColumn} AS description,
      ${config.destinationColumn ? `entity.${config.destinationColumn}` : "NULL"} AS destination,
      ${config.areaColumn ? `entity.${config.areaColumn}` : "NULL"} AS area,
      entity.featured,
      entity.editorial_status,
      entity.status,
      entity.priority_score,
      entity.content_completeness_score,
      entity.${config.imageColumn} AS image_url,
      COALESCE(
        ARRAY_AGG(tags.slug ORDER BY tags.slug) FILTER (WHERE tags.slug IS NOT NULL),
        ARRAY[]::text[]
      ) AS tags,
      TO_JSONB(entity.*) AS raw
      ${scoreSelect}
    FROM ${config.table} entity
    LEFT JOIN ${config.tagTable} entity_tags
      ON entity_tags.${config.tagKey} = entity.id
    LEFT JOIN tags
      ON tags.id = entity_tags.tag_id
    ${buildWhere(filters)}
    GROUP BY entity.id
    ORDER BY ${scoreOrder} entity.featured DESC, entity.priority_score DESC, entity.updated_at DESC
    LIMIT $${limitParam}
  `;
}

async function queryEntityList({
  entityType,
  filters,
  values,
  limit,
  scoreExpression = null,
}) {
  const entityKey = getEntityKey(entityType);
  const config = getEntityConfig(entityKey);
  values.push(normalizeLimit(limit));
  const limitParam = values.length;
  values.push(config.entityType);
  const entityTypeParam = values.length;

  const result = await getPool().query(
    buildEntityQuery({
      config,
      filters,
      limitParam,
      entityTypeParam,
      scoreExpression,
    }),
    values,
  );

  return result.rows.map(mapEntityRow);
}

export async function listDestinationContent({
  entityType,
  destination = null,
  area = null,
  category = null,
  featured = null,
  editorialStatus = null,
  status = null,
  includeDrafts = false,
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
    editorialStatus: normalizeText(editorialStatus),
    status: normalizeText(status),
    includeDrafts,
  });
  addTagFilter({ config, filters, values, tagSlugs });

  return queryEntityList({ entityType, filters, values, limit });
}

export async function searchDestinationContent({
  query,
  destination = null,
  tagSlugs = [],
  includeDrafts = false,
  limit = 40,
} = {}) {
  const entityTypes = Object.keys(ENTITY_CONFIG);
  const perEntityLimit = Math.max(
    Math.ceil(normalizeLimit(limit, 40) / entityTypes.length),
    5,
  );

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
        includeDrafts,
      });
      addSearchFilter({ config, filters, values, query });
      addTagFilter({ config, filters, values, tagSlugs });

      return queryEntityList({
        entityType,
        filters,
        values,
        limit: perEntityLimit,
      });
    }),
  );

  return resultSets
    .flat()
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, normalizeLimit(limit, 40));
}

export async function listRecommendations({
  destination = "ahangama",
  tagSlugs = [],
  categories = [],
  entityTypes = ["venues", "places", "experiences", "events", "articles"],
  includeDrafts = false,
  limit = 20,
} = {}) {
  const normalizedTags = normalizeTextArray(tagSlugs);
  const normalizedCategories = normalizeTextArray(categories);
  const safeEntityTypes = entityTypes.map(getEntityKey);
  const perEntityLimit = Math.max(
    Math.ceil(normalizeLimit(limit, 20) / safeEntityTypes.length),
    5,
  );

  const resultSets = await Promise.all(
    safeEntityTypes.map((entityType) => {
      const config = getEntityConfig(entityType);
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
        includeDrafts,
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
      const scoreExpression = `entity.priority_score
        + CASE entity.editorial_status
            WHEN 'featured' THEN 20
            WHEN 'recommended' THEN 12
            WHEN 'standard' THEN 0
            ELSE -100
          END
        + CASE WHEN entity.featured THEN 10 ELSE 0 END
        + COUNT(tags.slug) FILTER (WHERE tags.slug = ANY($${tagScoreParam}::text[])) * 5`;

      return queryEntityList({
        entityType,
        filters,
        values,
        limit: perEntityLimit,
        scoreExpression,
      });
    }),
  );

  return resultSets
    .flat()
    .sort(
      (left, right) =>
        (right.recommendationScore ?? right.priorityScore) -
        (left.recommendationScore ?? left.priorityScore),
    )
    .slice(0, normalizeLimit(limit, 20));
}

export async function listFeaturedContent(
  destination,
  entityType = "venues",
  limit = 12,
) {
  return listDestinationContent({
    entityType,
    destination,
    editorialStatus: "featured",
    includeDrafts: false,
    limit,
  });
}

export async function listRecommendedContent(
  destination,
  entityType = "venues",
  limit = 12,
) {
  const entityKey = getEntityKey(entityType);
  const config = getEntityConfig(entityKey);
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
    includeDrafts: false,
  });
  filters.push("entity.editorial_status IN ('recommended', 'featured')");

  return queryEntityList({ entityType: entityKey, filters, values, limit });
}

export async function listRelatedArticles({
  entityType,
  entityId,
  limit = 12,
} = {}) {
  const normalizedEntityId = normalizeText(entityId);
  const relation = {
    venues: { table: "article_venues", key: "venue_id" },
    venue: { table: "article_venues", key: "venue_id" },
    places: { table: "article_places", key: "place_id" },
    place: { table: "article_places", key: "place_id" },
    experiences: { table: "article_experiences", key: "experience_id" },
    experience: { table: "article_experiences", key: "experience_id" },
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
        AND (articles.status = 'published' OR articles.published = TRUE)
        AND articles.editorial_status <> 'hidden'
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

export async function listEntityMedia(entityType, entityId) {
  const normalizedEntityId = normalizeText(entityId);

  if (!normalizedEntityId) {
    return [];
  }

  const result = await getPool().query(
    `
      SELECT *
      FROM entity_media
      WHERE entity_type = $1
        AND entity_id = $2
      ORDER BY is_primary DESC, sort_order ASC, created_at ASC
    `,
    [getSingularEntityType(entityType), normalizedEntityId],
  );

  return result.rows;
}

export async function listEntityRelationships(entityType, entityId) {
  const normalizedEntityId = normalizeText(entityId);
  const singularEntityType = getSingularEntityType(entityType);

  if (!normalizedEntityId) {
    return [];
  }

  const result = await getPool().query(
    `
      SELECT *
      FROM entity_relationships
      WHERE (source_type = $1 AND source_id = $2)
         OR (target_type = $1 AND target_id = $2)
      ORDER BY priority_score DESC, created_at DESC
    `,
    [singularEntityType, normalizedEntityId],
  );

  return result.rows;
}

export async function listRelatedEntities(entityType, entityId, limit = 20) {
  const normalizedEntityId = normalizeText(entityId);
  const singularEntityType = getSingularEntityType(entityType);

  if (!normalizedEntityId) {
    return [];
  }

  const relationships = await getPool().query(
    `
      SELECT *
      FROM entity_relationships
      WHERE source_type = $1
        AND source_id = $2
      ORDER BY priority_score DESC, created_at DESC
      LIMIT $3
    `,
    [singularEntityType, normalizedEntityId, normalizeLimit(limit, 20)],
  );

  const related = [];

  for (const relationship of relationships.rows) {
    const targetEntityKey = getEntityKey(relationship.target_type);
    const config = getEntityConfig(targetEntityKey);
    const result = await getPool().query(
      `
        SELECT
          $2::text AS entity_type,
          entity.id,
          entity.slug,
          entity.${config.titleColumn} AS title,
          entity.category,
          entity.${config.descriptionColumn} AS description,
          ${config.destinationColumn ? `entity.${config.destinationColumn}` : "NULL"} AS destination,
          ${config.areaColumn ? `entity.${config.areaColumn}` : "NULL"} AS area,
          entity.featured,
          entity.editorial_status,
          entity.status,
          entity.priority_score,
          entity.content_completeness_score,
          entity.${config.imageColumn} AS image_url,
          ARRAY[]::text[] AS tags,
          TO_JSONB(entity.*) AS raw
        FROM ${config.table} entity
        WHERE entity.id = $1
        LIMIT 1
      `,
      [relationship.target_id, config.entityType],
    );

    if (result.rows[0]) {
      related.push({
        relationship,
        entity: mapEntityRow(result.rows[0]),
      });
    }
  }

  return related;
}

export async function updateContentCompletenessScore(entityType, entityId) {
  const config = getEntityConfig(entityType);
  const normalizedEntityId = normalizeText(entityId);

  if (!normalizedEntityId) {
    return null;
  }

  const result = await getPool().query(
    `SELECT * FROM ${config.table} WHERE id = $1 LIMIT 1`,
    [normalizedEntityId],
  );
  const row = result.rows[0];

  if (!row) {
    return null;
  }

  const presentFields = config.completenessFields.filter((field) => {
    const value = row[field];

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== null && value !== undefined && String(value).trim() !== "";
  }).length;

  const media = await listEntityMedia(config.entityType, normalizedEntityId);
  const mediaBonus = media.length > 0 ? 1 : 0;
  const fieldCount = config.completenessFields.length + 1;
  const score = Math.round(((presentFields + mediaBonus) / fieldCount) * 100);

  const update = await getPool().query(
    `
      UPDATE ${config.table}
      SET content_completeness_score = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `,
    [normalizedEntityId, Math.min(Math.max(score, 0), 100)],
  );

  return update.rows[0];
}

export async function listVenueMetrics(venueId, dateRange = {}) {
  const normalizedVenueId = normalizeText(venueId);

  if (!normalizedVenueId) {
    return [];
  }

  const values = [normalizedVenueId];
  const filters = ["venue_id = $1"];

  if (dateRange.startDate) {
    values.push(dateRange.startDate);
    filters.push(`date >= $${values.length}::date`);
  }

  if (dateRange.endDate) {
    values.push(dateRange.endDate);
    filters.push(`date <= $${values.length}::date`);
  }

  const result = await getPool().query(
    `
      SELECT *
      FROM venue_metrics_daily
      WHERE ${filters.join(" AND ")}
      ORDER BY date DESC
    `,
    values,
  );

  return result.rows;
}
