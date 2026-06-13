ALTER TABLE venue_interactions
  DROP CONSTRAINT IF EXISTS venue_interactions_interaction_type_check;

ALTER TABLE venue_interactions
  ADD CONSTRAINT venue_interactions_interaction_type_check
  CHECK (interaction_type IN (
    'venue_view',
    'venue_click',
    'article_view',
    'article_click',
    'directions_click',
    'instagram_click',
    'website_click',
    'offer_view',
    'offer_click',
    'pass_click',
    'redemption'
  ));

ALTER TABLE article_interactions
  DROP CONSTRAINT IF EXISTS article_interactions_interaction_type_check;

ALTER TABLE article_interactions
  ADD CONSTRAINT article_interactions_interaction_type_check
  CHECK (interaction_type IN (
    'view',
    'click',
    'share',
    'article_view',
    'article_click',
    'map_click',
    'guide_click'
  ));