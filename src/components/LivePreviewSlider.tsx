import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const examples = [
  {
    prompt: "Wedding speech for my sister",
    preview: "Today, I stand here not just as your brother, but as someone who has watched you grow into the incredible woman you are today. Sarah, you've always been the light in our family...",
    tone: "Heartfelt"
  },
  {
    prompt: "Farewell toast to a mentor",
    preview: "To the person who didn't just teach me the ropes, but showed me how to climb mountains I never thought possible. Your wisdom, patience, and belief in me have shaped who I am today...",
    tone: "Grateful"
  },
  {
    prompt: "Apology to my girlfriend",
    preview: "I know words can't undo what happened, but I need you to know that I understand how my actions hurt you. You mean everything to me, and I'm committed to being the partner you deserve...",
    tone: "Sincere"
  },
  {
    prompt: "Motivation after a job rejection",
    preview: "This rejection isn't a reflection of your worth—it's a redirection toward something better. Every 'no' brings you closer to the 'yes' that will change everything...",
    tone: "Motivational"
  },
  {
    prompt: "Birthday toast for my best friend",
    preview: "To the person who knows all my secrets and still chooses to be my friend! Mark, you've been my partner in crime, my voice of reason, and my biggest cheerleader for 15 years...",
    tone: "Funny & Warm"
  }
];

const LivePreviewSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % examples.length);
  };

  return (
    <section className="py-16 px-6 bg-white/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            See SpeakUp AI in Action
          </h2>
          <p className="text-lg text-gray-600">
            Real examples of speeches and messages generated in seconds
          </p>
        </div>

        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 border border-purple-100">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="lg:w-1/3">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-6 text-center">
                  <h3 className="font-semibold text-gray-800 mb-2">Prompt:</h3>
                  <p className="text-lg text-blue-700 font-medium">
                    "{examples[currentIndex].prompt}"
                  </p>
                  <span className="inline-block mt-3 px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">
                    {examples[currentIndex].tone}
                  </span>
                </div>
              </div>
              
              <div className="lg:w-2/3">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Generated Speech:</h3>
                  <p className="text-gray-700 leading-relaxed italic">
                    {examples[currentIndex].preview}
                  </p>
                  <div className="mt-4 text-sm text-gray-500">
                    Generated in 2.3 seconds ✨
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Dots indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {examples.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-purple-600 w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LivePreviewSlider;