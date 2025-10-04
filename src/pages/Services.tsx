import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { ServiceCard } from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import mehendi from "@/assets/mehendi-service.jpg";
import balloon from "@/assets/balloon-decor-service.jpg";
import photography from "@/assets/photography-service.jpg";

const categories = ["all", "mehendi", "decor", "photography", "entertainment", "catering"];

const serviceImages: Record<string, string> = {
  "mehendi": mehendi,
  "decor": balloon,
  "photography": photography,
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const servicesWithImages = data.map(service => ({
        ...service,
        image_url: service.image_url || serviceImages[service.category]
      }));
      setServices(servicesWithImages);
    }
    setLoading(false);
  };

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Browse Services
          </h1>
          <p className="text-muted-foreground">Find the perfect service for your celebration</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className={selectedCategory === cat ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        )}

        {!loading && filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
