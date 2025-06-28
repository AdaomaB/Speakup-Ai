import React from 'react';
import { 
  Mic, 
  Palette, 
  FileText, 
  Volume2, 
  RefreshCw, 
  Download,
  Clock,
  Calendar,
  Zap,
  Smile,
  Heart,
  Globe,
  Camera,
  Bookmark
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: "One-Prompt Generation",
    description: "Just describe your need in natural language and get instant, perfect results",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Multi-Tone & Style Control",
    description: "Choose from Funny, Heartfelt, Formal, Romantic, Religious, and Child-like tones",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: FileText,
    title: "Multiple Formats",
    description: "Generate messages, toasts, full speeches, letters, poems, raps, or prayers",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Volume2,
    title: "Multi-Voice Text-to-Speech",
    description: "Listen with Adult Male/Female, Teen, or Child voices with emotion control",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: RefreshCw,
    title: "AI Rewrite & Tweak",
    description: "Make it funnier, more emotional, formal, shorter, or add quotes instantly",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Download,
    title: "Export Everything",
    description: "Download as PDF, image, MP3 voice note, or share to social media",
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: Clock,
    title: "Real-Time Speech Pacer",
    description: "See exact timing and get delivery pace suggestions for perfect presentation",
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Calendar,
    title: "Occasion Calendar",
    description: "Get smart prompts for upcoming holidays, events, and special moments",
    color: "from-pink-500 to-rose-500"
  },
  {
    icon: Zap,
    title: "Emergency Mode",
    description: "Last-minute speeches generated in 30 seconds for urgent situations",
    color: "from-red-500 to-pink-500"
  },
  {
    icon: Smile,
    title: "Emo-Sticker Pack",
    description: "Auto-embed expressive emojis and stickers to enhance emotional impact",
    color: "from-cyan-500 to-blue-500"
  },
  {
    icon: Globe,
    title: "Multilingual Output",
    description: "Generate in multiple languages including French, Spanish, and local dialects",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Bookmark,
    title: "Saved Messages Hub",
    description: "Save, organize, and reuse your favorite speeches and messages",
    color: "from-violet-500 to-purple-500"
  }
];

const FeaturesShowcase: React.FC = () => {
  return (
    <section className="py-20 px-6 bg-white/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Powerful Features for Every Occasion
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to craft, customize, and deliver the perfect message with confidence and style
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="font-bold text-gray-800 mb-3 text-lg">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-xl border border-purple-100">
            <span className="text-3xl">🎯</span>
            <div className="text-left">
              <h3 className="font-bold text-gray-800 text-lg mb-1">Perfect for Every Moment</h3>
              <p className="text-gray-600">
                Weddings • Funerals • Work Events • Apologies • Celebrations • Graduations • Birthdays & More
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;