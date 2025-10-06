-- Create standard_services table for pre-priced packages
CREATE TABLE public.standard_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  city TEXT NOT NULL,
  duration TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on standard_services
ALTER TABLE public.standard_services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view active standard services
CREATE POLICY "Anyone can view active standard services"
ON public.standard_services
FOR SELECT
USING (is_active = true);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  min_price INTEGER NOT NULL,
  max_price INTEGER NOT NULL,
  rating FLOAT DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  description TEXT,
  images JSONB,
  phone TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view vendors
CREATE POLICY "Anyone can view vendors"
ON public.vendors
FOR SELECT
USING (true);

-- Create vendor_reviews table
CREATE TABLE public.vendor_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on vendor_reviews
ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view vendor reviews
CREATE POLICY "Anyone can view vendor reviews"
ON public.vendor_reviews
FOR SELECT
USING (true);

-- Policy: Users can create reviews for their bookings
CREATE POLICY "Users can create vendor reviews"
ON public.vendor_reviews
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update bookings table to support both service types
ALTER TABLE public.bookings
ADD COLUMN type TEXT DEFAULT 'vendor' CHECK (type IN ('standard', 'vendor')),
ADD COLUMN vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
ADD COLUMN standard_service_id UUID REFERENCES public.standard_services(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX idx_bookings_type ON public.bookings(type);
CREATE INDEX idx_bookings_vendor_id ON public.bookings(vendor_id);
CREATE INDEX idx_bookings_standard_service_id ON public.bookings(standard_service_id);

-- Insert sample standard services
INSERT INTO public.standard_services (title, category, description, price, city, duration, image_url) VALUES
('Birthday Bash Basic', 'birthday', 'Classic birthday decoration with balloons, banners, and a simple cake setup', 2500, 'Mumbai', '3 hours', NULL),
('Anniversary Romantic Setup', 'anniversary', 'Romantic candlelight setup with flowers, fairy lights, and personalized touches', 4500, 'Mumbai', '4 hours', NULL),
('Baby Shower Bliss', 'baby_shower', 'Complete baby shower decoration with themed props, backdrop, and game setup', 5500, 'Delhi', '5 hours', NULL),
('Proposal Premium', 'proposal', 'Stunning proposal setup with LED lights, flowers, personalized message, and photography', 8000, 'Bangalore', '2 hours', NULL),
('Kids Birthday Deluxe', 'birthday', 'Premium kids birthday with character themes, games, entertainment, and photo booth', 7500, 'Delhi', '4 hours', NULL),
('Simple Surprise Setup', 'anniversary', 'Quick surprise setup for home celebrations with balloons and basic decor', 1500, 'Pune', '2 hours', NULL);

-- Insert sample vendors
INSERT INTO public.vendors (name, category, city, min_price, max_price, rating, reviews_count, description, phone, verified, images) VALUES
('Meera Mehendi Art', 'mehendi', 'Mumbai', 3000, 15000, 4.8, 45, 'Professional mehendi artist with 10+ years experience. Specializing in bridal mehendi, Arabic designs, and modern patterns.', '+91-9876543210', true, '["https://images.unsplash.com/photo-1610394352570-d7f568a3d1bc?w=800", "https://images.unsplash.com/photo-1583419474001-2e67e4d7db6f?w=800"]'),
('Glamour Studio by Priya', 'makeup', 'Delhi', 5000, 25000, 4.9, 78, 'Award-winning bridal makeup artist. Specializing in HD bridal makeup, party makeup, and hair styling for all occasions.', '+91-9876543211', true, '["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800", "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800"]'),
('Moments Photography', 'photography', 'Bangalore', 10000, 80000, 4.7, 92, 'Professional wedding and event photographers. Candid photography, traditional shoots, pre-wedding shoots, and albums.', '+91-9876543212', true, '["https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800", "https://images.unsplash.com/photo-1519741497674-611481863552?w=800"]'),
('Royal Decor Studio', 'decor', 'Mumbai', 20000, 200000, 4.6, 67, 'Full-service wedding and event decoration. Stage setup, floral arrangements, lighting, and theme-based decorations.', '+91-9876543213', true, '["https://images.unsplash.com/photo-1519167758481-83f29da8c88a?w=800", "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"]'),
('DJ Beats & Lights', 'dj', 'Pune', 8000, 40000, 4.5, 34, 'Professional DJ services with premium sound systems and lighting. Perfect for weddings, sangeet, and reception parties.', '+91-9876543214', true, '["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"]'),
('Shalini Mehendi Designs', 'mehendi', 'Delhi', 2500, 12000, 4.7, 56, 'Traditional and contemporary mehendi designs for all occasions. Bridal mehendi specialist with organic henna.', '+91-9876543215', true, '["https://images.unsplash.com/photo-1610394352570-d7f568a3d1bc?w=800"]');

-- Insert sample vendor reviews
INSERT INTO public.vendor_reviews (vendor_id, user_id, rating, comment) 
SELECT v.id, p.id, 5, 'Absolutely amazing work! Very professional and talented.'
FROM public.vendors v
CROSS JOIN public.profiles p
WHERE v.name = 'Meera Mehendi Art'
LIMIT 1;

INSERT INTO public.vendor_reviews (vendor_id, user_id, rating, comment) 
SELECT v.id, p.id, 5, 'Best makeup artist! Made me look stunning on my wedding day.'
FROM public.vendors v
CROSS JOIN public.profiles p
WHERE v.name = 'Glamour Studio by Priya'
LIMIT 1;