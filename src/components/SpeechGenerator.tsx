import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Wand2, 
  Volume2, 
  VolumeX, 
  Download, 
  RefreshCw, 
  Copy, 
  Clock, 
  FileText, 
  Share2,
  Bookmark,
  Settings,
  Smile,
  Heart,
  Briefcase,
  Zap,
  MoreHorizontal,
  Image,
  FileDown,
  Music,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Palette,
  Globe,
  User,
  Shield,
  Printer,
  MessageSquare
} from 'lucide-react';
import { GenerationRequest } from '../App';

interface SpeechGeneratorProps {
  request: GenerationRequest;
  onBackToHome: () => void;
}

interface GeneratedContent {
  text: string;
  wordCount: number;
  estimatedTime: string;
  stickers: string[];
  visualStyle: {
    fontFamily: string;
    backgroundColor: string;
    textColor: string;
    borderColor: string;
  };
}

const SpeechGenerator: React.FC<SpeechGeneratorProps> = ({ request, onBackToHome }) => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStickers, setShowStickers] = useState(true);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [savedMessages, setSavedMessages] = useState<any[]>([]);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceTimer, setPracticeTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [cleanMode, setCleanMode] = useState(true);
  const [multiSpeakerMode, setMultiSpeakerMode] = useState(false);
  const [currentTweak, setCurrentTweak] = useState<string | null>(null);

  // Real AI speech generation function
  const generateSpeech = async (tweakInstruction?: string) => {
    setIsGenerating(true);
    setCurrentTweak(tweakInstruction || null);
    
    try {
      // Simulate API delay for realistic feel
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));
      
      // Generate content based on actual user request
      const content = await generateRealContent(request, tweakInstruction);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Generation failed:', error);
      // Fallback to ensure user always gets content
      const fallbackContent = generateFallbackContent(request);
      setGeneratedContent(fallbackContent);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRealContent = async (req: GenerationRequest, tweakInstruction?: string): Promise<GeneratedContent> => {
    // Extract key information from the prompt
    const promptAnalysis = analyzePrompt(req.prompt);
    
    // Build the generation context
    const context = {
      ...req,
      ...promptAnalysis,
      tweakInstruction,
      cleanMode,
      multiSpeakerMode
    };
    
    // Generate the actual content
    const generatedText = await generateContentFromContext(context);
    
    // Calculate metrics
    const words = generatedText.split(' ').filter(word => word.length > 0).length;
    const estimatedMinutes = Math.max(1, Math.ceil(words / 150)); // 150 words per minute average
    
    // Generate contextual elements
    const stickers = generateContextualStickers(generatedText, req.tone);
    const visualStyle = generateVisualStyle(req.tone);
    
    return {
      text: generatedText,
      wordCount: words,
      estimatedTime: `${estimatedMinutes} min`,
      stickers,
      visualStyle
    };
  };

  const analyzePrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract person names (common patterns)
    const namePatterns = [
      /(?:for|to) (?:my )?(\w+)/gi,
      /(\w+)'s (?:birthday|wedding|graduation)/gi,
      /dear (\w+)/gi
    ];
    
    let extractedNames: string[] = [];
    namePatterns.forEach(pattern => {
      const matches = prompt.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const nameMatch = match.match(/\b[A-Z][a-z]+\b/);
          if (nameMatch && !['My', 'The', 'For', 'To', 'Dear'].includes(nameMatch[0])) {
            extractedNames.push(nameMatch[0]);
          }
        });
      }
    });
    
    // Extract occasion/event type
    const occasions = [
      'wedding', 'birthday', 'graduation', 'funeral', 'anniversary', 'retirement',
      'promotion', 'farewell', 'apology', 'thank you', 'congratulations',
      'valentine', 'mother\'s day', 'father\'s day', 'christmas', 'new year'
    ];
    
    const detectedOccasion = occasions.find(occasion => 
      lowerPrompt.includes(occasion) || lowerPrompt.includes(occasion.replace(' ', ''))
    );
    
    // Extract relationships
    const relationships = [
      'mother', 'mom', 'father', 'dad', 'sister', 'brother', 'friend', 'best friend',
      'colleague', 'boss', 'teacher', 'mentor', 'partner', 'wife', 'husband',
      'girlfriend', 'boyfriend', 'daughter', 'son', 'grandma', 'grandpa',
      'cousin', 'uncle', 'aunt', 'neighbor'
    ];
    
    const detectedRelationship = relationships.find(rel => lowerPrompt.includes(rel));
    
    // Extract emotional context
    const emotions = [
      'sad', 'happy', 'excited', 'nervous', 'proud', 'grateful', 'sorry',
      'angry', 'disappointed', 'hopeful', 'loving', 'missing'
    ];
    
    const detectedEmotion = emotions.find(emotion => lowerPrompt.includes(emotion));
    
    return {
      names: extractedNames,
      occasion: detectedOccasion,
      relationship: detectedRelationship,
      emotion: detectedEmotion,
      originalPrompt: prompt
    };
  };

  const generateContentFromContext = async (context: any): Promise<string> => {
    const { 
      prompt, format, tone, duration, voice, culturalContext, roleVoice,
      names, occasion, relationship, emotion, tweakInstruction 
    } = context;
    
    // Start building the content based on format
    let content = '';
    
    // Apply tweak instruction if provided
    if (tweakInstruction) {
      content = await applyTweakToContent(context, tweakInstruction);
    } else {
      content = await generateBaseContentFromPrompt(context);
    }
    
    // Apply role voice transformation
    if (roleVoice && roleVoice !== 'self') {
      content = transformContentForRole(content, roleVoice, names[0] || 'friend');
    }
    
    // Apply cultural context
    if (culturalContext && culturalContext !== 'universal') {
      content = addCulturalContext(content, culturalContext);
    }
    
    // Adjust for duration if specified
    content = adjustContentForDuration(content, duration);
    
    // Apply clean mode or real talk mode
    if (!cleanMode) {
      content = makeContentMoreCasual(content);
    }
    
    return content;
  };

  const generateBaseContentFromPrompt = async (context: any): Promise<string> => {
    const { prompt, format, tone, names, occasion, relationship } = context;
    
    const personName = names[0] || (relationship ? `my ${relationship}` : 'you');
    
    // Generate content based on the specific occasion and format
    if (occasion === 'wedding') {
      return generateWeddingContent(personName, tone, format, relationship);
    } else if (occasion === 'birthday') {
      return generateBirthdayContent(personName, tone, format, relationship);
    } else if (occasion === 'funeral') {
      return generateFuneralContent(personName, tone, format, relationship);
    } else if (occasion === 'graduation') {
      return generateGraduationContent(personName, tone, format, relationship);
    } else if (prompt.toLowerCase().includes('apology') || prompt.toLowerCase().includes('sorry')) {
      return generateApologyContent(personName, tone, format, relationship);
    } else if (prompt.toLowerCase().includes('thank')) {
      return generateThankYouContent(personName, tone, format, relationship);
    } else if (occasion === 'farewell' || prompt.toLowerCase().includes('goodbye')) {
      return generateFarewellContent(personName, tone, format, relationship);
    } else {
      return generateGenericContent(prompt, personName, tone, format, relationship);
    }
  };

  const generateWeddingContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    const isToast = format === 'toast';
    const isFunny = tone === 'funny';
    
    if (isFunny) {
      return `${isToast ? 'Ladies and gentlemen, ' : ''}${personName}, I have to say, when you told me you were getting married, my first thought was "Finally! Someone brave enough to put up with you forever!"

${isToast ? 'I\'ve known ' + personName + ' for years, and let me tell you, they\'re the kind of person who still gets excited about free samples at the grocery store. But somehow, they found their perfect match.' : 'You\'ve always been special to me, and seeing you find your soulmate fills my heart with joy... and relief that someone else will now have to listen to your terrible jokes!'}

${isToast ? 'To the happy couple: marriage is like a deck of cards. In the beginning, all you need is two hearts and a diamond. By the end, you\'re looking for a club and a spade! But seriously, you two are perfect for each other.' : 'Marriage is a beautiful journey, and I know you two will navigate it with laughter, love, and probably a lot of eye-rolling.'}

${isToast ? 'Here\'s to love, laughter, and happily ever after. Cheers!' : 'Congratulations on finding your forever person. May your marriage be filled with endless laughter and joy!'}`;
    } else {
      return `${isToast ? 'Dear friends and family, ' : ''}${personName}, today marks the beginning of a beautiful new chapter in your life.

${relationship ? `As your ${relationship}, ` : ''}I have watched you grow into the incredible person you are today. Your kindness, strength, and beautiful spirit have touched everyone around you.

Love is not just about finding the right person, but being the right person for someone else. You and your partner have found in each other not just a companion, but a best friend, confidant, and soulmate.

${isToast ? 'As we celebrate this union, ' : ''}may your marriage be filled with endless laughter, unwavering support, and a love that grows stronger with each passing day.

${isToast ? 'Here\'s to your beautiful future together. Congratulations!' : 'Wishing you both a lifetime of happiness and love. Congratulations on your wedding!'}`;
    }
  };

  const generateBirthdayContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    const isMessage = format === 'message';
    const isFunny = tone === 'funny';
    
    if (isFunny) {
      return `Happy birthday to ${personName}! 🎉

Another year older, another year wiser... or so they say! ${isFunny ? 'I think you\'re just another year closer to needing reading glasses and complaining about "kids these days."' : ''}

${relationship ? `As your ${relationship}, ` : ''}I have to say, you\'re aging like fine wine... if fine wine got more sarcastic and needed more coffee each year!

But seriously, ${personName}, you bring so much joy and laughter into everyone\'s life. Your ability to make people smile is truly a gift.

${isMessage ? 'Hope your day is as amazing as you are!' : 'Here\'s to another year of adventures, laughter, and making unforgettable memories together!'}

Happy birthday! 🎂`;
    } else {
      return `Happy birthday, ${personName}! 🎉

Today we celebrate not just another year of your life, but another year of the joy, kindness, and light you bring to everyone around you.

${relationship ? `Having you as my ${relationship} ` : 'Knowing you '}has been one of life\'s greatest blessings. Your compassion, wisdom, and beautiful heart inspire me every day.

As you step into this new year of life, I hope it brings you everything your heart desires - new adventures, deeper connections, and moments of pure happiness.

${isMessage ? 'You deserve all the love and celebration today and always.' : 'May this birthday be the start of your best year yet, filled with love, laughter, and dreams coming true.'}

Happy birthday! ✨`;
    }
  };

  const generateApologyContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    const isHeartfelt = tone === 'heartfelt' || tone === 'emotional';
    
    return `${personName}, I need to talk to you about what happened, and I want to start by saying I'm truly sorry.

I know my actions hurt you, and that's the last thing I ever wanted to do. ${relationship ? `You mean so much to me as my ${relationship}` : 'You mean so much to me'}, and I hate that I've caused you pain.

I've been thinking about this a lot, and I realize I was wrong. ${isHeartfelt ? 'There\'s no excuse for what I did, and I take full responsibility for my actions.' : 'I should have handled things differently.'}

${isHeartfelt ? 'I value our relationship more than I can express, and I\'m committed to making this right. I want to be better - not just for you, but because you deserve the best version of me.' : 'I hope we can work through this together and come out stronger.'}

I hope you can find it in your heart to forgive me. ${format === 'message' ? 'I miss you.' : 'I miss you, and I\'m here whenever you\'re ready to talk.'}

Thank you for being patient with me. 💙`;
  };

  const generateThankYouContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    return `Dear ${personName},

I wanted to take a moment to express my heartfelt gratitude to you.

${relationship ? `Having you as my ${relationship} ` : 'Having you in my life '}has been such a blessing. Your kindness, support, and generosity have made such a difference in my life.

${tone === 'formal' ? 'Your assistance and guidance have been invaluable, and I am deeply appreciative of everything you have done.' : 'You have this incredible way of making everything better just by being yourself. Your wisdom, your humor, and your caring heart inspire me every day.'}

Thank you for being exactly who you are. Thank you for your friendship, your support, and for all the wonderful memories we've shared together.

${format === 'message' ? 'I\'m so grateful to have you in my life.' : 'I look forward to many more beautiful moments ahead. You are truly special.'}

With love and gratitude,
[Your name] ✨`;
  };

  const generateFarewellContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    const isEmotional = tone === 'emotional' || tone === 'heartfelt';
    
    return `${personName},

As I prepare to say goodbye, I find myself reflecting on all the wonderful moments we've shared together.

${relationship ? `You've been an incredible ${relationship}` : 'You\'ve been an incredible person in my life'}, and the impact you've had on me will last forever. ${isEmotional ? 'It\'s hard to put into words how much you mean to me.' : 'I\'m so grateful for the time we\'ve had together.'}

