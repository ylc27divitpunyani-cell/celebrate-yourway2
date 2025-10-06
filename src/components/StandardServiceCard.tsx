import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";

interface StandardServiceCardProps {
  id: string;
  title: string;
  category: string;
  description?: string;
  price: number;
  city: string;
  duration?: string;
  image_url?: string;
}

export function StandardServiceCard({
  id,
  title,
  category,
  description,
  price,
  city,
  duration,
  image_url,
}: StandardServiceCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
        {image_url ? (
          <img src={image_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {category === 'birthday' && '🎂'}
            {category === 'anniversary' && '💕'}
            {category === 'baby_shower' && '👶'}
            {category === 'proposal' && '💍'}
          </div>
        )}
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
          <Badge variant="secondary" className="capitalize shrink-0">
            {category.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{city}</span>
          </div>
          {duration && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Fixed package price</p>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/book-standard/${id}`} className="w-full">
          <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
