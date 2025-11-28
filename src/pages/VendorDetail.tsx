import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MapPin, Star, Phone, CheckCircle, ArrowLeft, MessageCircle, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    checkAuth();
    fetchVendorDetails();
  }, [id]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
  };

  const fetchVendorDetails = async () => {
    const { data: vendorData, error: vendorError } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', id)
      .single();

    if (vendorError) {
      toast.error("Vendor not found");
      navigate('/vendors');
      return;
    }

    const { data: reviewsData } = await supabase
      .from('vendor_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .eq('vendor_id', id)
      .order('created_at', { ascending: false });

    setVendor(vendorData);
    setReviews(reviewsData || []);
    setLoading(false);
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

  const images = vendor?.images || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link to="/vendors">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
        </Link>

        {/* Hero Gallery Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
              {images.length > 0 ? (
                <img 
                  src={images[selectedImage]} 
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {vendor.category === 'mehendi' && '🎨'}
                  {vendor.category === 'makeup' && '💄'}
                  {vendor.category === 'photography' && '📸'}
                  {vendor.category === 'decoration' && '🎨'}
                  {vendor.category === 'dj' && '🎵'}
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${vendor.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vendor Info Card */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{vendor.name}</CardTitle>
                    <Badge variant="secondary" className="capitalize mb-2">
                      {vendor.category.replace('_', ' ')}
                    </Badge>
                  </div>
                  {vendor.verified && (
                    <Badge className="bg-green-500 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                {vendor.rating && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{vendor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {vendor.reviews_count} reviews
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Price Range</p>
                  <p className="text-2xl font-bold text-primary">
                    ₹{vendor.min_price.toLocaleString()} - ₹{vendor.max_price.toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{vendor.city}</span>
                  </div>
                  
                  {vendor.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${vendor.phone}`} className="hover:text-primary">
                        {vendor.phone}
                      </a>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.reviews_count}+ bookings completed</span>
                  </div>
                </div>

                <Separator />

                <Button 
                  className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90" 
                  size="lg"
                  onClick={handleContact}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Vendor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* About Section */}
        {vendor.description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{vendor.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customer Reviews</CardTitle>
              <Badge variant="outline">{reviews.length} reviews</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {review.profiles?.full_name?.[0]?.toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold">
                              {review.profiles?.full_name || 'Anonymous Customer'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating
                                        ? 'fill-primary text-primary'
                                        : 'fill-muted text-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString('en-IN', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-muted-foreground mt-2 leading-relaxed">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No reviews yet. Be the first to review this vendor!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