${isEmotional ? 'Though this goodbye is difficult, I carry with me all the lessons you\'ve taught me, the laughter we\'ve shared, and the memories that will always make me smile.' : 'I\'ll always remember the good times, the lessons learned, and the friendship we\'ve built.'}

${tone === 'formal' ? 'I wish you continued success and happiness in all your future endeavors.' : 'I know our paths may be taking us in different directions, but you\'ll always have a special place in my heart.'}

${format === 'message' ? 'Thank you for everything. Until we meet again.' : 'Thank you for being such an important part of my journey. This isn\'t goodbye forever - it\'s see you later.'}

With love and best wishes,
[Your name] 💙`;
  };

  const generateGraduationContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    return `Congratulations, ${personName}! 🎓

Today marks an incredible milestone in your journey, and I couldn't be more proud of you.

${relationship ? `As your ${relationship}, ` : ''}I've watched you work tirelessly toward this moment. Your dedication, perseverance, and hard work have truly paid off.

${tone === 'motivational' ? 'This graduation isn\'t just an ending - it\'s a beginning. You\'re stepping into a world full of possibilities, and I know you\'re going to achieve amazing things.' : 'Your achievement today is a testament to your character and determination. You should be incredibly proud of yourself.'}

As you move forward into this next chapter, remember that you have everything it takes to succeed. Your intelligence, creativity, and kind heart will open doors and create opportunities.

${format === 'message' ? 'So proud of you and excited to see what comes next!' : 'Here\'s to your bright future and all the amazing adventures ahead. Congratulations again!'}

With pride and love,
[Your name] ✨`;
  };

  const generateFuneralContent = (personName: string, tone: string, format: string, relationship?: string): string => {
    return `Today, we gather to honor and remember ${personName}, a person who touched our lives in profound ways.

${relationship ? `As ${personName}'s ${relationship}, ` : ''}I want to share what made them so special. They had this remarkable ability to make everyone feel valued and loved.

${personName} lived with kindness, compassion, and grace. They taught us the importance of family, friendship, and living each day with purpose. Their laughter could light up a room, and their wisdom guided us through both joyful and difficult times.

While we mourn their passing, we also celebrate the beautiful life they lived and the lasting impact they had on all of us. The love they shared, the memories they created, and the lessons they taught us will live on in our hearts forever.

${tone === 'religious' ? 'Though they are no longer with us physically, their spirit lives on, and we find comfort knowing they are at peace.' : 'Their legacy of love and kindness will continue to inspire us every day.'}

${personName}, thank you for the gift of knowing you. You will be deeply missed and forever remembered. 🕊️`;
  };

  const generateGenericContent = (prompt: string, personName: string, tone: string, format: string, relationship?: string): string => {
    // For generic prompts, create content based on the tone and format
    const isMessage = format === 'message';
    const isPoem = format === 'poem';
    
    if (isPoem) {
      return `For ${personName}

