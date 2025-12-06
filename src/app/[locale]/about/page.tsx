import { useTranslations } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About</h1>
        <p className="text-lg text-muted-foreground">
          This is the about page. Add your content here.
        </p>
      </main>

      <Footer />
    </div>
  );
}


