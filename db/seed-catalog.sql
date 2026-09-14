-- ============================================================================
--  Bakesbymom — real catalog seed (categories -> cakes -> photos)
-- ============================================================================
--  HOW TO RUN
--    npx wrangler d1 execute bakesbymom --remote --file=./db/seed-catalog.sql
--
--  Every photo URL points at an object already living in the R2 bucket
--  `bakesbymom-photos` under the `uploads/` prefix, streamed back out through
--  the Worker route /api/photos/<key>.
--
--  Safe to re-run: every row uses a fixed id and `insert or replace`, so a
--  second run refreshes the rows instead of duplicating them.
-- ============================================================================

-- The placeholder rows shipped in schema.sql are not real products.
delete from cakes where id = 'seed-cake-choco';
delete from categories where id = 'seed-cat-birthday';

-- ---------------------------------------------------------------------------
--  Categories
-- ---------------------------------------------------------------------------
insert or replace into categories (id, name, description, image_url, sort_order) values
  ('cat-birthday-kids',    'Kids & Character Birthdays',
   'Superheroes, anime and first birthdays — the cakes the party is really about.',
   '/api/photos/uploads/IMG-20260913-WA0002.png', 1),

  ('cat-birthday-parents', 'Birthdays for Mom & Dad',
   'Photo toppers, butterflies and gold lettering for the people who raised you.',
   '/api/photos/uploads/IMG-20260913-WA0007.png', 2),

  ('cat-birthday-partner', 'Birthdays for Your Partner',
   'Roses, hand-painted portraits and a name only you get to use.',
   '/api/photos/uploads/IMG-20260913-WA0009.png', 3),

  ('cat-birthday-classic', 'Classic Birthday',
   'No theme, no fuss — just a beautiful cake and a candle.',
   '/api/photos/uploads/IMG-20260206-WA0062.png', 4),

  ('cat-engagement',       'Engagement & Bride-to-Be',
   'Fresh roses, baby''s breath and toppers for the yes that started it all.',
   '/api/photos/uploads/IMG-20251128-WA0019.png', 5),

  ('cat-anniversary',      'Anniversary',
   'One year or fifty — cakes built for the couple who kept showing up.',
   '/api/photos/uploads/IMG-20260913-WA0003.png', 6),

  ('cat-parents-day',      'Mother''s Day & Father''s Day',
   'A thank-you you can slice, for Maa and for Papa.',
   '/api/photos/uploads/IMG-20260808-WA0046.png', 7),

  ('cat-romantic',         'Romantic & Just Because',
   'For the Tuesday that deserved a cake anyway.',
   '/api/photos/uploads/IMG-20260913-WA0006.png', 8),

  ('cat-farewell',         'Farewell & Send-off',
   'Flights, flags and see-you-soons, iced in buttercream.',
   '/api/photos/uploads/IMG-20251130-WA0023.png', 9),

  ('cat-festival',         'Festival Specials',
   'Janmashtami, Diwali, Raksha Bandhan — the calendar, in cake.',
   '/api/photos/uploads/IMG-20260913-WA0013.png', 10),

  ('cat-teachers',         'Teacher''s Day',
   'A bouquet that turns out to be dessert.',
   '/api/photos/uploads/IMG-20260913-WA0014.png', 11);

-- ---------------------------------------------------------------------------
--  Cakes
-- ---------------------------------------------------------------------------
insert or replace into cakes
  (id, category_id, name, description, per_pound_price, weight_kg, fixed_price, sort_order) values

  -- Kids & Character -------------------------------------------------------
  ('cake-spiderman', 'cat-birthday-kids', 'Spiderman Web Cake',
   'White buttercream with a cut-out spider crest, web toppers and red-and-blue spheres.',
   800, 1.0, 1450, 1),
  ('cake-dragon-ball', 'cat-birthday-kids', 'Dragon Ball Z Cake',
   'Hand-painted Goku on a brushed blue drum, with fondant dragon balls and stars.',
   850, 1.0, 1550, 2),
  ('cake-football-messi', 'cat-birthday-kids', 'Football Legend Cake',
   'Sky-blue ombre, a sugar football, a gold trophy and your favourite number ten.',
   800, 1.0, 1450, 3),
  ('cake-first-birthday', 'cat-birthday-kids', 'First Birthday Teddy & Cars',
   'A pastel one-year cake with a fondant teddy, rainbow arch, bunting and little blue cars.',
   850, 1.0, 1600, 4),

  -- Birthdays for Mom & Dad ------------------------------------------------
  ('cake-mom-photo', 'cat-birthday-parents', 'Photo Clothesline Cake for Mom',
   'Pink-and-white marbled buttercream with your own photos pegged on a mini clothesline.',
   850, 1.0, 1600, 1),
  ('cake-mom-butterfly', 'cat-birthday-parents', 'Butterfly & Macaron Cake',
   'Pearl-studded ivory buttercream, fresh roses, macarons and wafer butterflies.',
   900, 1.0, 1700, 2),
  ('cake-maa-wings', 'cat-birthday-parents', 'Angel Wings Cake for Maa',
   'Feathered wings, an illustrated topper of her, and a garden of gold and mauve roses.',
   950, 1.0, 1850, 3),
  ('cake-super-dad', 'cat-birthday-parents', 'Super Dad Cake',
   'Blue and indigo palette-knife strokes, gold ''Super Dad'' lettering and a full set of dad toppers.',
   850, 1.0, 1600, 4),

  -- Birthdays for Your Partner ---------------------------------------------
  ('cake-hbd-wifey', 'cat-birthday-partner', 'HBD Wifey Rose Cake',
   'Deep-red roses, gold spheres and a hand-drawn portrait in a maroon saree.',
   900, 1.0, 1750, 1),

  -- Classic Birthday --------------------------------------------------------
  ('cake-heart-pearl', 'cat-birthday-classic', 'Pearl Heart Cake',
   'A heart-shaped cake in white cream with pearls, gold-tipped swirls and a gold topper.',
   750, 1.0, 1350, 1),
  ('cake-choco-drip', 'cat-birthday-classic', 'Loaded Chocolate Drip',
   'Dark ganache drip over ivory-to-caramel ombre, piled with chocolates, wafers and truffles.',
   800, 1.0, 1500, 2),

  -- Engagement & Bride-to-Be ------------------------------------------------
  ('cake-bride-to-be', 'cat-engagement', 'Bride To Be Cake',
   'Pistachio buttercream, a bride illustration, fresh roses and a gold ''bride to be'' topper.',
   950, 1.0, 1800, 1),
  ('cake-engaged-hands', 'cat-engagement', 'Engaged — Ring Hands Cake',
   'Clasped hands with the ring, pearls, gold leaf and a diamond-ring topper.',
   950, 1.0, 1800, 2),

  -- Anniversary -------------------------------------------------------------
  ('cake-anniversary-maroon', 'cat-anniversary', 'Maroon & Gold Anniversary',
   'A textured wine-red base under white cream, gold pearls, roses and a heart topper.',
   900, 1.0, 1750, 1),
  ('cake-anniversary-50', 'cat-anniversary', 'Golden Jubilee Two-Tier',
   'Two tiers in lilac and mint with pearls and mauve roses — built for the big numbers.',
   950, 2.0, 3200, 2),

  -- Mother's Day & Father's Day ---------------------------------------------
  ('cake-mom-flowerpot', 'cat-parents-day', 'Rose Flowerpot Cake for Mom',
   'An ivory pot filled with cookie soil and fresh roses, finished with gold ''MOM'' lettering.',
   850, 0.5, 1250, 1),
  ('cake-best-husband-dad', 'cat-parents-day', 'Best Husband & Dad Cake',
   'A clean white cake with a hand-piped crossword and little red hearts.',
   700, 0.5, 1050, 2),

  -- Romantic & Just Because -------------------------------------------------
  ('cake-every-smile', 'cat-romantic', 'The Man Behind My Every Smile',
   'White drip with black fondant hearts, gold pearls and a message across the board.',
   750, 0.5, 1150, 1),

  -- Farewell ----------------------------------------------------------------
  ('cake-farewell-flights', 'cat-farewell', 'Until We Meet Again',
   'A sky-blue cake with clouds, two flags and a dotted flight path between them.',
   750, 1.0, 1350, 1),

  -- Festival ----------------------------------------------------------------
  ('cake-janmashtami', 'cat-festival', 'Janmashtami Lotus Cake',
   'Blue-and-white marbled cream, sugar pearls, lotus cut-outs and a peacock feather.',
   800, 1.0, 1450, 1),

  -- Teacher's Day -----------------------------------------------------------
  ('cake-teachers-day', 'cat-teachers', 'Teacher''s Day Flowerpot',
   'A butter-yellow textured pot with cookie soil, roses and a gold heart.',
   800, 0.5, 1200, 1);

