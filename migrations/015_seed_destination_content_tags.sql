INSERT INTO tags (id, slug, name, tag_type)
VALUES
  ('coffee', 'coffee', 'Coffee', 'activity'),
  ('breakfast', 'breakfast', 'Breakfast', 'activity'),
  ('lunch', 'lunch', 'Lunch', 'activity'),
  ('dinner', 'dinner', 'Dinner', 'activity'),
  ('surf', 'surf', 'Surf', 'activity'),
  ('wellness', 'wellness', 'Wellness', 'activity'),
  ('pilates', 'pilates', 'Pilates', 'activity'),
  ('yoga', 'yoga', 'Yoga', 'activity'),
  ('fitness', 'fitness', 'Fitness', 'activity'),
  ('shopping', 'shopping', 'Shopping', 'activity'),
  ('design', 'design', 'Design', 'activity'),
  ('culture', 'culture', 'Culture', 'activity'),
  ('nightlife', 'nightlife', 'Nightlife', 'activity'),
  ('cocktails', 'cocktails', 'Cocktails', 'activity'),
  ('family', 'family', 'Family', 'audience'),
  ('remote-work', 'remote-work', 'Remote Work', 'activity'),
  ('nature', 'nature', 'Nature', 'activity'),
  ('wildlife', 'wildlife', 'Wildlife', 'activity'),
  ('luxury', 'luxury', 'Luxury', 'activity'),
  ('solo', 'solo', 'Solo', 'audience'),
  ('couples', 'couples', 'Couples', 'audience'),
  ('friends', 'friends', 'Friends', 'audience'),
  ('digital-nomads', 'digital-nomads', 'Digital Nomads', 'audience'),
  ('food-lovers', 'food-lovers', 'Food Lovers', 'audience'),
  ('wellness-travellers', 'wellness-travellers', 'Wellness Travellers', 'audience')
ON CONFLICT (id)
DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  tag_type = EXCLUDED.tag_type,
  updated_at = NOW();
