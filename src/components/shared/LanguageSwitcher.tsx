'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const switchLanguage = (newLocale: 'en' | 'id') => {
    router.replace(pathname, { locale: newLocale });
  };

  const currentLocale = params.locale as string;

  return (
    <div className="flex gap-2 bg-muted p-1 rounded-lg">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-4 py-2 rounded-md transition-colors ${
          currentLocale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted-foreground/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('id')}
        className={`px-4 py-2 rounded-md transition-colors ${
          currentLocale === 'id'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-muted-foreground/10'
        }`}
      >
        ID
      </button>
    </div>
  );
}


