import React from 'react';
import HeroSection from './HeroSection';
import FeaturesShowcase from './FeaturesShowcase';
import HowItWorks from './HowItWorks';
import OccasionCalendar from './OccasionCalendar';
import Footer from './Footer';
import { GenerationRequest } from '../App';

interface LandingPageProps {
  onGenerateClick: (request: GenerationRequest) => void;
  onViewSaved: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGenerateClick, onViewSaved }) => {
  return (
    <div className="min-h-screen">
      <HeroSection onGenerateClick={onGenerateClick} onViewSaved={onViewSaved} />
      <FeaturesShowcase />
      <HowItWorks />
      <OccasionCalendar onGenerateClick={onGenerateClick} />
      <Footer />
    </div>
  );
};

export default LandingPage;