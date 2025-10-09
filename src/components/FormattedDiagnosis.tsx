import { AlertCircle, CheckCircle2, Wrench, DollarSign, ClipboardList, Info } from 'lucide-react';

interface FormattedDiagnosisProps {
  diagnosis: string;
}

const FormattedDiagnosis = ({ diagnosis }: FormattedDiagnosisProps) => {
  // Parse the diagnosis text into sections
  const sections = diagnosis.split('##').filter(s => s.trim());
  
  const getSectionIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('summary')) return <Info className="h-5 w-5" />;
    if (lowerTitle.includes('causes')) return <AlertCircle className="h-5 w-5" />;
    if (lowerTitle.includes('severity')) return <CheckCircle2 className="h-5 w-5" />;
    if (lowerTitle.includes('cost')) return <DollarSign className="h-5 w-5" />;
    if (lowerTitle.includes('actions') || lowerTitle.includes('recommended')) return <ClipboardList className="h-5 w-5" />;
    if (lowerTitle.includes('parts')) return <Wrench className="h-5 w-5" />;
    return <Info className="h-5 w-5" />;
  };

  const getSectionColor = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('summary')) return 'border-primary/30 bg-primary/5';
    if (lowerTitle.includes('causes')) return 'border-warning/30 bg-warning/5';
    if (lowerTitle.includes('severity')) return 'border-destructive/30 bg-destructive/5';
    if (lowerTitle.includes('cost')) return 'border-accent/30 bg-accent/5';
    if (lowerTitle.includes('actions')) return 'border-success/30 bg-success/5';
    if (lowerTitle.includes('parts')) return 'border-muted/30 bg-muted/5';
    return 'border-border bg-card';
  };

  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();

        return (
          <div
            key={index}
            className={`rounded-lg border-2 p-5 transition-all hover:shadow-md ${getSectionColor(title)}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="mt-0.5 text-primary">
                {getSectionIcon(title)}
              </div>
              <h3 className="text-lg font-bold text-foreground uppercase tracking-wide">
                {title}
              </h3>
            </div>
            <div className="pl-8">
              <div className="prose prose-sm max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FormattedDiagnosis;
