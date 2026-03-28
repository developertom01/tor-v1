-- =============================================
-- Tor Platform — Seed Data (Multi-tenant)
-- =============================================

-- Stores
INSERT INTO public.stores (id, display_name, domain) VALUES
  ('hairlukgud', 'Hair Luk Gud GH', 'hairlukgud.com'),
  ('hairfordays', 'Hair For Days', 'hairfordays.com')
ON CONFLICT (id) DO NOTHING;

-- Store settings (one per store)
INSERT INTO public.store_settings (store_id, bypass_payment, online_payments_enabled) VALUES
  ('hairlukgud', false, true),
  ('hairfordays', false, true)
ON CONFLICT (store_id) DO NOTHING;

-- Products (seeded for hairlukgud)
INSERT INTO public.products (id, name, slug, description, price, compare_at_price, category, in_stock, stock_quantity, featured, store_id) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Body Wave Lace Front Wig - Natural Black', 'body-wave-lace-front-wig-natural-black', 'Premium body wave lace front wig in natural black. Made with 100% human hair for a natural look and feel. Pre-plucked hairline with baby hair. 18-22 inches available. Perfect for everyday glam or special occasions.', 850.00, 1050.00, 'wigs', true, 15, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111102', 'Colored Straight Wig - Blue Fantasy', 'colored-straight-wig-blue-fantasy', 'Stand out with this bold blue straight wig. Silky smooth texture with a vibrant color that turns heads. Heat-resistant synthetic fiber. Great for parties, festivals, or when you want to make a statement.', 750.00, NULL, 'wigs', true, 8, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111103', 'Curly Wig - Natural Brown', 'curly-wig-natural-brown', 'Beautiful natural brown curly wig with a bouncy, voluminous texture. Lightweight and breathable cap construction. Tangle-free and easy to maintain. 16-20 inches.', 900.00, 1100.00, 'wigs', true, 12, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111104', 'Short Bob Wig - Dark Purple', 'short-bob-wig-dark-purple', 'Chic and trendy short bob wig in a gorgeous dark purple shade. Perfect for a bold new look without the commitment. Adjustable cap fits all head sizes. Easy to style and maintain.', 650.00, NULL, 'wigs', true, 20, false, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111105', 'Platinum Blonde Straight Wig - Long', 'platinum-blonde-straight-wig-long', 'Luxurious platinum blonde straight wig, 24 inches of pure elegance. 613 color grade, can be dyed and styled with heat tools. HD lace front for an invisible hairline. Our best seller!', 950.00, 1200.00, 'wigs', true, 6, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111106', 'Red Curly Wig - Glamour Style', 'red-curly-wig-glamour-style', 'Turn heads with this stunning red curly wig. Rich auburn color with natural-looking curls. Glueless cap design for easy wear. Perfect for date nights and special events.', 880.00, NULL, 'wigs', true, 10, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111107', 'Dark Wavy Wig - Long Layers', 'dark-wavy-wig-long-layers', 'Effortlessly beautiful dark wavy wig with long layered styling. Soft, touchable waves that look naturally yours. Adjustable straps and combs for a secure fit. 20-24 inches.', 820.00, 950.00, 'wigs', true, 14, false, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111108', 'Deep Curly Wig - Natural Texture', 'deep-curly-wig-natural-texture', 'Embrace your natural beauty with this deep curly textured wig. Mimics 4A/4B curl patterns perfectly. Lightweight breathable cap. Minimal shedding and tangle-free.', 870.00, NULL, 'wigs', true, 9, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111109', 'Brazilian Hair Bundle - Straight Brown', 'brazilian-hair-bundle-straight-brown', 'Premium Brazilian straight hair bundles in natural brown. 100% virgin human hair that can be dyed, bleached, and styled. Sold per bundle (100g). Available in 12-28 inches.', 450.00, 550.00, 'extensions', true, 30, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111110', 'Clip-In Extensions - Black & Brown Ombre', 'clip-in-extensions-black-brown-ombre', 'Easy-to-apply clip-in hair extensions with a gorgeous black to brown ombre effect. 7 pieces per set with secure clips. Add length and volume in minutes. No salon visit needed!', 380.00, NULL, 'extensions', true, 25, false, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111111', 'Blonde Tape-In Extensions - 22 inch', 'blonde-tape-in-extensions-22-inch', 'Professional-grade blonde tape-in extensions, 22 inches long. Seamless and undetectable when applied. Reusable up to 3 times. 20 pieces per pack.', 520.00, 650.00, 'extensions', true, 18, true, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111112', 'Satin Scrunchie Set - Pink & Teal (3 pack)', 'satin-scrunchie-set-pink-teal', 'Protect your hair and edges with these luxurious satin scrunchies. Set of 3 in pink, teal, and cream. Gentle on all hair types including wigs and extensions. A must-have accessory!', 85.00, NULL, 'accessories', true, 50, false, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111113', 'Gold Claw Clip - Large', 'gold-claw-clip-large', 'Trendy oversized gold claw clip for effortless updos. Strong grip that holds thick hair and wigs securely. Matte gold finish that adds elegance to any hairstyle.', 65.00, NULL, 'accessories', true, 40, false, 'hairlukgud'),
  ('11111111-1111-1111-1111-111111111114', 'Wooden Hair Clip - Classic Brown', 'wooden-hair-clip-classic-brown', 'Handcrafted wooden hair clip with a smooth, polished finish. Eco-friendly and stylish. Works beautifully with natural hair, braids, and wigs.', 45.00, NULL, 'accessories', true, 35, false, 'hairlukgud');

-- Product Media
INSERT INTO public.product_media (product_id, url, type, is_primary, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111101', 'https://images.unsplash.com/photo-1747979022469-43e0f3d7641f?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111102', 'https://images.unsplash.com/photo-1559607552-67f0b9c56d3e?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111103', 'https://images.unsplash.com/photo-1764591642721-1786da45f055?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111104', 'https://images.unsplash.com/photo-1579584707409-58eaaa0e9584?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111105', 'https://images.unsplash.com/photo-1763551229890-64e97d845251?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111106', 'https://images.unsplash.com/photo-1713207360366-b8526cc0220d?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111107', 'https://images.unsplash.com/photo-1765338915185-02824314c129?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111108', 'https://images.unsplash.com/photo-1734167490654-dd7649bf81ef?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111109', 'https://images.unsplash.com/photo-1614020863825-28a0bb7e3c3c?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111110', 'https://images.unsplash.com/photo-1560264641-1b5191cc63e2?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1560869713-bf165a9cfac1?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111112', 'https://images.unsplash.com/photo-1606772016409-d4a55e32be6e?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111113', 'https://images.unsplash.com/photo-1744177762256-e2594b4894b6?w=800&q=80', 'image', true, 0),
  ('11111111-1111-1111-1111-111111111114', 'https://images.unsplash.com/photo-1635423759863-4ce5e848b8b5?w=800&q=80', 'image', true, 0);
