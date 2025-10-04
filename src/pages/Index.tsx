import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { Sparkles, Heart, Shield, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-celebration.jpg";
import mehendi from "@/assets/mehendi-service.jpg";
import balloon from "@/assets/balloon-decor-service.jpg";
import photography from "@/assets/photography-service.jpg";

const serviceImages: Record<string, string> = {
  "mehendi": mehendi,
  "decor": balloon,
  "photography": photography,
};

const Index = () => {
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedServices();
  }, []);

  const fetchFeaturedServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .limit(6);

    if (data) {
      const servicesWithImages = data.map(service => ({
        ...service,
        image_url: service.image_url || serviceImages[service.category]
      }));
      setFeaturedServices(servicesWithImages);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-secondary/80 to-accent/70" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Celebrate Your Way
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in">
            Book the perfect services for your special moments
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Link to="/services">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Browse Services
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Curated Services</h3>
              <p className="text-muted-foreground">Handpicked celebration services for your special day</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Vendors</h3>
              <p className="text-muted-foreground">All our service providers are thoroughly vetted</p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <Clock className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">Book in minutes and track your celebration plans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Featured Services
            </h2>
            <p className="text-muted-foreground">Popular choices for your celebrations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/services">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container mx-auto px-4 text-center text-white">
          <Sparkles className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to Celebrate?</h2>
          <p className="text-xl mb-8 text-white/90">Join us and make your special moments unforgettable</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
