import React from 'react';
import { 
  Mic, 
  Palette, 
  FileText, 
  Lightbulb, 
  Users, 
  Volume2, 
  RefreshCw, 
  Download,
  Clock,
  Calendar,
  Zap,
  Camera
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: "One-Prompt Generator",
    description: "Just describe your need in natural language and get instant results"
  },
  {
    icon: Palette,
    title: "Tone & Style Picker",
    description: "Choose from Funny, Heartfelt, Formal, Poetic, and more styles"
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Generate toasts, full speeches, messages, or poems"
  },
  {
    icon: Lightbulb,
    title: "Delivery Advice",
    description: "Get tips on pacing, timing, and emotional delivery"
  },
  {
    icon: Users,
    title: "Style Mimicry",
    description: "Write like Obama, Shakespeare, or your future self"
  },
  {
    icon: Volume2,
    title: "Text-to-Speech",
    description: "Listen to your speech with natural voice options"
  },
  {
    icon: RefreshCw,
    title: "AI Rewrite Options",
    description: "Make it shorter, funnier, more formal, or add quotes"
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description: "Download as PDF, image, or MP3 voice note"
  },
  {
    icon: Clock,
    title: "Speech Timing",
    description: "See estimated duration and delivery pace suggestions"
  },
  {
    icon: Calendar,
    title: "Occasion Calendar",
    description: "Get prompts for upcoming holidays and events"
  },
  {
    icon: Zap,
    title: "Emergency Mode",
    description: "Last-minute speeches generated in 30 seconds"
  },
  {
    icon: Camera,
    title: "Memory Integration",
    description: "Include personal details and memories in your speech"
  }
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Everything You Need to Speak with Confidence
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help you craft and deliver the perfect message for any occasion
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:from-blue-200 group-hover:to-purple-200 transition-all">
                  <Icon className="w-6 h-6 text-purple-600" />
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-4 bg-white rounded-full px-8 py-4 shadow-lg border border-purple-100">
            <span className="text-2xl">🎯</span>
            <span className="font-medium text-gray-700">
              Perfect for weddings, funerals, work events, apologies, celebrations & more
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;