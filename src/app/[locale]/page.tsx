import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function HomePage() {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <main className="text-center space-y-6 max-w-4xl">
        <h1 className="text-5xl font-bold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('subtitle')}
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('getStarted')}
          </Link>
        </div>

        <div className="mt-16 p-8 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {tCommon('welcome')}
          </h2>
          <p className="text-muted-foreground">
            This is a professional Next.js starter with:
          </p>
          <ul className="mt-4 space-y-2 text-left max-w-md mx-auto">
            <li>✅ Next.js 15 with App Router</li>
            <li>✅ TypeScript</li>
            <li>✅ Tailwind CSS</li>
            <li>✅ shadcn/ui Components</li>
            <li>✅ next-intl (EN/ID)</li>
            <li>✅ Axios API Client</li>
            <li>✅ Zustand State Management</li>
            <li>✅ Professional Folder Structure</li>
          </ul>
        </div>
      </main>
    </div>
  );
}


