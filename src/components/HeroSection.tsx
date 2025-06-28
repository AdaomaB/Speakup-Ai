import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, MessageCircle, Bookmark, Mic, Clock, User, Shield, Globe, Palette } from 'lucide-react';
import { GenerationRequest } from '../App';

interface HeroSectionProps {
  onGenerateClick: (request: GenerationRequest) => void;
  onViewSaved: () => void;
}

const formats = [
  { id: 'message', label: 'Message', icon: '💬' },
  { id: 'toast', label: 'Toast', icon: '🥂' },
  { id: 'speech', label: 'Full Speech', icon: '🎤' },
  { id: 'letter', label: 'Letter', icon: '✉️' },
  { id: 'poem', label: 'Poem', icon: '📝' },
  { id: 'rap', label: 'Rap', icon: '🎵' },
  { id: 'prayer', label: 'Prayer', icon: '🙏' }
];

const tones = [
  { id: 'funny', label: 'Funny', icon: '😄' },
  { id: 'heartfelt', label: 'Heartfelt', icon: '❤️' },
  { id: 'emotional', label: 'Emotional', icon: '😭' },
  { id: 'formal', label: 'Formal', icon: '💼' },
  { id: 'romantic', label: 'Romantic', icon: '💕' },
  { id: 'religious', label: 'Religious', icon: '✝️' },
  { id: 'childlike', label: 'Child-like', icon: '🧒' }
];

const durations = [
  { id: '15s', label: '15 seconds' },
  { id: '30s', label: '30 seconds' },
  { id: '1min', label: '1 minute' },
  { id: '2min', label: '2 minutes' },
  { id: '3min', label: '3 minutes' },
  { id: '5min', label: '5 minutes' },
  { id: 'custom', label: 'Custom length' }
];

const voices = [
  { id: 'adult-male', label: 'Adult Male', icon: '👨' },
  { id: 'adult-female', label: 'Adult Female', icon: '👩' },
  { id: 'teen', label: 'Teen', icon: '👦' },
  { id: 'child-male', label: 'Boy Child', icon: '🧒' },
  { id: 'child-female', label: 'Girl Child', icon: '👧' }
];

const culturalContexts = [
  { id: 'universal', label: 'Universal', icon: '🌍' },
  { id: 'african', label: 'African Style', icon: '🌍' },
  { id: 'american', label: 'American', icon: '🇺🇸' },
  { id: 'british', label: 'British', icon: '🇬🇧' },
  { id: 'nigerian', label: 'Nigerian', icon: '🇳🇬' },
  { id: 'christian', label: 'Christian', icon: '✝️' },
  { id: 'islamic', label: 'Islamic', icon: '☪️' }
];

const roleVoices = [
  { id: 'self', label: 'As Myself', icon: '👤' },
  { id: 'pet', label: 'From My Pet', icon: '🐕' },
  { id: 'grandma', label: 'Like Grandma', icon: '👵' },
  { id: 'future-self', label: 'Future Self', icon: '🔮' },
  { id: 'child-self', label: 'Child Self', icon: '👶' },
  { id: 'wise-elder', label: 'Wise Elder', icon: '🧙‍♂️' }
];

const HeroSection: React.FC<HeroSectionProps> = ({ onGenerateClick, onViewSaved }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('speech');
  const [selectedTone, setSelectedTone] = useState('heartfelt');
  const [selectedDuration, setSelectedDuration] = useState('2min');
  const [selectedVoice, setSelectedVoice] = useState('adult-female');
  const [selectedCulture, setSelectedCulture] = useState('universal');
  const [selectedRole, setSelectedRole] = useState('self');
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userLocation, setUserLocation] = useState('');

  useEffect(() => {
    // Get user's location for personalization
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd reverse geocode this to get city/country
          setUserLocation('Your Location');
        },
        () => {
          setUserLocation('');
        }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerateClick({
        prompt: prompt.trim(),
        format: selectedFormat,
        tone: selectedTone,
        duration: selectedDuration,
        voice: selectedVoice,
        culturalContext: selectedCulture,
        roleVoice: selectedRole,
        isPrivateMode,
        location: userLocation
      });
    }
  };

  return (
    <section className="relative px-6 py-12 lg:py-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <Heart className="absolute top-32 right-32 text-pink-300 w-8 h-8 animate-pulse" />
        <MessageCircle className="absolute top-60 left-32 text-blue-300 w-6 h-6 animate-bounce" />
        <Sparkles className="absolute bottom-60 right-40 text-purple-300 w-7 h-7 animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              SpeakUp AI
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPrivateMode(!isPrivateMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isPrivateMode 
                  ? 'bg-gray-800 text-white border-gray-700' 
                  : 'bg-white/80 backdrop-blur-sm border-purple-200 hover:bg-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="font-medium">{isPrivateMode ? 'Private' : 'Normal'}</span>
            </button>
            <button
              onClick={onViewSaved}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-purple-200 hover:bg-white transition-all"
            >
              <Bookmark className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700 font-medium">Saved Messages</span>
            </button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6 leading-tight">
            Say the Right Words.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Every Time.
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            From weddings to awkward apologies, SpeakUp AI writes exactly what you need with perfect tone, style, and timing.
          </p>
        </div>

        {/* Main Generation Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
            {/* Prompt Input */}
            <div className="mb-8">
              <label htmlFor="prompt" className="block text-left text-gray-700 font-semibold mb-4 text-lg">
                What's the occasion and who's it for? (Include names, relationships, specific details)
              </label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Birthday speech for my sister Sarah who loves cooking, Apology to my best friend Mike after our argument, Wedding toast for my daughter Emma and her fiancé James..."
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-white/80"
              />
            </div>

            {/* Basic Options Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Format Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Format
                </label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/80"
                >
                  {formats.map((format) => (
                    <option key={format.id} value={format.id}>
                      {format.icon} {format.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Tone
                </label>
                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/80"
                >
                  {tones.map((tone) => (
                    <option key={tone.id} value={tone.id}>
                      {tone.icon} {tone.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/80"
                >
                  {durations.map((duration) => (
                    <option key={duration.id} value={duration.id}>
                      {duration.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voice Selection */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Voice
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/80"
                >
                  {voices.map((voice) => (
                    <option key={voice.id} value={voice.id}>
                      {voice.icon} {voice.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                <Palette className="w-4 h-4" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 bg-purple-50 rounded-2xl border border-purple-200">
                {/* Cultural Context */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Cultural Context
                  </label>
                  <select
                    value={selectedCulture}
                    onChange={(e) => setSelectedCulture(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  >
                    {culturalContexts.map((culture) => (
                      <option key={culture.id} value={culture.id}>
                        {culture.icon} {culture.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Voice */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Speak As
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                  >
                    {roleVoices.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Generate Button */}
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-5 px-8 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none text-xl shadow-xl"
            >
              <Sparkles className="inline-block w-6 h-6 mr-3" />
              Generate Now
            </button>

            {/* Private Mode Notice */}
            {isPrivateMode && (
              <div className="mt-4 p-4 bg-gray-800 text-white rounded-xl text-center">
                <Shield className="inline-block w-5 h-5 mr-2" />
                Private Mode: Your message won't be saved and will be deleted after this session
              </div>
            )}
          </div>
        </form>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8 text-sm">
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 flex items-center gap-2">
            ✨ No login required
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 flex items-center gap-2">
            🎯 Intent clarity analyzer
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 flex items-center gap-2">
            🔊 Multi-voice text-to-speech
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 flex items-center gap-2">
            🌍 Cultural context aware
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 flex items-center gap-2">
            📥 Multiple export formats
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;