-- ---------------------------------------------------------------------------
--  Photos — cover first (sort_order 1), extra angles after.
-- ---------------------------------------------------------------------------
insert or replace into cake_photos (id, cake_id, url, sort_order) values
  ('ph-spiderman-1',        'cake-spiderman',         '/api/photos/uploads/IMG-20260913-WA0002.png', 1),
  ('ph-dragon-ball-1',      'cake-dragon-ball',       '/api/photos/uploads/IMG-20260913-WA0012.png', 1),
  ('ph-football-1',         'cake-football-messi',    '/api/photos/uploads/IMG-20260913-WA0008.png', 1),
  ('ph-first-birthday-1',   'cake-first-birthday',    '/api/photos/uploads/IMG-20260310-WA0017.png', 1),

  ('ph-mom-photo-1',        'cake-mom-photo',         '/api/photos/uploads/IMG-20251130-WA0022.png', 1),
  ('ph-mom-butterfly-1',    'cake-mom-butterfly',     '/api/photos/uploads/IMG-20260213-WA0054.png', 1),
  ('ph-maa-wings-1',        'cake-maa-wings',         '/api/photos/uploads/IMG-20260913-WA0007.png', 1),
  ('ph-super-dad-1',        'cake-super-dad',         '/api/photos/uploads/IMG-20260808-WA0045.png', 1),

  ('ph-hbd-wifey-1',        'cake-hbd-wifey',         '/api/photos/uploads/IMG-20260913-WA0009.png', 1),

  ('ph-heart-pearl-1',      'cake-heart-pearl',       '/api/photos/uploads/IMG-20260206-WA0062.png', 1),
  ('ph-heart-pearl-2',      'cake-heart-pearl',       '/api/photos/uploads/IMG-20260206-WA0059.png', 2),
  ('ph-heart-pearl-3',      'cake-heart-pearl',       '/api/photos/uploads/IMG-20260206-WA0061.png', 3),
  ('ph-choco-drip-1',       'cake-choco-drip',        '/api/photos/uploads/IMG-20260913-WA0011.png', 1),

  ('ph-bride-to-be-1',      'cake-bride-to-be',       '/api/photos/uploads/IMG-20251128-WA0019.png', 1),
  ('ph-engaged-hands-1',    'cake-engaged-hands',     '/api/photos/uploads/IMG-20251130-WA0019.png', 1),
  ('ph-engaged-hands-2',    'cake-engaged-hands',     '/api/photos/uploads/IMG-20251130-WA0018.png', 2),
  ('ph-engaged-hands-3',    'cake-engaged-hands',     '/api/photos/uploads/IMG-20251130-WA0020.png', 3),

  ('ph-anniv-maroon-1',     'cake-anniversary-maroon','/api/photos/uploads/IMG-20260913-WA0003.png', 1),
  ('ph-anniv-50-1',         'cake-anniversary-50',    '/api/photos/uploads/IMG-20260913-WA0005.png', 1),

  ('ph-mom-flowerpot-1',    'cake-mom-flowerpot',     '/api/photos/uploads/IMG-20260808-WA0046.png', 1),
  ('ph-husband-dad-1',      'cake-best-husband-dad',  '/api/photos/uploads/IMG-20251202-WA0037.png', 1),

  ('ph-every-smile-1',      'cake-every-smile',       '/api/photos/uploads/IMG-20260913-WA0006.png', 1),

  ('ph-farewell-1',         'cake-farewell-flights',  '/api/photos/uploads/IMG-20251130-WA0023.png', 1),

  ('ph-janmashtami-1',      'cake-janmashtami',       '/api/photos/uploads/IMG-20260913-WA0013.png', 1),

  ('ph-teachers-day-1',     'cake-teachers-day',      '/api/photos/uploads/IMG-20260913-WA0014.png', 1),
  ('ph-teachers-day-2',     'cake-teachers-day',      '/api/photos/uploads/IMG-20260913-WA0004.png', 2);
