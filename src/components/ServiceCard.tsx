import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  image_url?: string;
}

export const ServiceCard = ({ id, title, description, price, category, city, image_url }: ServiceCardProps) => {
  return (
    <Link to={`/service/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-border/50">
        <div className="aspect-video overflow-hidden bg-muted">
          {image_url && (
            <img 
              src={image_url} 
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <Badge variant="secondary" className="capitalize">
              {category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            {city}
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="w-full flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">₹{price.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">per event</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
