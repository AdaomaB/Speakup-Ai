import React from 'react';
import { Heart, Twitter, Github, Mail, Mic } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SpeakUp AI
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              Helping you find the perfect words for life's most important moments. 
              From heartfelt speeches to professional presentations, we're here to help you speak with confidence.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Speech Generator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Text-to-Speech</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Export Options</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Occasion Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Saved Messages</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500" /> for better communication
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>© 2025 SpeakUp AI. All rights reserved.</span>
              <span>Powered by Advanced AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;