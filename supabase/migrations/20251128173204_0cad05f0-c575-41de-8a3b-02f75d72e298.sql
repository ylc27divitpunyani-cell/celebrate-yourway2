-- Make service_id optional since we now have standard_service_id and vendor_id
ALTER TABLE public.bookings
ALTER COLUMN service_id DROP NOT NULL;

-- Insert more standard services for birthday category
INSERT INTO public.standard_services (title, category, description, price, city, duration, is_active) VALUES
('Premium Birthday Balloon Arch', 'birthday', 'Stunning balloon arch with customized colors, 50+ balloons, LED lights', 3500, 'Mumbai', '3 hours', true),
('Custom Birthday Cake Package', 'birthday', '2kg designer cake with personalized theme, cake stand included', 2500, 'Mumbai', '1 hour delivery', true),
('Birthday Party Decoration Combo', 'birthday', 'Complete room decoration with balloons, banners, LED letters, table setup', 5000, 'Mumbai', '4 hours', true),
('Kids Birthday Entertainment', 'birthday', 'Magician + balloon artist + games coordinator for 2 hours', 4000, 'Mumbai', '2 hours', true),
('Birthday Photography Basic', 'birthday', '2 hour photoshoot with 50 edited photos, digital delivery', 3000, 'Mumbai', '2 hours', true),
('Balloon Bouquet Set', 'birthday', 'Set of 5 themed balloon bouquets with weights', 1500, 'Mumbai', '1 hour', true),

-- Anniversary packages
('Romantic Candlelight Dinner Setup', 'anniversary', 'Home decoration with candles, flowers, table setup for 2', 4500, 'Mumbai', '3 hours', true),
('Anniversary Photo Booth', 'anniversary', 'Themed photo booth with props and instant prints', 3500, 'Mumbai', '2 hours', true),
('Premium Flower Decoration', 'anniversary', 'Rose petals, flower arrangements, romantic lighting', 5500, 'Mumbai', '4 hours', true),

-- Baby shower packages
('Baby Shower Decoration Package', 'baby_shower', 'Pastel balloon arch, welcome board, table decoration', 6000, 'Mumbai', '4 hours', true),
('Baby Shower Games Kit', 'baby_shower', 'Complete games setup with prizes and coordinator', 2500, 'Mumbai', '2 hours', true),

-- Proposal packages
('Beach Proposal Setup', 'proposal', 'Romantic beach setup with flowers, candles, photographer', 8500, 'Mumbai', '2 hours', true),
('Home Proposal Decoration', 'proposal', 'LED lights, flower path, surprise setup', 5000, 'Mumbai', '3 hours', true);

-- Insert more vendors for wedding categories
INSERT INTO public.vendors (name, category, city, min_price, max_price, rating, reviews_count, description, phone, verified, images) VALUES
('Artistic Mehendi by Priya', 'mehendi', 'Mumbai', 5000, 25000, 4.8, 156, 'Award-winning mehendi artist specializing in bridal mehendi. Intricate designs, quick application, long-lasting color.', '+91-9876543210', true, '["https://images.unsplash.com/photo-1610832958506-aa56368176cf", "https://images.unsplash.com/photo-1591604466107-ec97de577aff"]'),

('Glamour Makeup Studio', 'makeup', 'Mumbai', 8000, 50000, 4.9, 203, 'Professional bridal makeup artist with 10+ years experience. HD makeup, airbrush, traditional looks.', '+91-9876543211', true, '["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"]'),

('Beats & Rhythms DJ', 'dj', 'Mumbai', 15000, 75000, 4.7, 89, 'Premium DJ services for weddings. Latest Bollywood, EDM, retro. Professional sound system included.', '+91-9876543212', true, '["https://images.unsplash.com/photo-1571266028243-d220c6e2ca8c", "https://images.unsplash.com/photo-1470225620780-dba8ba36b745"]'),

('Royal Decorators', 'decoration', 'Mumbai', 50000, 500000, 4.8, 167, 'Complete wedding decoration services. Stage, mandap, entrance, floral arrangements.', '+91-9876543213', true, '["https://images.unsplash.com/photo-1519225421980-715cb0215aed", "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"]'),

('Capture Moments Photography', 'photography', 'Mumbai', 25000, 150000, 4.9, 234, 'Professional wedding photography and videography. Candid shots, cinematic videos, drone coverage.', '+91-9876543214', true, '["https://images.unsplash.com/photo-1606216794079-ac79982be1a5", "https://images.unsplash.com/photo-1511285560929-80b456fea0bc"]'),

('Mehendi Magic by Riya', 'mehendi', 'Mumbai', 4000, 20000, 4.6, 98, 'Traditional and modern mehendi designs. Available for home service.', '+91-9876543215', true, '["https://images.unsplash.com/photo-1610832958506-aa56368176cf"]'),

('Bridal Glow Makeup', 'makeup', 'Mumbai', 10000, 60000, 4.8, 178, 'Specialized in bridal makeup. Trial session available. All premium products.', '+91-9876543216', true, '["https://images.unsplash.com/photo-1487412947147-5cebf100ffc2"]'),

('Party Masters DJ', 'dj', 'Mumbai', 12000, 60000, 4.5, 67, 'High-energy DJ for sangeet and reception. Customized playlists.', '+91-9876543217', false, '["https://images.unsplash.com/photo-1571266028243-d220c6e2ca8c"]'),

('Elegant Events Decor', 'decoration', 'Mumbai', 40000, 400000, 4.7, 145, 'Theme-based wedding decorations. Indoor and outdoor setups.', '+91-9876543218', true, '["https://images.unsplash.com/photo-1519225421980-715cb0215aed"]');

-- Add more vendor reviews
INSERT INTO public.vendor_reviews (vendor_id, user_id, rating, comment) 
SELECT 
  v.id,
  (SELECT id FROM profiles LIMIT 1),
  5,
  'Amazing service! Highly recommended for weddings.'
FROM vendors v
WHERE v.name = 'Artistic Mehendi by Priya';

INSERT INTO public.vendor_reviews (vendor_id, user_id, rating, comment) 
SELECT 
  v.id,
  (SELECT id FROM profiles LIMIT 1),
  5,
  'Professional and talented. Made our day special!'
FROM vendors v
WHERE v.name = 'Glamour Makeup Studio';

INSERT INTO public.vendor_reviews (vendor_id, user_id, rating, comment) 
SELECT 
  v.id,
  (SELECT id FROM profiles LIMIT 1),
  4,
  'Great music selection. Everyone enjoyed the party!'
FROM vendors v
WHERE v.name = 'Beats & Rhythms DJ';