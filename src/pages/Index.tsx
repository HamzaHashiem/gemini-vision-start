import { useState } from "react";
import { Car, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import CarDiagnosticForm from "@/components/CarDiagnosticForm";
import DiagnosisResult from "@/components/DiagnosisResult";
import GarageRecommendations from "@/components/GarageRecommendations";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Index = () => {
  const [step, setStep] = useState<"form" | "diagnosis" | "garages">("form");
  const [diagnosisData, setDiagnosisData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);

  const handleDiagnosisComplete = (data: any, form: any) => {
    setDiagnosisData(data);
    setFormData(form);
    setStep("diagnosis");
  };

  const handleFindGarages = () => {
    setStep("garages");
  };

  const handleStartNew = () => {
    setStep("form");
    setDiagnosisData(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-hero text-primary-foreground py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <Wrench className="h-10 w-10 md:h-12 md:w-12" />
              <h1 className="text-3xl md:text-5xl font-bold">UAE Car Diagnostics</h1>
            </div>
            <div className="absolute right-4 top-4">
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-center text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            AI-powered car diagnostics & trusted garage recommendations across the UAE
          </p>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mt-8 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "form" ? "bg-accent text-accent-foreground" : "bg-primary-foreground/20 text-primary-foreground/60"
              }`}>
                <Car className="h-4 w-4" />
              </div>
              <span className="text-sm hidden sm:inline">Describe Issue</span>
            </div>
            <div className="h-0.5 w-12 bg-primary-foreground/20" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "diagnosis" ? "bg-accent text-accent-foreground" : "bg-primary-foreground/20 text-primary-foreground/60"
              }`}>
                <Search className="h-4 w-4" />
              </div>
              <span className="text-sm hidden sm:inline">AI Diagnosis</span>
            </div>
            <div className="h-0.5 w-12 bg-primary-foreground/20" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === "garages" ? "bg-accent text-accent-foreground" : "bg-primary-foreground/20 text-primary-foreground/60"
              }`}>
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-sm hidden sm:inline">Find Garages</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        {step === "form" && (
          <div className="max-w-4xl mx-auto">
            <CarDiagnosticForm onComplete={handleDiagnosisComplete} />
          </div>
        )}

        {step === "diagnosis" && diagnosisData && (
          <div className="max-w-4xl mx-auto">
            <DiagnosisResult 
              diagnosis={diagnosisData.diagnosis} 
              onFindGarages={handleFindGarages}
              onStartNew={handleStartNew}
            />
          </div>
        )}

        {step === "garages" && formData && (
          <div className="max-w-6xl mx-auto">
            <GarageRecommendations 
              carMake={formData.carMake}
              emirate={formData.emirate}
              issue={formData.issue || 'general maintenance'}
              onStartNew={handleStartNew}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p className="text-sm">© 2025 UAE Car Diagnostics. Powered by AI for accurate vehicle diagnostics.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;