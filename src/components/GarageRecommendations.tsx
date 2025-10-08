import { MapPin, Phone, Mail, Clock, Star, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getGaragesByEmirate } from "@/data/garageData";

interface GarageRecommendationsProps {
  emirate: string;
  carMake?: string;
  onStartNew: () => void;
}

const GarageRecommendations = ({ emirate, carMake, onStartNew }: GarageRecommendationsProps) => {
  const garages = getGaragesByEmirate(emirate, carMake);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Recommended Garages</h2>
          <p className="text-muted-foreground mt-1">
            Top-rated garages in {emirate} {carMake && `specialized in ${carMake}`}
          </p>
        </div>
        <Button variant="outline" onClick={onStartNew}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          New Diagnosis
        </Button>
      </div>

      {garages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No garages found for your criteria. Try selecting a different emirate.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {garages.map((garage, index) => (
            <Card key={garage.id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        #{index + 1}
                      </Badge>
                      <CardTitle className="text-xl">{garage.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold text-foreground">{garage.rating}</span>
                        <span>({garage.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{garage.emirate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{garage.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Working Hours</p>
                        <p className="text-sm text-muted-foreground">{garage.workingHours}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Specializations</p>
                      <div className="flex flex-wrap gap-2">
                        {garage.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {garage.services.map((service) => (
                          <Badge key={service} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary-hover text-primary-foreground"
                      onClick={() => window.open(`tel:${garage.phone}`, '_blank')}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-success hover:bg-success/90 text-success-foreground border-success"
                      onClick={() => window.open(`https://wa.me/${garage.whatsapp.replace(/[^0-9]/g, '')}`, '_blank')}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`mailto:${garage.email}`, '_blank')}
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </Button>
                    <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">Typical cost:</span>
                      <span className="text-foreground font-semibold">{garage.priceRange}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GarageRecommendations;