import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { DiferenciaisSection } from './components/DiferenciaisSection';
import { BlogSection } from './components/BlogSection';
import { TestimonialsSection } from './components/TestimonialsSection'
import { ContactForm } from './components/ContactForm';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <DiferenciaisSection />
          <ServicesSection />
          <BlogSection />
          <TestimonialsSection />
          <CTASection />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
