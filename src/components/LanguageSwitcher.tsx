import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const { toggleLanguage } = useLanguage();

  return (
    <Button
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
    >
      <Globe className="h-4 w-4" />
      {t('changeLanguage')}
    </Button>
  );
};

export default LanguageSwitcher;
