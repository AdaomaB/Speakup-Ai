import React from 'react';
import { Calendar, Heart, GraduationCap, Gift, Cake, Star } from 'lucide-react';
import { GenerationRequest } from '../App';

interface OccasionCalendarProps {
  onGenerateClick: (request: GenerationRequest) => void;
}

const occasions = [
  {
    icon: Heart,
    title: "Valentine's Day",
    date: "Feb 14",
    prompts: [
      "Romantic message for my partner",
      "Love poem for my girlfriend",
      "Valentine's Day toast"
    ],
    color: "from-pink-500 to-red-500"
  },
  {
    icon: GraduationCap,
    title: "Graduation Season",
    date: "May-Jun",
    prompts: [
      "Graduation speech for my daughter",
      "Congratulations message to graduate",
      "Motivational speech for students"
    ],
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: Gift,
    title: "Mother's Day",
    date: "May 12",
    prompts: [
      "Heartfelt message for my mom",
      "Mother's Day speech",
      "Thank you letter to mother"
    ],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Cake,
    title: "Birthday Season",
    date: "Year-round",
    prompts: [
      "Birthday toast for best friend",
      "Funny birthday message",
      "Birthday speech for family"
    ],
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Star,
    title: "New Year",
    date: "Jan 1",
    prompts: [
      "New Year motivational speech",
      "Resolution message",
      "Year-end reflection"
    ],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Heart,
    title: "Wedding Season",
    date: "Jun-Sep",
    prompts: [
      "Wedding toast for bride",
      "Best man speech",
      "Maid of honor speech"
    ],
    color: "from-rose-500 to-pink-500"
  }
];

const OccasionCalendar: React.FC<OccasionCalendarProps> = ({ onGenerateClick }) => {
  const handlePromptClick = (prompt: string) => {
    onGenerateClick({
      prompt,
      format: 'speech',
      tone: 'heartfelt',
      duration: '2min',
      voice: 'adult-female'
    });
  };

  return (
    <section className="py-20 px-6 bg-white/40 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
              Occasion Calendar
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get inspired with ready-made prompts for upcoming events and special moments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {occasions.map((occasion, index) => {
            const Icon = occasion.icon;
            return (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${occasion.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{occasion.title}</h3>
                    <p className="text-gray-500 text-sm">{occasion.date}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {occasion.prompts.map((prompt, promptIndex) => (
                    <button
                      key={promptIndex}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full text-left p-3 bg-gray-50 hover:bg-purple-50 rounded-lg transition-colors border border-gray-200 hover:border-purple-200"
                    >
                      <span className="text-gray-700 hover:text-purple-700 font-medium">
                        "{prompt}"
                      </span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Click any prompt to generate instantly
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">🎉 Surprise Me Mode</h3>
            <p className="mb-6 opacity-90">
              Not sure what to write? Let our AI suggest the perfect prompt for you!
            </p>
            <button 
              onClick={() => handlePromptClick("Surprise me with a heartfelt message")}
              className="bg-white text-purple-600 font-bold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Generate Random Prompt
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OccasionCalendar;