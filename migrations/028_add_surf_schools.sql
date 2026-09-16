-- Add surf_schools venues to guide_venues table
-- (Section added after migration 027 was already applied)

INSERT INTO guide_venues (id, section, name, slug, description, image, lat, lng, instagram, google_maps, website, rating, review_count, ownership, priority_order, status) VALUES
('surfing-sri-lanka', 'surf_schools', 'Surfing Sri Lanka', 'surfing-sri-lanka', 'One of the most established surf schools in the area, offering beginner to advanced lessons with ISA-certified instructors and all equipment included.', 'https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287258/Surfing_Sri_Lanka_fzqfya.jpg', 5.9723, 80.3613, 'https://www.instagram.com/surfingsrilanka/', 'https://maps.app.goo.gl/VwBHCzqRkXFqLiKZ7', 'https://www.surfingsrilanka.com/', 5.0, 180, 'foreign', 1, 'active'),
('sunrise-surf-school', 'surf_schools', 'Sunrise Surf School', 'sunrise-surf-school', 'A locally-run surf school in Ahangama offering patient, personalised coaching for first-timers and progressing surfers alike.', 'https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287256/Sunrise_Surf_School_opb6xz.jpg', 5.9715, 80.3638, 'https://www.instagram.com/sunrisesurfschoolsrilanka/', 'https://maps.app.goo.gl/MBrAVqihUYg8K7id9', NULL, 4.9, 95, 'local', 2, 'active'),
('ahankara-surf-school', 'surf_schools', 'Ahankara Surf School', 'ahankara-surf-school', 'Small-group and private surf lessons run by experienced local surfers who know every break in the Ahangama stretch.', 'https://res.cloudinary.com/dp7in4ulw/image/upload/v1787287236/Ahankara_Surf_School_ej2rjp.jpg', 5.9698, 80.3652, 'https://www.instagram.com/ahankarasurfschool/', 'https://maps.app.goo.gl/7C2YDwQbK8hEfxeA7', NULL, 4.8, 62, 'local', 3, 'active')
ON CONFLICT (id) DO NOTHING;

-- Add surf_schools content section
INSERT INTO guide_content (section_key, title, body) VALUES
  ('surf_schools', 'Surf Schools', 'Ahangama is surrounded by some of the best beginner and intermediate surf breaks in Sri Lanka. Whether you are picking up a board for the first time or looking to sharpen your technique, the local surf schools offer professional coaching with all equipment provided.')
ON CONFLICT (section_key) DO NOTHING;
