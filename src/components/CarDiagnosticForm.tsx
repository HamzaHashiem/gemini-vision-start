import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CAR_MAKES, CAR_MODELS, YEARS, UAE_EMIRATES } from "@/data/carData";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  carMake: z.string().min(1, "selectMakeError"),
  carModel: z.string().min(1, "selectModelError"),
  carYear: z.string().min(1, "selectYearError"),
  issueDescription: z.string().min(10, "descriptionMinError"),
  emirate: z.string().min(1, "selectEmirateError"),
});

interface CarDiagnosticFormProps {
  onComplete: (data: any, formData: any) => void;
}

const CarDiagnosticForm = ({ onComplete }: CarDiagnosticFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carMake: "",
      carModel: "",
      carYear: "",
      issueDescription: "",
      emirate: "",
    },
  });

  const selectedMake = form.watch("carMake");
  const availableModels = selectedMake ? CAR_MODELS[selectedMake] || [] : [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("diagnose-car", {
        body: values,
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "Service Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Diagnosis Complete",
        description: "AI has analyzed your vehicle issue",
      });

      onComplete(data, values);
    } catch (error) {
      console.error("Error getting diagnosis:", error);
      toast({
        title: "Error",
        description: "Failed to get diagnosis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">{t('formTitle')}</CardTitle>
        <CardDescription>{t('formDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Car Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('vehicleInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="carMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('carMake')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectMake')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CAR_MAKES.map((make) => (
                            <SelectItem key={make} value={make}>{make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('carModel')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedMake}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectModel')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="carYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('year')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('selectYear')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Issue Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{t('issueDetails')}</h3>

              <FormField
                control={form.control}
                name="issueDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('detailedDescription')}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t('descriptionPlaceholder')}
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <FormField
              control={form.control}
              name="emirate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('yourEmirate')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectEmirate')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UAE_EMIRATES.map((emirate) => (
                        <SelectItem key={emirate} value={emirate}>{emirate}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('analyzing')}
                </>
              ) : (
                t('getAIDiagnosis')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CarDiagnosticForm;