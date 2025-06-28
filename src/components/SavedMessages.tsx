import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Trash2, Copy, Volume2, Calendar, FileText, Search, Filter, Download, Share2 } from 'lucide-react';

interface SavedMessage {
  id: number;
  text: string;
  prompt: string;
  format: string;
  tone: string;
  createdAt: string;
}

interface SavedMessagesProps {
  onBackToHome: () => void;
}

const SavedMessages: React.FC<SavedMessagesProps> = ({ onBackToHome }) => {
  const [savedMessages, setSavedMessages] = useState<SavedMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SavedMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormat, setFilterFormat] = useState('all');
  const [filterTone, setFilterTone] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('speakup-saved-messages');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }
  }, []);

  const deleteMessage = (id: number) => {
    const updated = savedMessages.filter(msg => msg.id !== id);
    setSavedMessages(updated);
    localStorage.setItem('speakup-saved-messages', JSON.stringify(updated));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const playMessage = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportAllMessages = () => {
    const dataStr = JSON.stringify(savedMessages, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'speakup-ai-saved-messages.json';
    link.click();
  };

  const filteredMessages = savedMessages.filter(message => {
    const matchesSearch = message.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = filterFormat === 'all' || message.format === filterFormat;
    const matchesTone = filterTone === 'all' || message.tone === filterTone;
    
    return matchesSearch && matchesFormat && matchesTone;
  });

  const formats = [...new Set(savedMessages.map(msg => msg.format))];
  const tones = [...new Set(savedMessages.map(msg => msg.tone))];

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-purple-600" />
            Saved Messages
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filteredMessages.length} of {savedMessages.length} messages
            </span>
            {savedMessages.length > 0 && (
              <button
                onClick={exportAllMessages}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export All
              </button>
            )}
          </div>
        </div>

        {savedMessages.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved messages yet</h3>
            <p className="text-gray-500 mb-6">
              Generate some speeches and save your favorites to see them here
            </p>
            <button
              onClick={onBackToHome}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Create Your First Speech
            </button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 mb-8">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <select
                    value={filterFormat}
                    onChange={(e) => setFilterFormat(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Formats</option>
                    {formats.map(format => (
                      <option key={format} value={format} className="capitalize">
                        {format}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <select
                    value={filterTone}
                    onChange={(e) => setFilterTone(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    <option value="all">All Tones</option>
                    {tones.map(tone => (
                      <option key={tone} value={tone} className="capitalize">
                        {tone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Messages List */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">Your Messages</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => setSelectedMessage(message)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedMessage?.id === message.id
                          ? 'bg-purple-50 border-purple-200'
                          : 'bg-white border-gray-200 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                            {message.format}
                          </span>
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full capitalize">
                            {message.tone}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMessage(message.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 font-medium mb-2 line-clamp-2">
                        {message.prompt}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(message.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <div className="bg-white rounded-xl shadow-lg border border-purple-100">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-purple-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          {selectedMessage.format.charAt(0).toUpperCase() + selectedMessage.format.slice(1)}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full capitalize">
                            {selectedMessage.tone}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(selectedMessage.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-2 italic">"{selectedMessage.prompt}"</p>
                    </div>

                    <div className="p-6">
                      <div className="prose max-w-none mb-6">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-line">
                          {selectedMessage.text}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => copyToClipboard(selectedMessage.text)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          Copy
                        </button>
                        
                        <button
                          onClick={() => playMessage(selectedMessage.text)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Volume2 className="w-4 h-4" />
                          Listen
                        </button>

                        <button
                          onClick={() => {
                            const dataStr = JSON.stringify(selectedMessage, null, 2);
                            const dataBlob = new Blob([dataStr], { type: 'application/json' });
                            const url = URL.createObjectURL(dataBlob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `message-${selectedMessage.id}.json`;
                            link.click();
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export
                        </button>

                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                          <Share2 className="w-4 h-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a message</h3>
                    <p className="text-gray-500">
                      Choose a saved message from the list to view and manage it
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SavedMessages;