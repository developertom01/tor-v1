-- =============================================
-- Seed Data: hairfordays
-- =============================================
-- Safe to re-run: skips products that already exist (by slug + store_id).

-- Ensure store + settings exist
INSERT INTO public.stores (id, display_name, domain) VALUES
  ('hairfordays', 'Hair For Days', 'hairfordays.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.store_settings (store_id, bypass_payment, online_payments_enabled) VALUES
  ('hairfordays', false, true)
ON CONFLICT (store_id) DO NOTHING;

-- Seed helper (created if not exists, dropped at end)
CREATE OR REPLACE FUNCTION public._seed_product(
  p_store_id text, p_name text, p_slug text, p_description text,
  p_price numeric, p_compare_at_price numeric, p_category text,
  p_in_stock boolean, p_stock_quantity integer, p_featured boolean, p_image_url text
) RETURNS void LANGUAGE plpgsql AS $$
DECLARE v_id uuid;
BEGIN
  IF EXISTS (SELECT 1 FROM public.products WHERE store_id = p_store_id AND slug = p_slug) THEN RETURN; END IF;
  INSERT INTO public.products (name, slug, description, price, compare_at_price, category, in_stock, stock_quantity, featured, store_id)
    VALUES (p_name, p_slug, p_description, p_price, p_compare_at_price, p_category, p_in_stock, p_stock_quantity, p_featured, p_store_id)
    RETURNING id INTO v_id;
  INSERT INTO public.product_media (product_id, url, type, is_primary, sort_order) VALUES (v_id, p_image_url, 'image', true, 0);
END; $$;

-- Products
SELECT public._seed_product('hairfordays', 'Silk Straight Lace Front Wig - Jet Black', 'silk-straight-lace-front-wig-jet-black', 'Ultra-sleek silk straight lace front wig in jet black. 100% human hair with a natural hairline. Pre-plucked with baby hair for a seamless, undetectable finish. 20-26 inches.', 920.00, 1150.00, 'wigs', true, 12, true, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Water Wave Wig - Chocolate Brown', 'water-wave-wig-chocolate-brown', 'Gorgeous water wave textured wig in rich chocolate brown. Lightweight, breathable cap with adjustable straps. Effortless beachy waves that hold their shape wash after wash.', 850.00, NULL, 'wigs', true, 10, true, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Deep Wave Closure Wig - Natural Black', 'deep-wave-closure-wig-natural-black', 'Luxurious deep wave 4x4 closure wig. Voluminous curls with zero frizz. Glueless design for quick, easy wear. Perfect for busy women who want effortless glamour.', 780.00, 950.00, 'wigs', true, 18, true, 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Honey Blonde Bodywave Wig - 24 inch', 'honey-blonde-bodywave-wig-24-inch', 'Stunning honey blonde body wave wig, 24 inches of pure luxury. 27# color grade, pre-colored and ready to wear. HD lace melts into any skin tone. A showstopper.', 1050.00, 1300.00, 'wigs', true, 7, true, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Kinky Straight Wig - Off Black', 'kinky-straight-wig-off-black', 'Natural-looking kinky straight texture that mimics relaxed African hair. Blends seamlessly with your own edges. Lightweight and comfortable for all-day wear. 16-22 inches.', 890.00, NULL, 'wigs', true, 14, false, 'https://images.unsplash.com/photo-1534180477871-5d6cc81f3920?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Peruvian Straight Bundles - Natural', 'peruvian-straight-bundles-natural', 'Premium Peruvian straight hair bundles in natural black. 100% virgin human hair — colour, bleach, and style freely. Minimal shedding. Sold per bundle (100g), 14-30 inches.', 480.00, 580.00, 'extensions', true, 25, true, 'https://images.unsplash.com/photo-1614020863825-28a0bb7e3c3c?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Body Wave Clip-In Set - Dark Brown', 'body-wave-clip-in-set-dark-brown', 'Instant volume and length with this 7-piece body wave clip-in set. Blends naturally with your hair. Quick to apply, no salon needed. Reusable and heat-friendly.', 420.00, NULL, 'extensions', true, 20, false, 'https://images.unsplash.com/photo-1560264641-1b5191cc63e2?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Tape-In Extensions - Jet Black 20 inch', 'tape-in-extensions-jet-black-20-inch', 'Professional-grade tape-in extensions in jet black, 20 inches. Thin, flat wefts that lie completely flat. Reusable up to 3 applications. 20 pieces per pack.', 550.00, 700.00, 'extensions', true, 16, true, 'https://images.unsplash.com/photo-1560869713-bf165a9cfac1?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Frontal Piece - 13x4 Straight', 'frontal-piece-13x4-straight', '13x4 ear-to-ear lace frontal piece in straight texture. Free parting anywhere. Knots pre-bleached for a natural scalp appearance. Perfect for custom wig builds.', 350.00, NULL, 'extensions', true, 22, false, 'https://images.unsplash.com/photo-1605980776566-0486c3b394f4?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Silk Edge Control - Strong Hold', 'silk-edge-control-strong-hold', 'Keep your edges laid all day with this non-flaking, humidity-resistant edge control. Infused with argan oil to nourish while it holds. Works on natural hair and wigs.', 55.00, NULL, 'accessories', true, 60, false, 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Satin Bonnet - Oversized Black', 'satin-bonnet-oversized-black', 'Protect your wigs and natural hair overnight with this oversized satin bonnet. Elastic band that stays put without pulling. Keeps hair moisturised and frizz-free.', 45.00, NULL, 'accessories', true, 50, false, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80');
SELECT public._seed_product('hairfordays', 'Wig Stand - Collapsible Travel', 'wig-stand-collapsible-travel', 'Portable collapsible wig stand for styling and storage. Lightweight and sturdy. Folds flat for travel. Keeps your wigs in shape between wears.', 75.00, NULL, 'accessories', true, 35, false, 'https://images.unsplash.com/photo-1585751119414-ef2636f8aede?w=800&q=80');

DROP FUNCTION public._seed_product;
