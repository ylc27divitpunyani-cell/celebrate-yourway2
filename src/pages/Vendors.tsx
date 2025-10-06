import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { VendorCard } from "@/components/VendorCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Vendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    const { data } = await supabase
      .from('vendors')
      .select('*')
      .order('rating', { ascending: false });

    if (data) {
      setVendors(data);
    }
    setLoading(false);
  };

  const categories = [
    { value: "all", label: "All Vendors" },
    { value: "mehendi", label: "Mehendi" },
    { value: "makeup", label: "Makeup" },
    { value: "photography", label: "Photography" },
    { value: "decor", label: "Decoration" },
    { value: "dj", label: "DJ & Music" },
  ];

  const cities = [
    { value: "all", label: "All Cities" },
    { value: "Mumbai", label: "Mumbai" },
    { value: "Delhi", label: "Delhi" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Pune", label: "Pune" },
  ];

  const filteredVendors = vendors.filter(v => {
    const categoryMatch = selectedCategory === "all" || v.category === selectedCategory;
    const cityMatch = selectedCity === "all" || v.city === selectedCity;
    return categoryMatch && cityMatch;
  });

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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
            💍 Wedding Vendors & Premium Services
          </h1>
          <p className="text-muted-foreground text-lg">
            Find verified professionals for your special day
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.value)}
                  className={selectedCategory === category.value ? "bg-gradient-to-r from-accent to-primary" : ""}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">City</h3>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <Button
                  key={city.value}
                  variant={selectedCity === city.value ? "default" : "outline"}
                  onClick={() => setSelectedCity(city.value)}
                  size="sm"
                >
                  {city.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No vendors found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} {...vendor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
