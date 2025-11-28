import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { Sparkles, Heart, Shield, Clock, MapPin, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/hero-celebration.jpg";
import mehendi from "@/assets/mehendi-service.jpg";
import balloon from "@/assets/balloon-decor-service.jpg";
import photography from "@/assets/photography-service.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceImages: Record<string, string> = {
  "mehendi": mehendi,
  "decor": balloon,
  "photography": photography,
};

const Index = () => {
  const navigate = useNavigate();
  const [featuredServices, setFeaturedServices] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  useEffect(() => {
    fetchFeaturedServices();
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
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

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Top Bar with Location and Auth */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[180px] border-none focus:ring-0 font-medium">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleAuthClick}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              {user ? 'My Account' : 'Login / Sign Up'}
            </Button>
          </div>
        </div>
      </div>
      
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
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Choose Your Celebration Style
            </h2>
            <p className="text-muted-foreground text-lg">Select from our two service models</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link to="/standard-services">
              <div className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all" />
                <div className="relative p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold mb-3">Everyday Celebrations</h3>
                  <p className="text-muted-foreground mb-4">
                    Pre-priced packages for birthdays, anniversaries, baby showers & more
                  </p>
                  <Button variant="secondary" className="mt-auto">
                    Browse Packages
                  </Button>
                </div>
              </div>
            </Link>

            <Link to="/vendors">
              <div className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl transition-all duration-300 cursor-pointer h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 group-hover:from-accent/30 group-hover:to-primary/30 transition-all" />
                <div className="relative p-8 h-full flex flex-col justify-center items-center text-center">
                  <div className="text-6xl mb-4">💍</div>
                  <h3 className="text-2xl font-bold mb-3">Weddings & Premium Events</h3>
                  <p className="text-muted-foreground mb-4">
                    Personalized vendors for mehendi, makeup, photography, decor & more
                  </p>
                  <Button variant="secondary" className="mt-auto">
                    Find Vendors
                  </Button>
                </div>
              </div>
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
