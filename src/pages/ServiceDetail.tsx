import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import mehendi from "@/assets/mehendi-service.jpg";
import balloon from "@/assets/balloon-decor-service.jpg";
import photography from "@/assets/photography-service.jpg";

const serviceImages: Record<string, string> = {
  "mehendi": mehendi,
  "decor": balloon,
  "photography": photography,
};

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchServiceAndReviews();
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchServiceAndReviews = async () => {
    setLoading(true);
    
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', id)
      .single();

    if (!serviceError && serviceData) {
      setService({
        ...serviceData,
        image_url: serviceData.image_url || serviceImages[serviceData.category]
      });
    }

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, profiles(full_name)')
      .eq('service_id', id)
      .order('created_at', { ascending: false });

    if (reviewsData) {
      setReviews(reviewsData);
    }

    setLoading(false);
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please login to book a service");
      navigate('/auth');
      return;
    }
    navigate(`/book/${id}`);
  };

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

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Service not found</h1>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            {service.image_url && (
              <img 
                src={service.image_url} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">{service.title}</h1>
                <Badge variant="secondary" className="capitalize">
                  {service.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {service.city}
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {averageRating} ({reviews.length} reviews)
                  </div>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{service.description}</p>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-primary">₹{service.price.toLocaleString()}</span>
                <span className="text-muted-foreground">per event</span>
              </div>

              <Button 
                onClick={handleBookNow}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-accent text-accent' : 'text-muted'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground mt-2">{review.comment}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
