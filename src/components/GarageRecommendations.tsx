import { MapPin, Phone, Clock, Star, MessageCircle, ArrowLeft, Globe, AlertCircle, RefreshCw, ExternalLink, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGarageSearch } from "@/hooks/useGarageSearchOSM";
import GarageMap from "@/components/GarageMap";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface GarageRecommendationsProps {
  emirate: string;
  carMake: string;
  issue: string;
  onStartNew: () => void;
}

const GarageRecommendations = ({ emirate, carMake, issue, onStartNew }: GarageRecommendationsProps) => {
  const { garages, loading, error, hasSearched, searchGarages, retrySearch } = useGarageSearch();
  const { t } = useTranslation();

  useEffect(() => {
    if (emirate && carMake && issue) {
      searchGarages(emirate, carMake, issue);
    }
  }, [emirate, carMake, issue, searchGarages]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t('findingGarages')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('searchingSpecialists', { carMake, emirate, issue })}
            </p>
          </div>
          <Button variant="outline" onClick={onStartNew}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('newDiagnosis')}
          </Button>
        </div>
        
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-lg">
              <CardContent className="py-8">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{t('garageSearchError')}</h2>
            <p className="text-muted-foreground mt-1">
              {t('unableToFindGarages', { carMake, emirate })}
            </p>
          </div>
          <Button variant="outline" onClick={onStartNew}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('newDiagnosis')}
          </Button>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={retrySearch}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('retry')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t('recommendedGarages')} {emirate}</h2>
          <p className="text-muted-foreground mt-1">
            {garages.length} {t('nearYou')}
          </p>
        </div>
        <Button variant="outline" onClick={onStartNew}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('newDiagnosis')}
        </Button>
      </div>

      {/* Add map view */}
      {garages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{t('garageLocations')}</h3>
          <GarageMap garages={garages} />
        </div>
      )}

      {garages.length === 0 && hasSearched ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {t('noGaragesFound')}
            </p>
            <Button variant="outline" onClick={retrySearch}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('searchAgain')}
            </Button>
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
                      {garage.isOpen !== undefined && (
                        <Badge variant={garage.isOpen ? "default" : "secondary"}>
                          {garage.isOpen ? t('openNow') : t('closed')}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold text-foreground">{garage.rating.toFixed(1)}</span>
                        <span>({garage.reviews} {t('reviews')})</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{garage.emirate}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {t('relevanceScore')}: {garage.relevanceScore.toFixed(1)}
                      </Badge>
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
                        <p className="text-sm font-medium">{t('address')}</p>
                        <p className="text-sm text-muted-foreground">{garage.address}</p>
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 h-auto text-xs"
                          onClick={() => window.open(`https://www.google.com/maps?q=${garage.coordinates.lat},${garage.coordinates.lng}`, '_blank')}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          {t('viewOnMap')}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{t('workingHours')}</p>
                        <p className="text-sm text-muted-foreground">{garage.workingHours}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">{t('services')}</p>
                      <div className="flex flex-wrap gap-2">
                        {garage.services.map((service) => (
                          <Badge key={service} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    {garage.carMakeRelevance > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">{carMake} {t('specialization')}</p>
                        <div className="flex items-center gap-2">
                          <div className="h-2 bg-muted rounded-full flex-1">
                            <div 
                              className="h-2 bg-primary rounded-full transition-all"
                              style={{ width: `${Math.min(garage.carMakeRelevance * 10, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(garage.carMakeRelevance * 10)}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {garage.reviewHighlights.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">{t('customerReviews')}</p>
                    <div className="space-y-2">
                      {garage.reviewHighlights.map((highlight, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary-hover text-primary-foreground"
                      onClick={() => window.open(`tel:${garage.phone}`, '_blank')}
                      disabled={garage.phone === 'N/A'}
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {garage.phone === 'N/A' ? t('noPhone') : t('callGarage')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      onClick={() => window.open(`https://wa.me/${garage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(t('whatsappMessage', { carMake, issue }))}`, '_blank')}
                      disabled={garage.phone === 'N/A'}
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t('whatsApp')}
                    </Button>
                    {garage.website && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(garage.website, '_blank')}
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        {t('visitWebsite')}
                      </Button>
                    )}
                    <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">{t('osmSource')}</span>
                      <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">
                        <Leaf className="mr-1 h-3 w-3" />
                        {t('openData')}
                      </Badge>
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