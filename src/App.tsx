import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import SpeechGenerator from './components/SpeechGenerator';
import SavedMessages from './components/SavedMessages';
import IntentClarifier from './components/IntentClarifier';

export interface GenerationRequest {
  prompt: string;
  format: string;
  tone: string;
  duration: string;
  voice: string;
  culturalContext?: string;
  roleVoice?: string;
  isPrivateMode?: boolean;
  location?: string;
  personName?: string;
  occasion?: string;
  relationship?: string;
}

export interface ClarificationNeeded {
  prompt: string;
  suggestions: {
    occasions: string[];
    tones: string[];
    relationships: string[];
  };
}

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'generator' | 'saved' | 'clarify'>('landing');
  const [generationRequest, setGenerationRequest] = useState<GenerationRequest | null>(null);
  const [clarificationData, setClarificationData] = useState<ClarificationNeeded | null>(null);

  const handleGenerateClick = (request: GenerationRequest) => {
    // Check if prompt needs clarification
    if (needsClarification(request.prompt)) {
      setClarificationData({
        prompt: request.prompt,
        suggestions: generateSuggestions(request.prompt)
      });
      setCurrentView('clarify');
    } else {
      setGenerationRequest(request);
      setCurrentView('generator');
    }
  };

  const handleClarificationComplete = (clarifiedRequest: GenerationRequest) => {
    setGenerationRequest(clarifiedRequest);
    setClarificationData(null);
    setCurrentView('generator');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    setGenerationRequest(null);
    setClarificationData(null);
  };

  const handleViewSaved = () => {
    setCurrentView('saved');
  };

  const needsClarification = (prompt: string): boolean => {
    const vague = ['message', 'speech', 'toast', 'letter', 'something'];
    const words = prompt.toLowerCase().split(' ');
    return vague.some(word => words.includes(word)) && words.length < 5;
  };

  const generateSuggestions = (prompt: string) => {
    const occasions = ['birthday', 'wedding', 'graduation', 'apology', 'thank you', 'farewell', 'anniversary', 'funeral', 'promotion'];
    const tones = ['funny', 'heartfelt', 'emotional', 'formal', 'romantic', 'religious', 'motivational'];
    const relationships = ['mother', 'father', 'sister', 'brother', 'friend', 'colleague', 'teacher', 'boss', 'partner'];
    
    return { occasions, tones, relationships };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {currentView === 'landing' && (
        <LandingPage 
          onGenerateClick={handleGenerateClick}
          onViewSaved={handleViewSaved}
        />
      )}
      {currentView === 'clarify' && clarificationData && (
        <IntentClarifier
          data={clarificationData}
          onComplete={handleClarificationComplete}
          onBack={handleBackToHome}
        />
      )}
      {currentView === 'generator' && generationRequest && (
        <SpeechGenerator 
          request={generationRequest}
          onBackToHome={handleBackToHome}
        />
      )}
      {currentView === 'saved' && (
        <SavedMessages onBackToHome={handleBackToHome} />
      )}
    </div>
  );
}

export default App;