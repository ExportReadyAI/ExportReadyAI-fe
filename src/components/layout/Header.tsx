'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LanguageSwitcher from '@/components/shared/LanguageSwitcher';

export default function Header() {
  const t = useTranslations('nav');

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Export System
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-primary transition-colors">
            {t('home')}
          </Link>
          <Link href="/about" className="hover:text-primary transition-colors">
            {t('about')}
          </Link>
          
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}


