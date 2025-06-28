import React from 'react';
import { Brain, Wand2, Share2, Download } from 'lucide-react';

const steps = [
  {
    icon: Brain,
    title: "Describe Your Need",
    description: "Simply type what you need - 'funny wedding toast,' 'apology to my friend,' or 'farewell speech for work'",
    step: "1",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Wand2,
    title: "AI Crafts Perfectly",
    description: "Our AI instantly generates content matching your exact tone, format, duration, and style preferences",
    step: "2",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Share2,
    title: "Listen & Customize",
    description: "Hear it spoken aloud, tweak the tone, adjust length, or regenerate until it's perfect",
    step: "3",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Download,
    title: "Export & Deliver",
    description: "Download as PDF, save as image, export MP3 voice note, or share directly to social media",
    step: "4",
    color: "from-orange-500 to-red-500"
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Four simple steps to create the perfect speech, message, or toast for any moment
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg font-bold text-gray-800 shadow-lg">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Connecting arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 transform translate-x-4" />
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands who've found their perfect words with SpeakUp AI
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✨ No signup required</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">⚡ Instant results</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">🎯 Perfect accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;