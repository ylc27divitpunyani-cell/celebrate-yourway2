import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function BookStandard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    event_date: "",
    slot: "morning",
    address: "",
    pincode: "",
  });

  useEffect(() => {
    checkAuthAndFetchService();
  }, [id]);

  const checkAuthAndFetchService = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to book a service");
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('standard_services')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      toast.error("Service not found");
      navigate('/standard-services');
      return;
    }

    setService(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please login to continue");
      navigate('/auth');
      return;
    }

    const { error } = await supabase.from('bookings').insert({
      user_id: session.user.id,
      standard_service_id: id,
      service_id: null,
      type: 'standard',
      event_date: formData.event_date,
      slot: formData.slot,
      address: formData.address,
      pincode: formData.pincode,
      status: 'pending',
    });

    setSubmitting(false);

    if (error) {
      toast.error("Failed to create booking");
      return;
    }

    toast.success("Booking submitted successfully! Awaiting confirmation.");
    navigate('/dashboard');
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book {service.title}</CardTitle>
            <p className="text-muted-foreground">Fill in the details for your celebration</p>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-1">{service.title}</p>
              <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
              <p className="text-2xl font-bold text-primary">₹{service.price.toLocaleString()}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Date</Label>
                <Input
                  id="event_date"
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slot">Time Slot</Label>
                <select
                  id="slot"
                  required
                  value={formData.slot}
                  onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 10 PM)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Event Address</Label>
                <Input
                  id="address"
                  type="text"
                  required
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  type="text"
                  required
                  placeholder="Enter pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
