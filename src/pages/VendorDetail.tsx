import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Star, Phone, Verified, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
    fetchVendorDetails();
    fetchVendorReviews();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchVendorDetails = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Vendor not found");
      navigate('/vendors');
      return;
    }

    setVendor(data);
    setLoading(false);
  };

  const fetchVendorReviews = async () => {
    const { data } = await supabase
      .from('vendor_reviews')
      .select(`
        *,
        profiles (full_name)
      `)
      .eq('vendor_id', id)
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(data);
    }
  };

  const handleContact = () => {
    if (!user) {
      toast.error("Please login to contact vendor");
      navigate('/auth');
      return;
    }

    navigate(`/book-vendor/${id}`);
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

  if (!vendor) return null;

  const images = vendor.images || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/vendors">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Gallery */}
            <div className="grid grid-cols-2 gap-4">
              {images.length > 0 ? (
                images.map((img: string, idx: number) => (
                  <div key={idx} className="relative h-64 rounded-lg overflow-hidden">
                    <img src={img} alt={`${vendor.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                <div className="col-span-2 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center text-6xl">
                  {vendor.category === 'mehendi' && '🎨'}
                  {vendor.category === 'makeup' && '💄'}
                  {vendor.category === 'photography' && '📸'}
                  {vendor.category === 'decor' && '🎪'}
                  {vendor.category === 'dj' && '🎵'}
                </div>
              )}
            </div>

            {/* About */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                <p className="text-muted-foreground">{vendor.description}</p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
                {reviews.length === 0 ? (
                  <p className="text-muted-foreground">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.profiles?.full_name || "Anonymous"}</span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{vendor.name}</h1>
                    {vendor.verified && (
                      <Badge className="bg-green-500">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="capitalize">{vendor.category}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{vendor.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({vendor.reviews_count} reviews)</span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.city}</span>
                </div>

                {vendor.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.phone}</span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{vendor.min_price.toLocaleString()} - ₹{vendor.max_price.toLocaleString()}
                  </p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90"
                  onClick={handleContact}
                >
                  Contact & Book
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
