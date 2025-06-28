import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Target, Heart, Users, Calendar } from 'lucide-react';
import { GenerationRequest, ClarificationNeeded } from '../App';

interface IntentClarifierProps {
  data: ClarificationNeeded;
  onComplete: (request: GenerationRequest) => void;
  onBack: () => void;
}

const IntentClarifier: React.FC<IntentClarifierProps> = ({ data, onComplete, onBack }) => {
  const [selectedOccasion, setSelectedOccasion] = useState('');
  const [selectedTone, setSelectedTone] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState('');
  const [customDetails, setCustomDetails] = useState('');

  const handleComplete = () => {
    const enhancedPrompt = `${selectedOccasion} ${selectedTone} message for my ${selectedRelationship}. ${customDetails}`;
    
    onComplete({
      prompt: enhancedPrompt,
      format: 'message',
      tone: selectedTone || 'heartfelt',
      duration: '2min',
      voice: 'adult-female',
      occasion: selectedOccasion,
      relationship: selectedRelationship
    });
  };

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-600" />
            Intent Clarity Analyzer
          </h1>
          <div></div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-purple-600" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Let's Make This Perfect
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Your prompt: <span className="font-semibold italic">"{data.prompt}"</span>
            </p>
            <p className="text-gray-500">
              I need a few more details to create exactly what you're looking for
            </p>
          </div>

          <div className="space-y-8">
            {/* Occasion Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                What's the occasion?
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {data.suggestions.occasions.map((occasion) => (
                  <button
                    key={occasion}
                    onClick={() => setSelectedOccasion(occasion)}
                    className={`p-3 rounded-xl border-2 transition-all capitalize ${
                      selectedOccasion === occasion
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    {occasion}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                What tone would you like?
              </label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {data.suggestions.tones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`p-3 rounded-xl border-2 transition-all capitalize ${
                      selectedTone === tone
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Who is this for?
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {data.suggestions.relationships.map((relationship) => (
                  <button
                    key={relationship}
                    onClick={() => setSelectedRelationship(relationship)}
                    className={`p-3 rounded-xl border-2 transition-all capitalize ${
                      selectedRelationship === relationship
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-purple-300 text-gray-700'
                    }`}
                  >
                    {relationship}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div>
              <label className="block text-gray-700 font-semibold mb-4">
                Any specific details or memories to include? (Optional)
              </label>
              <textarea
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="e.g., mention their love for cooking, our trip to Paris, their graduation..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/80"
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleComplete}
              disabled={!selectedOccasion || !selectedTone || !selectedRelationship}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none text-lg shadow-xl"
            >
              Generate My Perfect Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentClarifier;