import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MapPin, Star, Phone, Verified } from "lucide-react";

interface VendorCardProps {
  id: string;
  name: string;
  category: string;
  city: string;
  min_price: number;
  max_price: number;
  rating: number;
  reviews_count: number;
  description?: string;
  images?: string[];
  verified: boolean;
}

export function VendorCard({
  id,
  name,
  category,
  city,
  min_price,
  max_price,
  rating,
  reviews_count,
  description,
  images,
  verified,
}: VendorCardProps) {
  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-br from-accent/10 to-primary/10 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {category === 'mehendi' && '🎨'}
            {category === 'makeup' && '💄'}
            {category === 'photography' && '📸'}
            {category === 'decor' && '🎪'}
            {category === 'dj' && '🎵'}
          </div>
        )}
        {verified && (
          <Badge className="absolute top-2 right-2 bg-green-500">
            <Verified className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <Badge variant="secondary" className="capitalize shrink-0">
            {category}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">({reviews_count} reviews)</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{city}</span>
        </div>

        <div className="pt-2">
          <p className="text-lg font-bold text-primary">
            ₹{min_price.toLocaleString()} - ₹{max_price.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Price range</p>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/vendor/${id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-accent to-primary hover:opacity-90">
            View Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
