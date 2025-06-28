import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Volume2, Download, RefreshCw, Save, Share2, Edit3, Clock, FileText, Mail, MessageSquare, Heart, Sparkles, Wand2, Zap, Filter } from 'lucide-react';
import { GenerationRequest } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface SpeechGeneratorProps {
  request: GenerationRequest;
  onBackToHome: () => void;
}

const SpeechGenerator: React.FC<SpeechGeneratorProps> = ({ request, onBackToHome }) => {
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [isCleanMode, setIsCleanMode] = useState(true);
  const [showTweakOptions, setShowTweakOptions] = useState(false);

  // Advanced content generation engine
  const generateRealContent = (request: GenerationRequest): string => {
    const { prompt, format, tone, duration, culturalContext, roleVoice } = request;
    
    // Extract key information from prompt
    const extractedInfo = analyzePrompt(prompt);
    const { names, occasion, relationship, emotion, subject } = extractedInfo;
    
    // Generate content based on format
    switch (format) {
      case 'email':
        return generateEmail(prompt, tone, names, subject, relationship, duration);
      case 'letter':
        return generateLetter(prompt, tone, names, relationship, occasion, duration);
      case 'resignation':
        return generateResignationLetter(prompt, tone, names, relationship, duration);
      case 'love-letter':
        return generateLoveLetter(prompt, tone, names, relationship, duration);
      case 'apology':
        return generateApology(prompt, tone, names, relationship, occasion, duration);
      case 'rejection':
        return generateRejectionLetter(prompt, tone, names, relationship, duration);
      case 'speech':
        return generateSpeech(prompt, tone, names, relationship, occasion, duration, culturalContext);
      case 'toast':
        return generateToast(prompt, tone, names, relationship, occasion, duration);
      case 'poem':
        return generatePoem(prompt, tone, names, relationship, occasion, duration);
      case 'rap':
        return generateRap(prompt, tone, names, relationship, occasion, duration);
      case 'prayer':
        return generatePrayer(prompt, tone, names, relationship, occasion, duration, culturalContext);
      case 'message':
        return generateMessage(prompt, tone, names, relationship, occasion, duration);
      default:
        return generateGenericContent(prompt, tone, names, relationship, occasion, duration);
    }
  };

  // Advanced prompt analysis
  const analyzePrompt = (prompt: string) => {
    const lowerPrompt = prompt.toLowerCase();
    
    // Extract names (look for patterns like "my friend John", "to Sarah", "for Mike")
    const namePatterns = [
      /(?:my|to|for|dear)\s+(?:friend|sister|brother|mom|dad|mother|father|boss|colleague|manager|wife|husband|girlfriend|boyfriend|partner)\s+([A-Z][a-z]+)/gi,
      /(?:to|for|dear)\s+([A-Z][a-z]+)/gi,
      /([A-Z][a-z]+)(?:'s|'s)/gi
    ];
    
    const names: string[] = [];
    namePatterns.forEach(pattern => {
      const matches = prompt.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const name = match.replace(/(?:my|to|for|dear|'s|'s)/gi, '').trim().split(' ').pop();
          if (name && name.length > 1 && !names.includes(name)) {
            names.push(name);
          }
        });
      }
    });

    // Detect occasion
    const occasions = {
      wedding: /wedding|marriage|bride|groom|ceremony/i,
      birthday: /birthday|birth day|bday/i,
      funeral: /funeral|memorial|passed away|died|death|rest in peace/i,
      graduation: /graduation|graduate|diploma|degree/i,
      resignation: /resign|quit|leaving|last day|new job/i,
      apology: /sorry|apologize|forgive|mistake|wrong/i,
      thank: /thank|grateful|appreciation|gratitude/i,
      farewell: /goodbye|farewell|leaving|moving|departure/i,
      promotion: /promotion|promoted|new position|congratulations/i,
      anniversary: /anniversary|years together/i
    };

    let occasion = '';
    for (const [key, pattern] of Object.entries(occasions)) {
      if (pattern.test(lowerPrompt)) {
        occasion = key;
        break;
      }
    }

    // Detect relationship
    const relationships = {
      boss: /boss|manager|supervisor|director|ceo/i,
      colleague: /colleague|coworker|team|work/i,
      friend: /friend|buddy|pal/i,
      family: /sister|brother|mom|dad|mother|father|parent|family/i,
      romantic: /girlfriend|boyfriend|wife|husband|partner|love|babe|honey/i,
      professional: /client|customer|candidate|applicant/i
    };

    let relationship = '';
    for (const [key, pattern] of Object.entries(relationships)) {
      if (pattern.test(lowerPrompt)) {
        relationship = key;
        break;
      }
    }

    // Detect emotion/subject
    const emotions = {
      sad: /sad|grief|loss|miss|hurt/i,
      happy: /happy|joy|excited|celebration/i,
      grateful: /thank|grateful|appreciate/i,
      sorry: /sorry|apologize|regret/i,
      love: /love|adore|cherish|heart/i,
      professional: /professional|business|formal/i
    };

    let emotion = '';
    for (const [key, pattern] of Object.entries(emotions)) {
      if (pattern.test(lowerPrompt)) {
        emotion = key;
        break;
      }
    }

    // Extract email subject if mentioned
    const subjectMatch = prompt.match(/subject:?\s*["']?([^"'\n]+)["']?/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : '';

    return { names, occasion, relationship, emotion, subject };
  };

  // Email generator with proper formatting
  const generateEmail = (prompt: string, tone: string, names: string[], subject: string, relationship: string, duration: string): string => {
    const recipientName = names[0] || getDefaultName(relationship);
    const autoSubject = subject || generateEmailSubject(prompt, tone, relationship);
    
    const greeting = getEmailGreeting(tone, recipientName, relationship);
    const body = generateEmailBody(prompt, tone, relationship, duration);
    const closing = getEmailClosing(tone, relationship);

    return `Subject: ${autoSubject}

${greeting}

${body}

${closing}

Best regards,
[Your Name]`;
  };

  const generateEmailSubject = (prompt: string, tone: string, relationship: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('time off') || lowerPrompt.includes('leave')) {
      return 'Request for Time Off';
    } else if (lowerPrompt.includes('meeting')) {
      return 'Meeting Request';
    } else if (lowerPrompt.includes('follow up')) {
      return 'Follow-up on Our Previous Discussion';
    } else if (lowerPrompt.includes('application') || lowerPrompt.includes('job')) {
      return 'Job Application Follow-up';
    } else if (lowerPrompt.includes('thank')) {
      return 'Thank You';
    } else if (lowerPrompt.includes('update')) {
      return 'Project Update';
    } else {
      return 'Important Message';
    }
  };

  const getEmailGreeting = (tone: string, name: string, relationship: string): string => {
    if (tone === 'formal' || relationship === 'boss' || relationship === 'professional') {
      return `Dear ${name},`;
    } else if (tone === 'casual') {
      return `Hi ${name},`;
    } else {
      return `Hello ${name},`;
    }
  };

  const generateEmailBody = (prompt: string, tone: string, relationship: string, duration: string): string => {
    const wordTarget = getWordTarget(duration);
    const lowerPrompt = prompt.toLowerCase();
    
    let body = '';
    
    if (lowerPrompt.includes('time off') || lowerPrompt.includes('leave')) {
      body = `I hope this email finds you well. I am writing to formally request time off from work. 

${extractSpecificDetails(prompt)}

I have ensured that all my current projects are on track and have made arrangements for coverage during my absence. I will be available via email for any urgent matters that may arise.

Thank you for considering my request. I look forward to your response.`;
    } else if (lowerPrompt.includes('resignation')) {
      body = `I am writing to formally notify you of my resignation from my position. My last day of work will be [Date].

${extractSpecificDetails(prompt)}

I am committed to making this transition as smooth as possible and am willing to assist in training my replacement or completing any outstanding projects.

Thank you for the opportunities for professional and personal growth during my time here.`;
    } else if (lowerPrompt.includes('thank')) {
      body = `I wanted to take a moment to express my sincere gratitude.

${extractSpecificDetails(prompt)}

Your support and guidance have made a significant impact, and I truly appreciate everything you've done.`;
    } else {
      body = `I hope this message finds you well.

${extractSpecificDetails(prompt)}

Please let me know if you need any additional information or if there's anything else I can help with.`;
    }

    return adjustContentLength(body, wordTarget, tone);
  };

  const getEmailClosing = (tone: string, relationship: string): string => {
    if (tone === 'formal' || relationship === 'boss') {
      return 'Sincerely,';
    } else if (tone === 'casual') {
      return 'Thanks,';
    } else {
      return 'Best regards,';
    }
  };

  // Letter generators
  const generateLetter = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const recipientName = names[0] || getDefaultName(relationship);
    const wordTarget = getWordTarget(duration);
    
    let content = `Dear ${recipientName},

${generateLetterBody(prompt, tone, relationship, occasion, wordTarget)}

With warm regards,
[Your Name]

${new Date().toLocaleDateString()}`;

    return content;
  };

  const generateResignationLetter = (prompt: string, tone: string, names: string[], relationship: string, duration: string): string => {
    const managerName = names[0] || 'Manager';
    const wordTarget = getWordTarget(duration);
    
    const specificDetails = extractSpecificDetails(prompt);
    const reasonForLeaving = extractResignationReason(prompt);
    
    let content = `Dear ${managerName},

Please accept this letter as my formal notification of resignation from my position with [Company Name]. My last day will be [Date - typically two weeks from today].

${reasonForLeaving}

${specificDetails}

I am committed to making this transition as smooth as possible. I am willing to assist in training my replacement and will ensure all my current projects are completed or properly handed over.

Thank you for the opportunities for professional and personal growth during my time here. I have enjoyed working with the team and appreciate the support provided to me.

Sincerely,
[Your Name]
[Date]`;

    return adjustContentLength(content, wordTarget, tone);
  };

  const generateLoveLetter = (prompt: string, tone: string, names: string[], relationship: string, duration: string): string => {
    const loverName = names[0] || 'My Love';
    const wordTarget = getWordTarget(duration);
    
    const specificMemories = extractSpecificDetails(prompt);
    const occasion = extractOccasion(prompt);
    
    let content = `My Dearest ${loverName},

${generateRomanticOpening(tone, occasion)}

${specificMemories}

${generateRomanticBody(prompt, tone, relationship, wordTarget)}

${generateRomanticClosing(tone)}

Forever yours,
[Your Name]`;

    return content;
  };

  const generateApology = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const recipientName = names[0] || getDefaultName(relationship);
    const wordTarget = getWordTarget(duration);
    
    const whatHappened = extractApologyReason(prompt);
    const specificDetails = extractSpecificDetails(prompt);
    
    let content = `Dear ${recipientName},

I am writing to sincerely apologize for ${whatHappened}.

${specificDetails}

I understand that my actions have hurt you, and I take full responsibility for what happened. There is no excuse for my behavior, and I deeply regret the pain I have caused.

${generateApologyBody(prompt, tone, relationship, wordTarget)}

I hope you can find it in your heart to forgive me. I am committed to making things right and ensuring this never happens again.

Sincerely,
[Your Name]`;

    return content;
  };

  const generateRejectionLetter = (prompt: string, tone: string, names: string[], relationship: string, duration: string): string => {
    const candidateName = names[0] || 'Candidate';
    const wordTarget = getWordTarget(duration);
    
    let content = `Dear ${candidateName},

Thank you for your interest in the position and for taking the time to interview with us.

After careful consideration, we have decided to move forward with another candidate whose experience more closely aligns with our current needs.

${extractSpecificDetails(prompt)}

We were impressed by your qualifications and encourage you to apply for future opportunities that match your skills and experience.

We wish you the best of luck in your job search.

Best regards,
[Your Name]
[Title]
[Company]`;

    return adjustContentLength(content, wordTarget, tone);
  };

  // Speech and toast generators
  const generateSpeech = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string, culturalContext?: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const wordTarget = getWordTarget(duration);
    
    let content = '';
    
    switch (occasion) {
      case 'wedding':
        content = generateWeddingSpeech(prompt, tone, personName, relationship, wordTarget, culturalContext);
        break;
      case 'funeral':
        content = generateFuneralSpeech(prompt, tone, personName, relationship, wordTarget, culturalContext);
        break;
      case 'graduation':
        content = generateGraduationSpeech(prompt, tone, personName, relationship, wordTarget);
        break;
      case 'birthday':
        content = generateBirthdaySpeech(prompt, tone, personName, relationship, wordTarget);
        break;
      case 'farewell':
        content = generateFarewellSpeech(prompt, tone, personName, relationship, wordTarget);
        break;
      default:
        content = generateGenericSpeech(prompt, tone, personName, relationship, wordTarget);
    }
    
    return applyRoleVoice(content, request.roleVoice || 'self');
  };

  const generateWeddingSpeech = (prompt: string, tone: string, personName: string, relationship: string, wordTarget: number, culturalContext?: string): string => {
    const specificDetails = extractSpecificDetails(prompt);
    const memories = extractMemories(prompt);
    
    let opening = '';
    let body = '';
    let closing = '';
    
    if (tone === 'funny') {
      opening = `Good evening, everyone! For those who don't know me, I'm [Your Name], and I've had the pleasure of knowing ${personName} for [time period]. And let me tell you, when ${personName} first told me about [partner's name], I knew something was different – they actually started showering regularly!`;
      
      body = `${specificDetails}

${memories}

But in all seriousness, seeing ${personName} with [partner's name] has been incredible. They bring out the best in each other, and it's clear they're perfect together. Well, as perfect as anyone can be with ${personName}!`;
      
      closing = `So let's raise our glasses to ${personName} and [partner's name] – may your love story be filled with laughter, joy, and may ${personName} finally learn to put the toilet seat down!`;
    } else {
      opening = `Good evening, everyone. I'm honored to stand here today to celebrate ${personName} and [partner's name] on this beautiful occasion.`;
      
      body = `${specificDetails}

${memories}

Watching ${personName} with [partner's name], I've witnessed something truly special. Their love is genuine, deep, and inspiring. They support each other, challenge each other, and most importantly, they make each other better people.`;
      
      closing = `${personName} and [partner's name], may your marriage be filled with endless love, laughter, and happiness. Here's to your beautiful future together!`;
    }
    
    let speech = `${opening}

${body}

${closing}`;
    
    if (culturalContext === 'african' || culturalContext === 'nigerian') {
      speech += `\n\nAs we say, "When two hearts unite, two families become one." May your union be blessed with prosperity, children, and long life.`;
    } else if (culturalContext === 'christian') {
      speech += `\n\nMay God bless your union and guide you through all the days of your lives together.`;
    }
    
    return adjustContentLength(speech, wordTarget, tone);
  };

  const generateToast = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const wordTarget = getWordTarget(duration);
    
    const specificDetails = extractSpecificDetails(prompt);
    
    let toast = '';
    
    if (occasion === 'birthday') {
      if (tone === 'funny') {
        toast = `Here's to ${personName} – another year older, another year wiser, and somehow still putting up with all of us! ${specificDetails} 

They say age is just a number, but in your case, it's a really big number! But seriously, ${personName}, you're amazing, and we're lucky to have you in our lives. Cheers to you!`;
      } else {
        toast = `Today we celebrate ${personName}, someone who brings so much joy and light into our lives. ${specificDetails}

${personName}, your kindness, wisdom, and friendship mean the world to all of us. Here's to another year of wonderful memories and adventures ahead!`;
      }
    } else if (occasion === 'wedding') {
      toast = `To ${personName} and [partner's name] – two incredible people who found their perfect match in each other. ${specificDetails}

May your love continue to grow stronger with each passing day. Cheers to your beautiful future together!`;
    } else {
      toast = `Here's to ${personName}! ${specificDetails}

You're an incredible person, and we're grateful to have you in our lives. Cheers!`;
    }
    
    return adjustContentLength(toast, wordTarget, tone);
  };

  // Poem and creative content generators
  const generatePoem = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const specificDetails = extractSpecificDetails(prompt);
    
    let poem = '';
    
    if (tone === 'romantic') {
      poem = `For ${personName}

In your eyes, I see my world,
A love so pure, so bright unfurled.
${specificDetails}

Your smile lights up my darkest days,
In countless beautiful ways.
Together we'll face what life may bring,
You are my everything.

With every breath, with every beat,
You make my life complete.
${personName}, my heart is true,
Forever and always, I love you.`;
    } else if (occasion === 'birthday') {
      poem = `Happy Birthday, ${personName}

Another year has come around,
With joy and laughter to be found.
${specificDetails}

You bring such light to all you meet,
Making every day complete.
On this special day we say,
Happy, happy birthday!

May all your dreams and wishes come true,
This birthday blessing is just for you.`;
    } else {
      poem = `For ${personName}

In this moment, words feel small,
To express what matters most of all.
${specificDetails}

You are special, you are dear,
Someone we hold close and near.
These simple words, though they may be,
Come from the heart, sincerely.`;
    }
    
    return poem;
  };

  const generateRap = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const specificDetails = extractSpecificDetails(prompt);
    
    let rap = `Yo, listen up, I got something to say,
About ${personName}, on this special day.
${specificDetails}

(Verse 1)
Started from the bottom, now we here,
${personName}'s the one we hold dear.
Through the good times and the bad,
Best friend that I ever had.

(Chorus)
${personName}, ${personName}, you're the one,
Shining bright just like the sun.
This rap's for you, straight from the heart,
You've been amazing from the start.

(Verse 2)
When life gets tough and things get rough,
You show us all what real love's made of.
Standing tall, never backing down,
You're the realest person around.

(Outro)
So here's to you, this is your time,
Celebrating you with this rhyme.
${personName}, you're simply the best,
Above all the rest!`;
    
    return rap;
  };

  const generatePrayer = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string, culturalContext?: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const specificDetails = extractSpecificDetails(prompt);
    
    let prayer = '';
    
    if (culturalContext === 'christian') {
      prayer = `Heavenly Father,

We come before You today with grateful hearts, lifting up ${personName} in prayer.

${specificDetails}

Lord, we ask for Your blessings upon ${personName}. Grant them strength, wisdom, and peace in all they do. May Your love surround them and Your grace guide their steps.

We pray for protection over their life, health, and happiness. May they continue to grow in faith and find joy in Your presence.

In Jesus' name we pray, Amen.`;
    } else if (culturalContext === 'islamic') {
      prayer = `Bismillah,

O Allah, the Most Gracious, the Most Merciful,

We ask for Your blessings upon ${personName}.

${specificDetails}

Ya Allah, grant ${personName} good health, happiness, and success in this life and the hereafter. Protect them from harm and guide them on the straight path.

May Your mercy and peace be upon them always.

Ameen.`;
    } else {
      prayer = `Dear God,

We lift up ${personName} to You today with thankful hearts.

${specificDetails}

We ask for Your blessings, protection, and guidance in their life. May they find peace, joy, and fulfillment in all they do.

Watch over them and keep them safe. Surround them with love and fill their days with happiness.

Amen.`;
    }
    
    return prayer;
  };

  const generateMessage = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const wordTarget = getWordTarget(duration);
    const specificDetails = extractSpecificDetails(prompt);
    
    let message = '';
    
    if (occasion === 'thank') {
      message = `Hey ${personName},

I just wanted to take a moment to say thank you. ${specificDetails}

Your kindness and support mean more to me than you know. I'm so grateful to have you in my life.

Thank you for being amazing! ❤️`;
    } else if (occasion === 'apology') {
      message = `${personName},

I owe you a sincere apology. ${specificDetails}

I was wrong, and I'm truly sorry for hurting you. You mean so much to me, and I hate that I've caused you pain.

Can we talk? I'd love the chance to make things right.`;
    } else if (tone === 'funny') {
      message = `${personName}! 

${specificDetails}

Hope this message finds you well and not doing anything too ridiculous (but knowing you, probably too late for that 😄).

You're awesome, and I just wanted to remind you of that!`;
    } else {
      message = `Hi ${personName},

${specificDetails}

Just wanted to reach out and let you know you're in my thoughts. Hope you're doing well!

Take care! 💙`;
    }
    
    return adjustContentLength(message, wordTarget, tone);
  };

  // Helper functions
  const extractSpecificDetails = (prompt: string): string => {
    // Extract specific details mentioned in the prompt
    const details = prompt.replace(/^(email|letter|speech|toast|message|poem|rap|prayer|resignation|love letter|apology|rejection)\s+(to|for)\s+/i, '');
    
    // If the prompt contains specific details, use them
    if (details.length > 20 && !details.toLowerCase().includes('generate') && !details.toLowerCase().includes('write')) {
      return `Based on what you've shared: ${details}`;
    }
    
    return 'I wanted to take this opportunity to express my thoughts and feelings.';
  };

  const extractMemories = (prompt: string): string => {
    const memoryKeywords = ['remember', 'memory', 'time when', 'always', 'never forget', 'recall'];
    const hasMemories = memoryKeywords.some(keyword => prompt.toLowerCase().includes(keyword));
    
    if (hasMemories) {
      return 'The memories we\'ve shared together are truly special and will always hold a place in my heart.';
    }
    
    return 'Looking back on all the moments we\'ve shared, I\'m filled with gratitude and joy.';
  };

  const extractResignationReason = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('new job') || lowerPrompt.includes('new opportunity')) {
      return 'I have accepted a new position that aligns with my career goals and offers new challenges.';
    } else if (lowerPrompt.includes('family') || lowerPrompt.includes('personal')) {
      return 'Due to personal and family circumstances, I have made the difficult decision to resign.';
    } else if (lowerPrompt.includes('relocat') || lowerPrompt.includes('moving')) {
      return 'I will be relocating and unfortunately cannot continue in my current position.';
    } else {
      return 'After careful consideration, I have decided to pursue new opportunities.';
    }
  };

  const extractApologyReason = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('argument') || lowerPrompt.includes('fight')) {
      return 'our recent argument and the hurtful things I said';
    } else if (lowerPrompt.includes('forgot') || lowerPrompt.includes('missed')) {
      return 'forgetting something important to you';
    } else if (lowerPrompt.includes('late') || lowerPrompt.includes('didn\'t show')) {
      return 'being late and not being there when you needed me';
    } else {
      return 'my actions and the way I behaved';
    }
  };

  const extractOccasion = (prompt: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('anniversary')) return 'anniversary';
    if (lowerPrompt.includes('valentine')) return 'valentine';
    if (lowerPrompt.includes('birthday')) return 'birthday';
    
    return 'special moment';
  };

  const generateRomanticOpening = (tone: string, occasion: string): string => {
    if (occasion === 'anniversary') {
      return 'As I sit here thinking about our journey together, my heart overflows with love and gratitude.';
    } else if (occasion === 'valentine') {
      return 'On this day of love, I want you to know just how much you mean to me.';
    } else {
      return 'Every day with you feels like a beautiful dream that I never want to wake up from.';
    }
  };

  const generateRomanticBody = (prompt: string, tone: string, relationship: string, wordTarget: number): string => {
    const specificDetails = extractSpecificDetails(prompt);
    
    let body = `${specificDetails}

You are my sunshine on cloudy days, my anchor in stormy seas, and my greatest joy in life. The way you laugh, the way you care for others, the way you make even ordinary moments feel magical – everything about you fills my heart with love.

I am so grateful for every moment we share, every conversation we have, and every dream we build together. You make me want to be a better person, and I fall in love with you more deeply every single day.`;
    
    return adjustContentLength(body, wordTarget, tone);
  };

  const generateRomanticClosing = (tone: string): string => {
    return 'You are my heart, my soul, my everything. I love you more than words could ever express.';
  };

  const generateApologyBody = (prompt: string, tone: string, relationship: string, wordTarget: number): string => {
    let body = `I know that saying sorry isn't enough, but I want you to know that I am truly remorseful. I've spent a lot of time reflecting on what happened, and I realize how my actions affected you.

You deserve so much better from me. You deserve respect, kindness, and consideration – all of which I failed to show. I am committed to learning from this mistake and becoming a better person.

I value our relationship more than you know, and I'm willing to do whatever it takes to rebuild the trust I've broken. I understand if you need time, and I respect whatever decision you make.`;
    
    return adjustContentLength(body, wordTarget, tone);
  };

  const generateLetterBody = (prompt: string, tone: string, relationship: string, occasion: string, wordTarget: number): string => {
    const specificDetails = extractSpecificDetails(prompt);
    
    let body = `${specificDetails}

I hope this letter finds you in good health and spirits. I wanted to take the time to write to you because there are things in my heart that I need to express.`;
    
    if (occasion === 'thank') {
      body += `\n\nYour kindness, support, and friendship have meant the world to me. In a world that can sometimes feel cold and disconnected, you have been a source of warmth and light.`;
    } else if (relationship === 'family') {
      body += `\n\nFamily means everything to me, and you are such an important part of that. The memories we've created together, the laughter we've shared, and the support you've given me through both good times and challenging ones – all of it has shaped who I am today.`;
    } else {
      body += `\n\nOur connection means so much to me. Whether we're sharing joyful moments or supporting each other through difficult times, I'm grateful for the bond we share.`;
    }
    
    body += `\n\nI wanted you to know how much you are appreciated and loved. Thank you for being such a wonderful part of my life.`;
    
    return adjustContentLength(body, wordTarget, tone);
  };

  const generateGenericContent = (prompt: string, tone: string, names: string[], relationship: string, occasion: string, duration: string): string => {
    const personName = names[0] || getDefaultName(relationship);
    const wordTarget = getWordTarget(duration);
    const specificDetails = extractSpecificDetails(prompt);
    
    let content = `Dear ${personName},

${specificDetails}

I wanted to reach out to you because you mean a great deal to me. Whether we're celebrating good times or supporting each other through challenges, I'm grateful for the connection we share.

Your presence in my life brings joy, laughter, and meaning. Thank you for being the wonderful person you are.

With warm regards,
[Your Name]`;
    
    return adjustContentLength(content, wordTarget, tone);
  };

  const getDefaultName = (relationship: string): string => {
    const defaults = {
      boss: 'Manager',
      colleague: 'Colleague',
      friend: 'Friend',
      family: 'Family Member',
      romantic: 'Love',
      professional: 'Sir/Madam'
    };
    
    return defaults[relationship as keyof typeof defaults] || 'Friend';
  };

  const getWordTarget = (duration: string): number => {
    const targets = {
      'short': 75,
      'medium': 225,
      'long': 750,
      '15s': 40,
      '30s': 80,
      '1min': 150,
      '2min': 300,
      '3min': 450,
      '5min': 750,
      'custom': 300
    };
    
    return targets[duration as keyof typeof targets] || 300;
  };

  const adjustContentLength = (content: string, targetWords: number, tone: string): string => {
    const currentWords = content.split(' ').length;
    
    if (currentWords < targetWords * 0.8) {
      // Content is too short, expand it
      if (tone === 'heartfelt' || tone === 'emotional') {
        content += `\n\nI find myself thinking about you often and feeling grateful for the positive impact you've had on my life. Your kindness, wisdom, and genuine care for others inspire me to be a better person.`;
      } else if (tone === 'funny') {
        content += `\n\nAnd hey, if this message seems a bit long, blame it on my inability to be concise – it's one of my many charming flaws!`;
      } else {
        content += `\n\nI hope these words convey even a fraction of what I feel in my heart. Thank you for being such an important part of my life.`;
      }
    } else if (currentWords > targetWords * 1.2) {
      // Content is too long, trim it
      const sentences = content.split('. ');
      const targetSentences = Math.floor(sentences.length * 0.8);
      content = sentences.slice(0, targetSentences).join('. ') + '.';
    }
    
    return content;
  };

  const applyRoleVoice = (content: string, roleVoice: string): string => {
    switch (roleVoice) {
      case 'pet':
        return `🐕 Woof woof! Translation from your beloved pet:\n\n"${content}"\n\n*tail wagging intensifies* 🐾`;
      case 'grandma':
        return `Oh sweetie, let Grandma tell you something...\n\n${content}\n\nNow don't forget to eat your vegetables and call me more often! 👵💕`;
      case 'future-self':
        return `Hey there, past me. It's your future self speaking from [future year]...\n\n${content}\n\nTrust me on this one – I've seen how it all turns out! 🔮✨`;
      case 'child-self':
        return `Hi! It's little me talking to you! 👶\n\n${content}\n\nP.S. Don't forget to have fun and eat lots of ice cream! 🍦`;
      case 'wise-elder':
        return `Listen well, young one, for I have lived many years and learned much...\n\n${content}\n\nMay these words guide you on your journey. 🧙‍♂️✨`;
      default:
        return content;
    }
  };

  // Tweaking functions
  const makeFunnier = (content: string): string => {
    // Add humor while keeping the core message
    const funnyAdditions = [
      "\n\n(And yes, I practiced this speech in the mirror – don't judge me!)",
      "\n\nP.S. If this made you laugh, my work here is done. If not, pretend it did!",
      "\n\n*mic drop* (Just kidding, I can't afford to replace the mic)",
      "\n\nDisclaimer: No feelings were harmed in the making of this message... I hope!"
    ];
    
    const randomAddition = funnyAdditions[Math.floor(Math.random() * funnyAdditions.length)];
    return content + randomAddition;
  };

  const makeMoreEmotional = (content: string): string => {
    // Deepen emotional connection
    const emotionalAdditions = [
      "\n\nMy heart is so full right now, and I hope you can feel the love and sincerity in these words.",
      "\n\nThere are no words that can fully express what's in my heart, but I hope this comes close.",
      "\n\nI'm getting emotional just writing this because you mean so much to me.",
      "\n\nIf I could give you one gift, it would be the ability to see yourself through my eyes – you are truly extraordinary."
    ];
    
    const randomAddition = emotionalAdditions[Math.floor(Math.random() * emotionalAdditions.length)];
    return content + randomAddition;
  };

  const makeFormal = (content: string): string => {
    // Convert to more professional tone
    return content
      .replace(/Hey|Hi/g, 'Dear')
      .replace(/awesome|amazing/g, 'exceptional')
      .replace(/really|super/g, 'very')
      .replace(/!/g, '.')
      .replace(/😄|😊|❤️|💕|🎉/g, '');
  };

  const makeCleanOrReal = (content: string, isClean: boolean): string => {
    if (isClean) {
      // Make more polite and professional
      return content
        .replace(/damn|hell/gi, 'very')
        .replace(/crazy|insane/gi, 'remarkable')
        .replace(/freaking|freakin'/gi, 'really');
    } else {
      // Make more casual and authentic
      return content
        .replace(/very/g, 'really')
        .replace(/remarkable/g, 'amazing')
        .replace(/I am/g, "I'm")
        .replace(/cannot/g, "can't")
        .replace(/will not/g, "won't");
    }
  };

  const shortenContent = (content: string): string => {
    const sentences = content.split('. ');
    const shortened = sentences.slice(0, Math.ceil(sentences.length * 0.6)).join('. ');
    return shortened.endsWith('.') ? shortened : shortened + '.';
  };

  // Main generation effect
  useEffect(() => {
    const generateContent = async () => {
      setIsGenerating(true);
      
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = generateRealContent(request);
      setGeneratedContent(content);
      
      // Calculate word count and estimated time
      const words = content.split(' ').length;
      setWordCount(words);
      
      // Estimate reading time (average 150 words per minute for speaking)
      const minutes = Math.ceil(words / 150);
      setEstimatedTime(minutes === 1 ? '1 minute' : `${minutes} minutes`);
      
      setIsGenerating(false);
    };

    generateContent();
  }, [request]);

  // Text-to-speech functionality
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(generatedContent);
    
    // Set voice based on selection
    const voices = window.speechSynthesis.getVoices();
    if (request.voice === 'adult-male') {
      const maleVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('David') || voice.name.includes('Mark'));
      if (maleVoice) utterance.voice = maleVoice;
    } else if (request.voice === 'child-male' || request.voice === 'child-female') {
      utterance.pitch = 1.5;
      utterance.rate = 1.1;
    } else if (request.voice === 'teen') {
      utterance.pitch = 1.2;
    }

    // Adjust speech based on tone
    if (request.tone === 'emotional' || request.tone === 'heartfelt') {
      utterance.rate = 0.8;
      utterance.pitch = 0.9;
    } else if (request.tone === 'funny') {
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
    } else if (request.tone === 'formal') {
      utterance.rate = 0.9;
      utterance.pitch = 0.8;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  // Save message
  const handleSave = () => {
    if (!request.isPrivateMode) {
      const savedMessages = JSON.parse(localStorage.getItem('speakup-saved-messages') || '[]');
      const newMessage = {
        id: Date.now(),
        text: generatedContent,
        prompt: request.prompt,
        format: request.format,
        tone: request.tone,
        createdAt: new Date().toISOString()
      };
      savedMessages.push(newMessage);
      localStorage.setItem('speakup-saved-messages', JSON.stringify(savedMessages));
      alert('Message saved successfully!');
    }
  };

  // Download as PDF
  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const splitText = pdf.splitTextToSize(generatedContent, 180);
    pdf.text(splitText, 10, 10);
    pdf.save(`speakup-ai-${request.format}.pdf`);
  };

  // Download as image
  const handleDownloadImage = async () => {
    const element = document.getElementById('generated-content');
    if (element) {
      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `speakup-ai-${request.format}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Tweak functions
  const handleTweak = (type: string) => {
    let newContent = generatedContent;
    
    switch (type) {
      case 'funnier':
        newContent = makeFunnier(generatedContent);
        break;
      case 'emotional':
        newContent = makeMoreEmotional(generatedContent);
        break;
      case 'formal':
        newContent = makeFormal(generatedContent);
        break;
      case 'shorter':
        newContent = shortenContent(generatedContent);
        break;
      case 'clean-real':
        newContent = makeCleanOrReal(generatedContent, !isCleanMode);
        setIsCleanMode(!isCleanMode);
        break;
    }
    
    setGeneratedContent(newContent);
    
    // Update word count
    const words = newContent.split(' ').length;
    setWordCount(words);
    const minutes = Math.ceil(words / 150);
    setEstimatedTime(minutes === 1 ? '1 minute' : `${minutes} minutes`);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newContent = generateRealContent(request);
      setGeneratedContent(newContent);
      
      const words = newContent.split(' ').length;
      setWordCount(words);
      const minutes = Math.ceil(words / 150);
      setEstimatedTime(minutes === 1 ? '1 minute' : `${minutes} minutes`);
      
      setIsGenerating(false);
    }, 1500);
  };

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
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 capitalize">
              {request.format === 'love-letter' ? 'Love Letter' : request.format} Generated
            </h1>
            <p className="text-gray-600">
              {request.tone} tone • {wordCount} words • ~{estimatedTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {request.format === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
            {request.format === 'letter' && <FileText className="w-5 h-5 text-green-600" />}
            {request.format === 'message' && <MessageSquare className="w-5 h-5 text-purple-600" />}
            {(request.format === 'love-letter' || request.tone === 'romantic') && <Heart className="w-5 h-5 text-red-600" />}
          </div>
        </div>

        {/* Generation Status */}
        {isGenerating ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-purple-100">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Crafting Your Perfect Content...</h3>
            <p className="text-gray-600">
              Analyzing your request and generating personalized content with {request.tone} tone
            </p>
            <div className="mt-6 flex justify-center gap-4 text-sm text-gray-500">
              <span>✨ Extracting key details</span>
              <span>🎯 Matching tone and style</span>
              <span>📝 Personalizing content</span>
            </div>
          </div>
        ) : (
          <>
            {/* Generated Content */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Your Generated Content
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Based on: "{request.prompt}"
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {estimatedTime}
                    </span>
                    <span>{wordCount} words</span>
                  </div>
                </div>
              </div>

              <div id="generated-content" className="p-8">
                <div className="prose max-w-none">
                  <div className="text-gray-800 leading-relaxed whitespace-pre-line font-serif text-lg">
                    {generatedContent}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  
                  <button
                    onClick={handleSpeak}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isSpeaking 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    {isSpeaking ? 'Stop' : 'Listen'}
                  </button>

                  {!request.isPrivateMode && (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  )}

                  <button
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>

                  <button
                    onClick={handleDownloadImage}
                    className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Image
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>

            {/* Tweak Options */}
            <div className="bg-white rounded-2xl shadow-xl border border-purple-100">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-purple-600" />
                    AI Tweak Tools
                  </h3>
                  <button
                    onClick={() => setShowTweakOptions(!showTweakOptions)}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    {showTweakOptions ? 'Hide' : 'Show'} Options
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  Instantly modify your content without starting over
                </p>
              </div>

              {showTweakOptions && (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleTweak('funnier')}
                      className="flex items-center gap-3 p-4 border-2 border-yellow-200 rounded-xl hover:bg-yellow-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">😄</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Make Funnier</h4>
                        <p className="text-sm text-gray-600">Add humor and lighten the mood</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleTweak('emotional')}
                      className="flex items-center gap-3 p-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">More Emotional</h4>
                        <p className="text-sm text-gray-600">Deepen emotional connection</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleTweak('formal')}
                      className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">💼</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">More Formal</h4>
                        <p className="text-sm text-gray-600">Professional and polished tone</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleTweak('shorter')}
                      className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-xl hover:bg-green-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Make Shorter</h4>
                        <p className="text-sm text-gray-600">Concise and to the point</p>
                      </div>
                    </button>

                    <button
                      onClick={() => handleTweak('clean-real')}
                      className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-xl hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Filter className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {isCleanMode ? 'Real Talk' : 'Clean Up'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {isCleanMode ? 'More casual and authentic' : 'More polite and professional'}
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={handleRegenerate}
                      className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Regenerate</h4>
                        <p className="text-sm text-gray-600">Create a new version</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Private Mode Notice */}
            {request.isPrivateMode && (
              <div className="mt-6 p-4 bg-gray-800 text-white rounded-xl text-center">
                <span className="text-sm">
                  🔒 Private Mode: This content will not be saved and will be deleted when you leave this page
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SpeechGenerator;