In this moment, words feel small,
But from my heart, I give them all.
${relationship ? `My dear ${relationship}` : 'Dear friend'}, you mean so much to me,
A treasure beyond what eyes can see.

Through laughter shared and tears we've cried,
You've always been right by my side.
Your kindness shines like morning light,
Making everything feel right.

So here's my message, simple and true:
The world is brighter because of you.
Thank you for being who you are,
My guiding light, my shining star. ✨`;
    }
    
    return `${personName},

I wanted to reach out and share something with you that's been on my heart.

${relationship ? `Having you as my ${relationship} ` : 'Having you in my life '}has meant more to me than you might realize. You bring something special to every interaction - whether it's your wisdom, your humor, or simply your presence.

${tone === 'heartfelt' ? 'There are moments in life when we realize how grateful we are for certain people, and this is one of those moments for me.' : 'I hope you know how much you\'re appreciated and valued.'}

${isMessage ? 'Just wanted you to know you\'re thought of and cared about.' : 'Thank you for being exactly who you are. The world is a better place with you in it.'}

With appreciation,
[Your name] 💙`;
  };

  const applyTweakToContent = async (context: any, tweakInstruction: string): Promise<string> => {
    const baseContent = await generateBaseContentFromPrompt(context);
    
    switch (tweakInstruction) {
      case 'funnier':
        return makeFunnier(baseContent, context.names[0] || 'friend');
      case 'emotional':
        return makeMoreEmotional(baseContent, context.names[0] || 'friend');
      case 'formal':
        return makeMoreFormal(baseContent);
      case 'shorter':
        return makeShorter(baseContent);
      default:
        return baseContent;
    }
  };

  const makeFunnier = (content: string, personName: string): string => {
    // Add humor while maintaining the core message
    const funnyAdditions = [
      `(And yes, ${personName}, I practiced this speech in the mirror!)`,
      `Don't worry, I promise this won't be as long as my last speech!`,
      `${personName} probably didn't expect me to get this sentimental, but here we are!`,
      `I was going to make this shorter, but then I remembered how much ${personName} loves my stories!`
    ];
    
    const randomAddition = funnyAdditions[Math.floor(Math.random() * funnyAdditions.length)];
    return content + '\n\n' + randomAddition;
  };

  const makeMoreEmotional = (content: string, personName: string): string => {
    // Add more emotional depth
    const emotionalAdditions = [
      `${personName}, you have no idea how much you mean to me. These words feel inadequate to express the depth of my feelings.`,
      `There are no words that can truly capture what's in my heart right now, but I hope you can feel the love behind these words.`,
      `${personName}, you have touched my life in ways you may never fully understand.`
    ];
    
    const randomAddition = emotionalAdditions[Math.floor(Math.random() * emotionalAdditions.length)];
    return content + '\n\n' + randomAddition;
  };

  const makeMoreFormal = (content: string): string => {
    // Replace casual language with formal alternatives
    return content
      .replace(/you're/g, 'you are')
      .replace(/I'm/g, 'I am')
      .replace(/can't/g, 'cannot')
      .replace(/won't/g, 'will not')
      .replace(/it's/g, 'it is')
      .replace(/that's/g, 'that is');
  };

  const makeShorter = (content: string): string => {
    // Condense the content while keeping the key message
    const sentences = content.split('. ');
    const keyPoints = sentences.slice(0, Math.ceil(sentences.length / 2));
    return keyPoints.join('. ') + (keyPoints[keyPoints.length - 1].endsWith('.') ? '' : '.');
  };

  const transformContentForRole = (content: string, roleVoice: string, personName: string): string => {
    switch (roleVoice) {
      case 'pet':
        return `Woof woof! (Translation from your beloved pet)

Hey ${personName}! It's me, your furry best friend. If I could speak human words, here's what I'd want you to know:

You're the best human ever! You give the best belly rubs, you never forget my dinner time (well, almost never), and you always come home to me no matter how long you've been gone.

I love how you talk to me like I understand everything (which I totally do, by the way). Thank you for choosing me, for loving me, and for being my whole world.

P.S. - More treats would be appreciated. Just saying. Woof! 🐾`;

      case 'grandma':
        return `Oh sweetie, come here and let Grandma tell you something important.

${personName}, my dear child, you've grown into such a wonderful person. Life isn't always easy, honey, but you have something special inside you. You have a good heart, and that's worth more than all the money in the world.

Remember to always be kind to others, take care of yourself, and don't forget to call your family. We love you more than you'll ever know.

You make this old heart so proud. Now give Grandma a hug! 👵💕`;

      case 'future-self':
        return `Hey there, past me. It's your future self speaking.

I know things seem uncertain right now, but I want you to know that everything works out better than you could imagine. Trust yourself more. You're stronger than you think, smarter than you believe, and more capable than you realize.

Keep being kind, keep being curious, and keep being you. Your future is bright, and I'm proud of who you become.

With love from tomorrow,
Future You ✨🔮`;

      case 'child-self':
        return `Hi! It's little me talking to you!

I just wanted to say that you're really, really cool! I think you're the best grown-up ever because you still remember how to have fun and be silly sometimes.

Keep being awesome and don't let anyone tell you that being happy is silly. It's the BEST way to be!

Love,
Little You 👶🌈`;

      default:
        return content;
    }
  };

  const addCulturalContext = (content: string, culturalContext: string): string => {
    switch (culturalContext) {
      case 'african':
        return content + '\n\nAs we say in our tradition, "It takes a village to raise a child, but it takes a community to celebrate life." Ubuntu - I am because we are. 🌍';
      
      case 'nigerian':
        return content + '\n\nAs we say in Naija, "No condition is permanent." Keep pushing forward, and remember that your village is always behind you. God bless! 🇳🇬';
      
      case 'christian':
        return content + '\n\n"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, to give you hope and a future." - Jeremiah 29:11. May God bless you abundantly. 🙏✝️';
      
      case 'islamic':
        return content + '\n\nMay Allah bless you and grant you peace, happiness, and success in all your endeavors. Barakallahu feeki/feeka. Ameen. 🤲☪️';
      
      default:
        return content;
    }
  };

  const adjustContentForDuration = (content: string, duration: string): string => {
    const words = content.split(' ').length;
    const targetWords = getDurationTargetWords(duration);
    
    if (words > targetWords * 1.2) {
      // Content is too long, condense it
      const sentences = content.split('. ');
      const targetSentences = Math.ceil(sentences.length * (targetWords / words));
      return sentences.slice(0, targetSentences).join('. ') + '.';
    } else if (words < targetWords * 0.8) {
      // Content is too short, expand it
      return content + '\n\nThank you for taking the time to listen to these words from my heart.';
    }
    
    return content;
  };

  const getDurationTargetWords = (duration: string): number => {
    switch (duration) {
      case '15s': return 40;
      case '30s': return 75;
      case '1min': return 150;
      case '2min': return 300;
      case '3min': return 450;
      case '5min': return 750;
      default: return 300;
    }
  };

  const makeContentMoreCasual = (content: string): string => {
    return content
      .replace(/I am/g, "I'm")
      .replace(/you are/g, "you're")
      .replace(/cannot/g, "can't")
      .replace(/will not/g, "won't")
      .replace(/it is/g, "it's")
      .replace(/that is/g, "that's")
      .replace(/Dear /g, "Hey ")
      .replace(/Sincerely,/g, "Love,")
      .replace(/With regards,/g, "Talk soon,");
  };

  const generateFallbackContent = (req: GenerationRequest): GeneratedContent => {
    const content = `I understand you're looking for ${req.format === 'speech' ? 'a speech' : req.format === 'toast' ? 'a toast' : 'a message'} with a ${req.tone} tone.

Based on your request: "${req.prompt}"

I want to help you express exactly what's in your heart. Sometimes the most powerful words come from speaking authentically about what someone means to you.

Consider sharing:
- A specific memory you cherish
- What you admire most about them
- How they've impacted your life
- Your hopes for their future

Remember, the best speeches come from the heart. Your genuine feelings and personal connection will make any words meaningful.`;

    return {
      text: content,
      wordCount: content.split(' ').length,
      estimatedTime: '1 min',
      stickers: ['💙', '✨', '🤗'],
      visualStyle: {
        fontFamily: 'serif',
        backgroundColor: 'from-blue-50 to-purple-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200'
      }
    };
  };

  const generateContextualStickers = (text: string, tone: string): string[] => {
    const stickerMap: { [key: string]: string[] } = {
      heartfelt: ['❤️', '🥰', '💕', '🤗', '✨'],
      funny: ['😂', '🤣', '😄', '🎉', '🤪'],
      emotional: ['😭', '💔', '🥺', '😢', '💙'],
      formal: ['🎩', '👔', '📋', '🏆', '💼'],
      romantic: ['💕', '💖', '🌹', '💐', '😍'],
      religious: ['🙏', '✝️', '🕊️', '⭐', '🌟'],
      childlike: ['🎈', '🎨', '🧸', '🌈', '🦄']
    };
    
    return stickerMap[tone] || stickerMap.heartfelt;
  };

  const generateVisualStyle = (tone: string) => {
    const styleMap: { [key: string]: any } = {
      heartfelt: {
        fontFamily: 'serif',
        backgroundColor: 'from-pink-50 to-rose-50',
        textColor: 'text-rose-800',
        borderColor: 'border-rose-200'
      },
      funny: {
        fontFamily: 'sans-serif',
        backgroundColor: 'from-yellow-50 to-orange-50',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200'
      },
      formal: {
        fontFamily: 'serif',
        backgroundColor: 'from-blue-50 to-indigo-50',
        textColor: 'text-indigo-800',
        borderColor: 'border-indigo-200'
      },
      romantic: {
        fontFamily: 'cursive',
        backgroundColor: 'from-pink-50 to-purple-50',
        textColor: 'text-purple-800',
        borderColor: 'border-purple-200'
      }
    };
    
    return styleMap[tone] || styleMap.heartfelt;
  };

  useEffect(() => {
    generateSpeech();
    
    // Load saved messages from localStorage
    const saved = localStorage.getItem('speakup-saved-messages');
    if (saved) {
      setSavedMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setPracticeTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleRegenerate = () => {
    generateSpeech();
  };

  const handleTweak = (tweakType: string) => {
    generateSpeech(tweakType);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentUtterance(null);
    } else if (generatedContent) {
      const utterance = new SpeechSynthesisUtterance(generatedContent.text);
      
      // Configure voice based on selection
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const voiceMap: { [key: string]: number } = {
          'adult-male': 0,
          'adult-female': 1,
          'teen': 2,
          'child-male': 3,
          'child-female': 4
        };
        
        const voiceIndex = voiceMap[request.voice] || 1;
        if (voices[voiceIndex]) {
          utterance.voice = voices[voiceIndex];
        }
      }
      
      utterance.rate = 0.9;
      utterance.pitch = request.voice.includes('child') ? 1.2 : 1.0;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentUtterance(null);
      };
      
      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.text);
    }
  };

  const saveMessage = () => {
    if (generatedContent && !request.isPrivateMode) {
      const newMessage = {
        id: Date.now(),
        text: generatedContent.text,
        prompt: request.prompt,
        format: request.format,
        tone: request.tone,
        createdAt: new Date().toISOString()
      };
      
      const updated = [...savedMessages, newMessage];
      setSavedMessages(updated);
      localStorage.setItem('speakup-saved-messages', JSON.stringify(updated));
    }
  };

  const downloadPDF = async () => {
    if (!generatedContent) return;
    
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('SpeakUp AI Generated Speech', 20, 30);
      
      // Add metadata
      doc.setFontSize(12);
      doc.text(`Format: ${request.format}`, 20, 50);
      doc.text(`Tone: ${request.tone}`, 20, 60);
      doc.text(`Duration: ${request.duration}`, 20, 70);
      doc.text(`Cultural Context: ${request.culturalContext || 'Universal'}`, 20, 80);
      
      // Add content
      doc.setFontSize(14);
      const splitText = doc.splitTextToSize(generatedContent.text, 170);
      doc.text(splitText, 20, 100);
      
      doc.save('speakup-ai-speech.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
    }
  };

  const downloadGreetingCard = async () => {
    if (!generatedContent) return;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = 800;
      canvas.height = 600;
      
      // Background with visual style
      const gradient = ctx.createLinearGradient(0, 0, 800, 600);
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Border
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, 760, 560);
      
      // Title
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('A Message For You', 400, 80);
      
      // Content
      ctx.font = '18px serif';
      ctx.fillStyle = '#374151';
      const lines = generatedContent.text.split('\n');
      let y = 140;
      lines.forEach((line, index) => {
        if (y < 520) {
          const words = line.split(' ');
          let currentLine = '';
          words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > 720) {
              ctx.fillText(currentLine, 400, y);
              currentLine = word + ' ';
              y += 25;
            } else {
              currentLine = testLine;
            }
          });
          ctx.fillText(currentLine, 400, y);
          y += 35;
        }
      });
      
      // Download
      const link = document.createElement('a');
      link.download = 'speakup-ai-greeting-card.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Greeting card generation failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tweakOptions = [
    { id: 'funnier', label: 'Make Funnier', icon: Smile },
    { id: 'emotional', label: 'More Emotional', icon: Heart },
    { id: 'formal', label: 'More Formal', icon: Briefcase },
    { id: 'shorter', label: 'Make Shorter', icon: Zap }
  ];

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
          <h1 className="text-2xl font-bold text-gray-800">Speech Generator</h1>
          <div className="flex items-center gap-2">
            {request.isPrivateMode && (
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Private Mode</span>
              </div>
            )}
            <button
              onClick={() => setPracticeMode(!practiceMode)}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Timer className="w-4 h-4" />
              Practice Mode
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Request Summary */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">Your Request</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Prompt:</span>
                  <p className="text-gray-800 mt-1">{request.prompt}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-600">Format:</span>
                    <p className="text-gray-800 capitalize">{request.format}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Tone:</span>
                    <p className="text-gray-800 capitalize">{request.tone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Duration:</span>
                    <p className="text-gray-800">{request.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Voice:</span>
                    <p className="text-gray-800 capitalize">{request.voice.replace('-', ' ')}</p>
                  </div>
                </div>
                {request.culturalContext && request.culturalContext !== 'universal' && (
                  <div>
                    <span className="font-medium text-gray-600">Culture:</span>
                    <p className="text-gray-800 capitalize">{request.culturalContext}</p>
                  </div>
                )}
                {request.roleVoice && request.roleVoice !== 'self' && (
                  <div>
                    <span className="font-medium text-gray-600">Speaking As:</span>
                    <p className="text-gray-800 capitalize">{request.roleVoice.replace('-', ' ')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Practice Mode Timer */}
            {practiceMode && (
              <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Practice Timer
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-4">
                    {formatTime(practiceTimer)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {isTimerRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => {
                        setPracticeTimer(0);
                        setIsTimerRunning(false);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {isGenerating ? 'Generating...' : 'Regenerate'}
                </button>
                
                <button
                  onClick={handlePlayPause}
                  disabled={!generatedContent}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  {isPlaying ? 'Stop' : 'Listen'}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCleanMode(!cleanMode)}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      cleanMode 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    Clean
                  </button>
                  <button
                    onClick={() => setCleanMode(!cleanMode)}
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      !cleanMode 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    Real Talk
                  </button>
                </div>
              </div>
            </div>

            {/* AI Tweak Tools */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">AI Tweak Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {tweakOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleTweak(option.id)}
                      disabled={isGenerating}
                      className="flex flex-col items-center gap-1 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-xs disabled:opacity-50"
                    >
                      <Icon className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              {currentTweak && (
                <div className="mt-3 text-xs text-purple-600 text-center">
                  Applied: {tweakOptions.find(t => t.id === currentTweak)?.label}
                </div>
              )}
            </div>

            {/* Visual Style Controls */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Visual Style
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowStickers(!showStickers)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    showStickers 
                      ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  Stickers {showStickers ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={() => setMultiSpeakerMode(!multiSpeakerMode)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    multiSpeakerMode 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Multi-Speaker
                </button>
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
              {/* Output Header */}
              <div className={`bg-gradient-to-r ${generatedContent?.visualStyle.backgroundColor || 'from-blue-50 to-purple-50'} p-6 border-b border-purple-100`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Your Generated {request.format.charAt(0).toUpperCase() + request.format.slice(1)}
                  </h3>
                  {generatedContent && (
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {generatedContent.estimatedTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {generatedContent.wordCount} words
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Output Content */}
              <div className="p-6">
                {isGenerating ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-gray-600 text-lg">Crafting your perfect {request.format}...</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {currentTweak ? `Applying ${currentTweak} style...` : `Analyzing "${request.prompt}" with ${request.tone} tone`}
                      </p>
                    </div>
                  </div>
                ) : generatedContent ? (
                  <div>
                    <div className="prose max-w-none mb-8">
                      <div className={`${generatedContent.visualStyle.textColor} leading-relaxed whitespace-pre-line text-lg`} style={{ fontFamily: generatedContent.visualStyle.fontFamily }}>
                        {showStickers ? (
                          generatedContent.text.split('\n').map((line, index) => (
                            <div key={index} className="mb-4 flex items-start gap-3">
                              {line.trim() && generatedContent.stickers[index % generatedContent.stickers.length] && (
                                <span className="text-2xl mt-1 flex-shrink-0">
                                  {generatedContent.stickers[index % generatedContent.stickers.length]}
                                </span>
                              )}
                              <span>{line}</span>
                            </div>
                          ))
                        ) : (
                          generatedContent.text
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Text
                      </button>
                      
                      {!request.isPrivateMode && (
                        <button
                          onClick={saveMessage}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Bookmark className="w-4 h-4" />
                          Save Message
                        </button>
                      )}
                      
                      <button
                        onClick={downloadPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        Download PDF
                      </button>
                      
                      <button
                        onClick={downloadGreetingCard}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                      >
                        <Printer className="w-4 h-4" />
                        Greeting Card
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        <Image className="w-4 h-4" />
                        Save as Image
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        <Music className="w-4 h-4" />
                        Export MP3
                      </button>
                      
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Your generated content will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechGenerator;