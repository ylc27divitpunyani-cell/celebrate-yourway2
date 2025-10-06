import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { StandardServiceCard } from "@/components/StandardServiceCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StandardServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchStandardServices();
  }, []);

  const fetchStandardServices = async () => {
    const { data } = await supabase
      .from('standard_services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setServices(data);
    }
    setLoading(false);
  };

  const categories = [
    { value: "all", label: "All Packages" },
    { value: "birthday", label: "Birthday" },
    { value: "anniversary", label: "Anniversary" },
    { value: "baby_shower", label: "Baby Shower" },
    { value: "proposal", label: "Proposal" },
  ];

  const filteredServices = selectedCategory === "all" 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🎉 Everyday Celebrations
          </h1>
          <p className="text-muted-foreground text-lg">
            Pre-priced packages for your special moments
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.value)}
              className={selectedCategory === category.value ? "bg-gradient-to-r from-primary to-secondary" : ""}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No packages found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <StandardServiceCard key={service.id} {...service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
