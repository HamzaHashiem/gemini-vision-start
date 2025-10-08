import { CheckCircle2, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DiagnosisResultProps {
  diagnosis: string;
  onFindGarages: () => void;
  onStartNew: () => void;
}

const DiagnosisResult = ({ diagnosis, onFindGarages, onStartNew }: DiagnosisResultProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="bg-gradient-card">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-success" />
            <CardTitle className="text-2xl">AI Diagnostic Analysis</CardTitle>
          </div>
          <CardDescription>Here's what our AI diagnostic system found</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="prose prose-blue max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {diagnosis}
            </div>
          </div>

          <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-foreground mb-1">Important Notice</p>
                <p className="text-muted-foreground">
                  This AI diagnosis is for informational purposes only. Always consult with a certified mechanic 
                  for professional advice and proper vehicle inspection.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={onFindGarages}
          size="lg"
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Search className="mr-2 h-5 w-5" />
          Find Nearby Garages
        </Button>
        <Button 
          onClick={onStartNew}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          Start New Diagnosis
        </Button>
      </div>
    </div>
  );
};

export default DiagnosisResult;