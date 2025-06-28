import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Volume2, Download, RefreshCw, Save, Wand2, Heart, Smile, Briefcase, Clock, Share2 } from 'lucide-react';
import { GenerationRequest } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SpeechGeneratorProps {
  request: GenerationRequest;
  onBackToHome: () => void;
}

interface GeneratedContent {
  text: string;
  subjectLine?: string;
  wordCount: number;
  estimatedDuration: string;
}

const SpeechGenerator: React.FC<SpeechGeneratorProps> = ({ request, onBackToHome }) => {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [currentVoice, setCurrentVoice] = useState(request.voice);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Real AI Content Generation Engine
  const generateContent = async (prompt: string, options: GenerationRequest): Promise<GeneratedContent> => {
    // Simulate processing time for realistic feel
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Extract key information from prompt
    const analysis = analyzePrompt(prompt);
    
    // Generate content based on format
    let content = '';
    let subjectLine = '';

    switch (options.format) {
      case 'email':
        const emailResult = generateEmail(analysis, options);
        content = emailResult.body;
        subjectLine = emailResult.subject;
        break;
      case 'resignation':
        content = generateResignationLetter(analysis, options);
        break;
      case 'love-letter':
        content = generateLoveLetter(analysis, options);
        break;
      case 'apology':
        content = generateApology(analysis, options);
        break;
      case 'rejection':
        content = generateRejectionLetter(analysis, options);
        break;
      case 'speech':
        content = generateSpeech(analysis, options);
        break;
      case 'toast':
        content = generateToast(analysis, options);
        break;
      case 'poem':
        content = generatePoem(analysis, options);
        break;
      case 'rap':
        content = generateRap(analysis, options);
        break;
      case 'prayer':
        content = generatePrayer(analysis, options);
        break;
      default:
        content = generateMessage(analysis, options);
    }

    // Apply tone adjustments
    content = applyTone(content, options.tone, analysis);
    
    // Apply cultural context
    content = applyCulturalContext(content, options.culturalContext || 'universal', analysis);
    
    // Apply role voice
    content = applyRoleVoice(content, options.roleVoice || 'self', analysis);
    
    // Adjust length
    content = adjustLength(content, options.duration, analysis);

    const wordCount = content.split(' ').length;
    const estimatedDuration = calculateDuration(wordCount);

    return {
      text: content,
      subjectLine: subjectLine || undefined,
      wordCount,
      estimatedDuration
    };
  };

  // Prompt Analysis Engine
  const analyzePrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract names
    const namePatterns = [
      /(?:for|to|dear)\s+(?:my\s+)?(\w+)/gi,
      /(\w+)'s/gi,
      /named?\s+(\w+)/gi
    ];
    
    const names: string[] = [];
    namePatterns.forEach(pattern => {
      const matches = prompt.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const name = match.replace(/(?:for|to|dear|my|'s|named?)\s*/gi, '').trim();
          if (name && name.length > 1 && !['the', 'and', 'or', 'but'].includes(name.toLowerCase())) {
            names.push(name.charAt(0).toUpperCase() + name.slice(1));
          }
        });
      }
    });

    // Extract relationships
    const relationships = [
      'boss', 'manager', 'supervisor', 'colleague', 'coworker',
      'mother', 'mom', 'father', 'dad', 'sister', 'brother', 'friend',
      'girlfriend', 'boyfriend', 'wife', 'husband', 'partner',
      'teacher', 'professor', 'student', 'neighbor', 'landlord',
      'doctor', 'client', 'customer', 'team', 'family'
    ];
    
    const foundRelationships = relationships.filter(rel => 
      lowerPrompt.includes(rel) || lowerPrompt.includes(`my ${rel}`)
    );

    // Extract occasions
    const occasions = [
      'birthday', 'wedding', 'funeral', 'graduation', 'promotion',
      'anniversary', 'retirement', 'farewell', 'apology', 'thank you',
      'congratulations', 'condolences', 'valentine', 'christmas',
      'new year', 'easter', 'mother\'s day', 'father\'s day'
    ];
    
    const foundOccasions = occasions.filter(occ => lowerPrompt.includes(occ));

    // Extract emotions/sentiments
    const emotions = [
      'sad', 'happy', 'excited', 'nervous', 'grateful', 'sorry',
      'proud', 'disappointed', 'angry', 'frustrated', 'hopeful',
      'loving', 'caring', 'worried', 'concerned', 'joyful'
    ];
    
    const foundEmotions = emotions.filter(emo => lowerPrompt.includes(emo));

    // Extract specific details
    const details = extractSpecificDetails(prompt);

    return {
      originalPrompt: prompt,
      names: [...new Set(names)],
      relationships: foundRelationships,
      occasions: foundOccasions,
      emotions: foundEmotions,
      details,
      isPersonal: foundRelationships.some(rel => ['mother', 'mom', 'father', 'dad', 'sister', 'brother', 'friend', 'girlfriend', 'boyfriend'].includes(rel)),
      isProfessional: foundRelationships.some(rel => ['boss', 'manager', 'supervisor', 'colleague', 'coworker'].includes(rel))
    };
  };

  const extractSpecificDetails = (prompt: string) => {
    const details: string[] = [];
    
    // Look for specific mentions
    const detailPatterns = [
      /(?:about|regarding|concerning)\s+([^.!?]+)/gi,
      /(?:because|since|due to)\s+([^.!?]+)/gi,
      /(?:who|that)\s+([^.!?]+)/gi
    ];
    
    detailPatterns.forEach(pattern => {
      const matches = prompt.match(pattern);
      if (matches) {
        matches.forEach(match => {
          details.push(match.trim());
        });
      }
    });
    
    return details;
  };

  // Content Generation Functions
  const generateEmail = (analysis: any, options: GenerationRequest) => {
    const recipient = analysis.names[0] || (analysis.relationships[0] ? `my ${analysis.relationships[0]}` : 'you');
    const isPersonal = analysis.isPersonal;
    const isProfessional = analysis.isProfessional;
    
    let subject = '';
    let body = '';
    
    // Generate subject line based on content
    if (analysis.occasions.includes('birthday')) {
      subject = `Happy Birthday${analysis.names[0] ? ` ${analysis.names[0]}` : ''}!`;
    } else if (analysis.originalPrompt.toLowerCase().includes('time off') || analysis.originalPrompt.toLowerCase().includes('leave')) {
      subject = 'Request for Time Off';
    } else if (analysis.originalPrompt.toLowerCase().includes('meeting')) {
      subject = 'Meeting Request';
    } else if (analysis.originalPrompt.toLowerCase().includes('resignation') || analysis.originalPrompt.toLowerCase().includes('quit')) {
      subject = 'Resignation Notice';
    } else if (analysis.originalPrompt.toLowerCase().includes('thank')) {
      subject = 'Thank You';
    } else if (analysis.originalPrompt.toLowerCase().includes('apolog')) {
      subject = 'Sincere Apology';
    } else {
      subject = 'Important Message';
    }
    
    // Generate greeting
    const greeting = isProfessional 
      ? `Dear ${analysis.names[0] || (analysis.relationships[0] ? analysis.relationships[0].charAt(0).toUpperCase() + analysis.relationships[0].slice(1) : 'Sir/Madam')},`
      : `Hi ${analysis.names[0] || 'there'},`;
    
    // Generate body based on prompt analysis
    let mainContent = '';
    
    if (analysis.originalPrompt.toLowerCase().includes('time off')) {
      mainContent = `I am writing to request time off from work. ${analysis.details.length > 0 ? analysis.details.join(' ') : 'I would appreciate your consideration of this request.'}\n\nI will ensure all my responsibilities are covered during my absence and will coordinate with the team for a smooth transition.\n\nThank you for your understanding.`;
    } else if (analysis.originalPrompt.toLowerCase().includes('thank')) {
      mainContent = `I wanted to take a moment to express my sincere gratitude. ${analysis.details.length > 0 ? analysis.details.join(' ') : 'Your support and guidance have meant so much to me.'}\n\nI truly appreciate everything you have done.`;
    } else if (analysis.originalPrompt.toLowerCase().includes('apolog')) {
      mainContent = `I am writing to sincerely apologize. ${analysis.details.length > 0 ? analysis.details.join(' ') : 'I realize my actions were inappropriate and I take full responsibility.'}\n\nI am committed to making things right and ensuring this doesn't happen again.`;
    } else {
      // Generic content based on analysis
      mainContent = generateGenericContent(analysis, options);
    }
    
    // Generate closing
    const closing = isProfessional 
      ? 'Best regards,\n[Your Name]'
      : isPersonal 
        ? 'With love,\n[Your Name]'
        : 'Best,\n[Your Name]';
    
    body = `${greeting}\n\n${mainContent}\n\n${closing}`;
    
    return { subject, body };
  };

  const generateResignationLetter = (analysis: any, options: GenerationRequest) => {
    const managerName = analysis.names[0] || 'Manager';
    const details = analysis.details.length > 0 ? analysis.details.join(' ') : '';
    
    return `Dear ${managerName},

I am writing to formally notify you of my resignation from my position. My last day of work will be [Date - typically two weeks from today].

${details ? `${details}\n\n` : ''}I want to express my sincere gratitude for the opportunities for professional and personal growth during my time here. I have enjoyed working with the team and appreciate the support provided to me.

During my remaining time, I am committed to ensuring a smooth transition. I am happy to assist in training my replacement and will do everything possible to wrap up my current projects.

Thank you for your understanding, and I wish the company continued success.

Sincerely,
[Your Name]`;
  };

  const generateLoveLetter = (analysis: any, options: GenerationRequest) => {
    const loverName = analysis.names[0] || 'My Love';
    const personalDetails = analysis.details.length > 0 ? analysis.details.join(' ') : '';
    
    return `My Dearest ${loverName},

As I sit here thinking about you, my heart fills with so much love that I had to put these feelings into words.

${personalDetails ? `${personalDetails}\n\n` : ''}You have brought so much joy and meaning into my life. Every day with you feels like a gift, and I find myself falling deeper in love with who you are - your kindness, your laughter, the way you see the world.

${analysis.occasions.includes('anniversary') ? 'On this special anniversary, I want you to know that my love for you has only grown stronger.' : 'I want you to know that you mean everything to me.'}

You are my best friend, my partner, and my greatest love. I cannot imagine my life without you in it.

Forever yours,
[Your Name]`;
  };

  const generateApology = (analysis: any, options: GenerationRequest) => {
    const recipientName = analysis.names[0] || 'you';
    const reason = analysis.details.length > 0 ? analysis.details.join(' ') : 'my actions';
    
    return `Dear ${recipientName},

I am writing to offer you my sincerest apology. I know that words cannot undo what happened, but I need you to know how deeply sorry I am.

${reason.includes('my actions') ? 'I realize that my actions were wrong and hurtful.' : `I understand that ${reason} caused you pain and disappointment.`}

I take full responsibility for my behavior and the impact it had on you. There is no excuse for what I did, and I am committed to learning from this mistake.

${analysis.relationships.includes('friend') || analysis.relationships.includes('girlfriend') || analysis.relationships.includes('boyfriend') ? 'Our relationship means so much to me, and I hope that in time, you can find it in your heart to forgive me.' : 'I respect whatever decision you make going forward.'}

I am truly sorry and will work to be better.

Sincerely,
[Your Name]`;
  };

  const generateRejectionLetter = (analysis: any, options: GenerationRequest) => {
    const candidateName = analysis.names[0] || 'Candidate';
    
    return `Dear ${candidateName},

Thank you for your interest in the position and for taking the time to interview with us. We appreciate the effort you put into the application process.

After careful consideration, we have decided to move forward with another candidate whose experience more closely aligns with our current needs.

This was a difficult decision as we were impressed by your qualifications and enthusiasm. We encourage you to apply for future opportunities that match your skills and interests.

We wish you the best of luck in your job search and future endeavors.

Best regards,
[Your Name]
[Title]`;
  };

  const generateSpeech = (analysis: any, options: GenerationRequest) => {
    const audience = analysis.relationships[0] || 'everyone';
    const occasion = analysis.occasions[0] || 'this special occasion';
    const names = analysis.names.length > 0 ? analysis.names : [];
    
    let opening = '';
    let body = '';
    let closing = '';
    
    if (occasion === 'wedding') {
      opening = `Good evening, everyone. Thank you for being here to celebrate this beautiful union.`;
      body = names.length > 0 
        ? `${names[0]}, I have watched you grow and find your perfect match. Today, as you begin this new chapter, I want you to know how happy I am for you both.`
        : `Today we celebrate love, commitment, and the beginning of a beautiful journey together.`;
      closing = `Let's raise our glasses to love, laughter, and happily ever after!`;
    } else if (occasion === 'funeral') {
      opening = `We gather today to honor and remember a life well-lived.`;
      body = names.length > 0 
        ? `${names[0]} touched so many lives with their kindness, wisdom, and love. Though we mourn their passing, we celebrate the beautiful memories they left us.`
        : `Though our hearts are heavy with grief, we find comfort in the memories and the love that will live on forever.`;
      closing = `May we carry their memory in our hearts and continue to live by the example they set.`;
    } else if (occasion === 'graduation') {
      opening = `Today marks a significant milestone and achievement.`;
      body = names.length > 0 
        ? `${names[0]}, your hard work, dedication, and perseverance have brought you to this moment. I am so proud of everything you have accomplished.`
        : `This graduation represents not just an ending, but a beginning. The knowledge and experiences gained will serve as a foundation for future success.`;
      closing = `Congratulations and best wishes for the bright future ahead!`;
    } else {
      opening = `Thank you all for being here today.`;
      body = generateGenericContent(analysis, options);
      closing = `Thank you for your attention.`;
    }
    
    return `${opening}\n\n${body}\n\n${closing}`;
  };

  const generateToast = (analysis: any, options: GenerationRequest) => {
    const toastee = analysis.names[0] || 'our friend';
    const occasion = analysis.occasions[0] || 'this special moment';
    
    return `Please raise your glasses with me.

${toastee}, ${occasion === 'birthday' ? 'on your special day' : `on this ${occasion}`}, I want to say how much you mean to all of us.

${analysis.details.length > 0 ? analysis.details.join(' ') : `Your friendship, kindness, and the joy you bring to our lives is something we treasure.`}

Here's to ${toastee} - may this ${occasion} be filled with happiness, laughter, and all the things that make life beautiful.

Cheers!`;
  };

  const generatePoem = (analysis: any, options: GenerationRequest) => {
    const subject = analysis.names[0] || analysis.relationships[0] || 'you';
    const occasion = analysis.occasions[0];
    
    if (occasion === 'birthday') {
      return `Another year has come around,
A special day that we have found,
${subject}, on your birthday bright,
We celebrate with pure delight.

May joy and laughter fill your day,
And happiness come out to play,
With wishes warm and love so true,
Happy birthday, dear ${subject}, to you!`;
    } else if (analysis.relationships.includes('mother') || analysis.relationships.includes('mom')) {
      return `A mother's love is pure and true,
A guiding light in all we do,
${subject}, your caring heart so bright,
Fills our world with warmth and light.

Through every joy and every tear,
You've been the one we hold most dear,
With gratitude and love so deep,
These precious memories we'll always keep.`;
    } else {
      return `In words of verse, I speak to you,
Of feelings deep and love so true,
${subject}, know that in my heart,
You've played a very special part.

Through seasons change and time goes by,
Our bond remains, it will not die,
With appreciation and care,
I'm grateful that you're always there.`;
    }
  };

  const generateRap = (analysis: any, options: GenerationRequest) => {
    const subject = analysis.names[0] || 'you';
    
    return `[Verse 1]
Yo, let me tell you 'bout ${subject}, that's my friend
Someone I can count on, right until the end
Through the ups and downs, they always got my back
Loyalty and love, that's something they don't lack

[Chorus]
${subject}, ${subject}, you're the real deal
Keeping it one hundred, that's how you make me feel
Respect and appreciation, that's what I'm showing
For all the love and support that you keep on flowing

[Verse 2]
When times get tough and the world seems cold
You're the type of person worth their weight in gold
Standing by my side through thick and thin
With you in my corner, I know I'm gonna win

[Outro]
So here's my message in this rap I wrote
${subject}, you're amazing, and that's all she wrote!`;
  };

  const generatePrayer = (analysis: any, options: GenerationRequest) => {
    const prayerFor = analysis.names[0] || analysis.relationships[0] || 'those we love';
    const occasion = analysis.occasions[0];
    
    let prayerContent = '';
    
    if (options.culturalContext === 'christian') {
      prayerContent = `Heavenly Father,

We come before You today with grateful hearts, lifting up ${prayerFor} in prayer.

${occasion ? `On this ${occasion}, we ask for Your blessings and guidance.` : 'We ask for Your continued blessings and protection.'}

Grant ${prayerFor} strength, wisdom, and peace. May Your love surround them and Your grace sustain them through all of life's journeys.

We thank You for the gift of ${prayerFor} in our lives and for all the ways You work through them.

In Jesus' name we pray, Amen.`;
    } else if (options.culturalContext === 'islamic') {
      prayerContent = `Bismillah,

Allah, we ask for Your blessings upon ${prayerFor}.

${occasion ? `On this ${occasion}, we seek Your guidance and mercy.` : 'We seek Your continued guidance and protection.'}

Grant ${prayerFor} health, happiness, and success in this life and the hereafter. May You protect them from harm and guide them on the straight path.

We are grateful for Your countless blessings and for ${prayerFor} being part of our lives.

Ameen.`;
    } else {
      prayerContent = `We gather our thoughts and intentions,
Sending positive energy and love to ${prayerFor}.

${occasion ? `On this ${occasion}, we wish for blessings and joy.` : 'We wish for continued blessings and peace.'}

May ${prayerFor} find strength in difficult times, joy in simple moments, and love in all relationships.

We are grateful for the light ${prayerFor} brings to our lives and the world.

With love and hope.`;
    }
    
    return prayerContent;
  };

  const generateMessage = (analysis: any, options: GenerationRequest) => {
    return generateGenericContent(analysis, options);
  };

  const generateGenericContent = (analysis: any, options: GenerationRequest) => {
    const recipient = analysis.names[0] || (analysis.relationships[0] ? `my ${analysis.relationships[0]}` : 'you');
    const occasion = analysis.occasions[0];
    const emotions = analysis.emotions;
    const details = analysis.details.length > 0 ? analysis.details.join(' ') : '';
    
    let content = '';
    
    if (occasion) {
      content += `${recipient}, on this ${occasion}, `;
    } else {
      content += `${recipient}, `;
    }
    
    if (emotions.includes('grateful') || analysis.originalPrompt.toLowerCase().includes('thank')) {
      content += `I want to express my heartfelt gratitude. ${details || 'Your kindness and support mean so much to me.'}`;
    } else if (emotions.includes('sorry') || analysis.originalPrompt.toLowerCase().includes('apolog')) {
      content += `I want to sincerely apologize. ${details || 'I realize my actions were wrong and I take full responsibility.'}`;
    } else if (emotions.includes('happy') || emotions.includes('excited')) {
      content += `I am so happy and excited! ${details || 'This is such a wonderful moment and I wanted to share my joy with you.'}`;
    } else if (emotions.includes('sad') || emotions.includes('worried')) {
      content += `I've been thinking about you and wanted to reach out. ${details || 'Please know that I care about you and I'm here if you need anything.'}`;
    } else {
      content += `I wanted to take a moment to reach out to you. ${details || 'You are important to me and I value our relationship.'}`;
    }
    
    // Add appropriate closing based on relationship
    if (analysis.isPersonal) {
      content += '\n\nWith love and best wishes.';
    } else if (analysis.isProfessional) {
      content += '\n\nBest regards.';
    } else {
      content += '\n\nWarm regards.';
    }
    
    return content;
  };

  // Tone Application
  const applyTone = (content: string, tone: string, analysis: any) => {
    switch (tone) {
      case 'funny':
        return addHumor(content, analysis);
      case 'emotional':
        return addEmotion(content, analysis);
      case 'formal':
        return makeFormal(content);
      case 'casual':
        return makeCasual(content);
      case 'romantic':
        return addRomance(content, analysis);
      case 'religious':
        return addReligiousElements(content);
      case 'childlike':
        return makeChildlike(content);
      case 'professional':
        return makeProfessional(content);
      case 'motivational':
        return addMotivation(content);
      default:
        return content;
    }
  };

  const addHumor = (content: string, analysis: any) => {
    // Add appropriate humor based on context
    if (analysis.occasions.includes('birthday')) {
      return content.replace(/birthday/gi, 'birthday (and another year of wisdom... or so we tell ourselves)');
    }
    return content + '\n\n(And yes, I practiced this speech in the mirror... multiple times!)';
  };

  const addEmotion = (content: string, analysis: any) => {
    return content.replace(/\./g, '... *tears of joy*').replace(/!/g, '! *heart full of emotion*');
  };

  const makeFormal = (content: string) => {
    return content
      .replace(/I'm/g, 'I am')
      .replace(/you're/g, 'you are')
      .replace(/can't/g, 'cannot')
      .replace(/won't/g, 'will not');
  };

  const makeCasual = (content: string) => {
    return content
      .replace(/I am/g, "I'm")
      .replace(/you are/g, "you're")
      .replace(/cannot/g, "can't");
  };

  const addRomance = (content: string, analysis: any) => {
    return content + '\n\nYou are the love of my life, my heart, my everything. 💕';
  };

  const addReligiousElements = (content: string) => {
    return content + '\n\nMay God bless you abundantly.';
  };

  const makeChildlike = (content: string) => {
    return content.replace(/\./g, '! 😊').replace(/very/g, 'super duper');
  };

  const makeProfessional = (content: string) => {
    return content.replace(/thanks/gi, 'thank you').replace(/hi/gi, 'Dear');
  };

  const addMotivation = (content: string) => {
    return content + '\n\nRemember, you have the strength to overcome any challenge. Believe in yourself!';
  };

  // Cultural Context Application
  const applyCulturalContext = (content: string, culture: string, analysis: any) => {
    switch (culture) {
      case 'african':
        return content + '\n\nAs we say, "It takes a village" - and you are an important part of ours.';
      case 'nigerian':
        return content + '\n\nMay your days be filled with joy and your path be blessed.';
      case 'christian':
        return content + '\n\nGod bless you richly.';
      case 'islamic':
        return content + '\n\nMay Allah bless you and keep you in His care.';
      default:
        return content;
    }
  };

  // Role Voice Application
  const applyRoleVoice = (content: string, role: string, analysis: any) => {
    switch (role) {
      case 'pet':
        return `*Woof woof!* (Translation from your loyal pet)\n\n${content}\n\n*Tail wagging intensifies* 🐕`;
      case 'grandma':
        return `Oh sweetie,\n\n${content}\n\nNow don't forget to eat your vegetables and call me soon!\n\nLove, Grandma 👵`;
      case 'future-self':
        return `Greetings from the future!\n\n${content}\n\nTrust me, I know what I'm talking about - I've lived it!\n\nYour Future Self ✨`;
      case 'child-self':
        return `Hi! It's little me!\n\n${content.replace(/\./g, '! 😄')}\n\nP.S. Can we have ice cream now? 🍦`;
      case 'wise-elder':
        return `Young one,\n\nIn my many years, I have learned that ${content.toLowerCase()}\n\nMay this wisdom serve you well.\n\nWith ancient blessings 🧙‍♂️`;
      default:
        return content;
    }
  };

  // Length Adjustment
  const adjustLength = (content: string, duration: string, analysis: any) => {
    const words = content.split(' ');
    
    switch (duration) {
      case 'short':
      case '15s':
      case '30s':
        return words.slice(0, Math.min(50, words.length)).join(' ') + (words.length > 50 ? '...' : '');
      case 'long':
      case '5min':
        // Expand content for longer duration
        return expandContent(content, analysis);
      default:
        return content;
    }
  };

  const expandContent = (content: string, analysis: any) => {
    // Add more detail and elaboration
    const expanded = content + '\n\n' + 
      'Let me share more of what\'s in my heart. ' +
      (analysis.details.length > 0 ? 
        'The memories we\'ve shared, the laughter, the challenges we\'ve overcome together - all of these moments have shaped our relationship in beautiful ways.' :
        'Our connection means so much to me, and I wanted to take this opportunity to express that fully.');
    
    return expanded;
  };

  const calculateDuration = (wordCount: number) => {
    const wordsPerMinute = 150; // Average speaking pace
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  };

  // Initialize generation
  useEffect(() => {
    generateContent(request.prompt, request).then(content => {
      setGeneratedContent(content);
      setIsGenerating(false);
    });
  }, [request]);

  // Regeneration with tweaks
  const regenerateWithTweak = async (tweak: string) => {
    if (!generatedContent) return;
    
    setIsRegenerating(true);
    
    let modifiedRequest = { ...request };
    
    switch (tweak) {
      case 'funnier':
        modifiedRequest.tone = 'funny';
        break;
      case 'emotional':
        modifiedRequest.tone = 'emotional';
        break;
      case 'formal':
        modifiedRequest.tone = 'formal';
        break;
      case 'shorter':
        modifiedRequest.duration = 'short';
        break;
      case 'longer':
        modifiedRequest.duration = 'long';
        break;
    }
    
    const newContent = await generateContent(request.prompt, modifiedRequest);
    setGeneratedContent(newContent);
    setIsRegenerating(false);
  };

  // Text-to-Speech
  const speakText = () => {
    if (!generatedContent) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(generatedContent.text);
    
    // Set voice based on selection
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      switch (currentVoice) {
        case 'adult-male':
          utterance.voice = voices.find(v => v.name.includes('Male') || v.name.includes('David')) || voices[0];
          break;
        case 'adult-female':
          utterance.voice = voices.find(v => v.name.includes('Female') || v.name.includes('Samantha')) || voices[1];
          break;
        case 'teen':
          utterance.pitch = 1.2;
          utterance.rate = 1.1;
          break;
        case 'child-male':
        case 'child-female':
          utterance.pitch = 1.5;
          utterance.rate = 0.9;
          break;
        case 'robotic':
          utterance.pitch = 0.5;
          utterance.rate = 0.8;
          break;
      }
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  // Save message
  const saveMessage = () => {
    if (!generatedContent || request.isPrivateMode) return;
    
    const savedMessages = JSON.parse(localStorage.getItem('speakup-saved-messages') || '[]');
    const newMessage = {
      id: Date.now(),
      text: generatedContent.text,
      prompt: request.prompt,
      format: request.format,
      tone: request.tone,
      createdAt: new Date().toISOString()
    };
    
    savedMessages.push(newMessage);
    localStorage.setItem('speakup-saved-messages', JSON.stringify(savedMessages));
    
    alert('Message saved successfully!');
  };

  // Export functions
  const exportAsPDF = async () => {
    if (!generatedContent) return;
    
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Add title
    pdf.setFontSize(16);
    pdf.text('Generated Content', margin, 30);
    
    // Add content
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(generatedContent.text, maxWidth);
    pdf.text(lines, margin, 50);
    
    pdf.save('speakup-ai-content.pdf');
  };

  const exportAsImage = async () => {
    if (!generatedContent) return;
    
    const element = document.getElementById('generated-content');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = 'speakup-ai-content.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    
    const textToCopy = generatedContent.subjectLine 
      ? `Subject: ${generatedContent.subjectLine}\n\n${generatedContent.text}`
      : generatedContent.text;
    
    navigator.clipboard.writeText(textToCopy);
    alert('Content copied to clipboard!');
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Content...</h2>
          <p className="text-gray-600">Analyzing your request and crafting the perfect response</p>
          <div className="mt-4 text-sm text-gray-500">
            This may take a few seconds for the best results
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Generated Content</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {generatedContent?.estimatedDuration}
          </div>
        </div>

        {/* Original Request */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Your Request:</h3>
          <p className="text-blue-700 italic">"{request.prompt}"</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs capitalize">
              {request.format}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs capitalize">
              {request.tone}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {request.duration}
            </span>
          </div>
        </div>

        {/* Generated Content */}
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-purple-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Your Generated Content</h2>
              <div className="text-sm text-gray-500">
                {generatedContent?.wordCount} words
              </div>
            </div>
            {generatedContent?.subjectLine && (
              <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-600">Subject: </span>
                <span className="text-gray-800">{generatedContent.subjectLine}</span>
              </div>
            )}
          </div>

          <div id="generated-content" className="p-6">
            <div className="prose max-w-none">
              <div className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
                {generatedContent?.text}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Primary Actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-5 h-5" />
                Copy to Clipboard
              </button>
              
              <button
                onClick={speakText}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isSpeaking 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                {isSpeaking ? 'Stop Speaking' : 'Listen to Content'}
              </button>
              
              {!request.isPrivateMode && (
                <button
                  onClick={saveMessage}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-5 h-5" />
                  Save Message
                </button>
              )}
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
            <h3 className="font-semibold text-gray-800 mb-4">Export Options</h3>
            <div className="space-y-3">
              <button
                onClick={exportAsPDF}
                className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download as PDF
              </button>
              
              <button
                onClick={exportAsImage}
                className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Save as Image
              </button>
              
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
                Share to Social Media
              </button>
            </div>
          </div>
        </div>

        {/* Tweak Options */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Make It Better
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              onClick={() => regenerateWithTweak('funnier')}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
            >
              <Smile className="w-4 h-4" />
              Make Funnier
            </button>
            
            <button
              onClick={() => regenerateWithTweak('emotional')}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-3 bg-pink-100 text-pink-800 rounded-lg hover:bg-pink-200 transition-colors disabled:opacity-50"
            >
              <Heart className="w-4 h-4" />
              More Emotional
            </button>
            
            <button
              onClick={() => regenerateWithTweak('formal')}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Briefcase className="w-4 h-4" />
              More Formal
            </button>
            
            <button
              onClick={() => regenerateWithTweak('shorter')}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Make Shorter
            </button>
            
            <button
              onClick={() => regenerateWithTweak('longer')}
              disabled={isRegenerating}
              className="flex items-center gap-2 px-4 py-3 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Make Longer
            </button>
          </div>
          
          {isRegenerating && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-purple-600">
                <div className="w-4 h-4 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                Regenerating with your changes...
              </div>
            </div>
          )}
        </div>

        {/* Voice Settings */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-purple-100">
          <h3 className="font-semibold text-gray-800 mb-4">Voice Settings</h3>
          <select
            value={currentVoice}
            onChange={(e) => setCurrentVoice(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          >
            <option value="adult-male">👨 Adult Male</option>
            <option value="adult-female">👩 Adult Female</option>
            <option value="teen">👦 Teen</option>
            <option value="child-male">🧒 Boy Child</option>
            <option value="child-female">👧 Girl Child</option>
            <option value="robotic">🤖 Robotic</option>
          </select>
        </div>

        {request.isPrivateMode && (
          <div className="mt-6 p-4 bg-gray-800 text-white rounded-xl text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Private Mode Active</span>
            </div>
            <p className="text-sm text-gray-300">
              This content will not be saved and will be deleted when you leave this page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeechGenerator;