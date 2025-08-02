import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  SendOutlined,
  SmartToyOutlined,
  PersonOutlined,
  AutoAwesomeOutlined,
  PsychologyOutlined,
  FavoriteOutlined,
  LightbulbOutlined,
  SelfImprovementOutlined,
  EmojiEmotionsOutlined,
  RefreshOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

// AI Responses Database - Simulated AI Mental Health Assistant
const aiResponses = {
  greetings: [
    "Hello! I'm your AI mental health companion. I'm here to listen, support, and help you on your wellness journey. How are you feeling today?",
    "Hi there! Welcome to our safe space. I'm here to provide support and guidance whenever you need it. What's on your mind?",
    "Hello! I'm so glad you're here. Taking time for your mental health is important. How can I support you today?"
  ],
  
  mood_responses: {
    sad: [
      "I hear that you're feeling sad, and I want you to know that your feelings are completely valid. Sadness is a natural human emotion, and it's okay to sit with it. Would you like to talk about what's contributing to these feelings?",
      "Thank you for sharing that you're feeling sad. It takes courage to acknowledge difficult emotions. Remember that sadness, like all emotions, is temporary. What usually helps you feel a little better when you're going through tough times?"
    ],
    happy: [
      "I'm so glad to hear you're feeling happy! That's wonderful. Happiness is such a beautiful emotion to experience. What's bringing you joy today? I'd love to celebrate with you!",
      "How amazing that you're feeling happy! It's important to savor these positive moments. What's been going well in your life lately?"
    ],
    anxious: [
      "I understand you're feeling anxious, and I want you to know that anxiety is very common and treatable. Let's take a moment together - can you try taking three deep breaths with me? In for 4, hold for 4, out for 6.",
      "Anxiety can feel overwhelming, but you're not alone in this. Many people experience anxiety, and there are effective ways to manage it. What situations or thoughts tend to trigger your anxiety?"
    ],
    stressed: [
      "Stress can feel really overwhelming. I'm here to help you work through it. Sometimes breaking things down into smaller, manageable pieces can help. What's the main source of your stress right now?",
      "I hear that you're feeling stressed. That's a lot to carry. Let's think about some coping strategies together. Have you tried any relaxation techniques before?"
    ]
  },

  supportive_responses: [
    "You're incredibly brave for reaching out and sharing your feelings. That takes real strength.",
    "I want you to know that you're not alone in this. Many people go through similar experiences, and there is hope.",
    "Your feelings are valid, and you deserve support and compassion - especially from yourself.",
    "It's okay to not have all the answers right now. Healing and growth take time, and that's perfectly normal.",
    "You've taken an important step by being here and focusing on your mental health. That shows real self-awareness and care."
  ],

  coping_strategies: [
    "Here are some gentle coping strategies you might try: deep breathing exercises, going for a short walk, listening to calming music, or writing in a journal. What feels most appealing to you right now?",
    "Some helpful techniques include: practicing mindfulness, doing progressive muscle relaxation, calling a trusted friend, or engaging in a creative activity. Which of these resonates with you?",
    "Consider trying: the 5-4-3-2-1 grounding technique (5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste), gentle stretching, or practicing self-compassion. What sounds most helpful?"
  ],

  encouragement: [
    "You are stronger than you know, and you have the inner resources to get through this. I believe in you.",
    "Every small step you take toward caring for your mental health matters. You're doing important work.",
    "Remember that healing isn't linear - there will be ups and downs, and that's completely normal. Be patient with yourself.",
    "You deserve happiness, peace, and all good things in life. Don't let anyone, including yourself, tell you otherwise."
  ],

  professional_help: [
    "While I'm here to provide support, please remember that I'm an AI assistant and not a replacement for professional mental health care. If you're experiencing persistent difficulties, consider reaching out to a licensed therapist or counselor.",
    "If you're having thoughts of self-harm or suicide, please reach out for immediate help: National Suicide Prevention Lifeline (988), Crisis Text Line (text HOME to 741741), or your local emergency services.",
    "It's always okay to seek professional help. Therapists, counselors, and mental health professionals are trained to provide specialized support that can be incredibly valuable."
  ]
};

// AI Response Generator
const generateAIResponse = (userMessage, conversationHistory) => {
  const message = userMessage.toLowerCase();
  
  // Greeting detection
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || conversationHistory.length <= 1) {
    return aiResponses.greetings[Math.floor(Math.random() * aiResponses.greetings.length)];
  }
  
  // Mood detection
  if (message.includes('sad') || message.includes('down') || message.includes('depressed')) {
    return aiResponses.mood_responses.sad[Math.floor(Math.random() * aiResponses.mood_responses.sad.length)];
  }
  
  if (message.includes('happy') || message.includes('good') || message.includes('great') || message.includes('wonderful')) {
    return aiResponses.mood_responses.happy[Math.floor(Math.random() * aiResponses.mood_responses.happy.length)];
  }
  
  if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || message.includes('nervous')) {
    return aiResponses.mood_responses.anxious[Math.floor(Math.random() * aiResponses.mood_responses.anxious.length)];
  }
  
  if (message.includes('stressed') || message.includes('stress') || message.includes('overwhelmed')) {
    return aiResponses.mood_responses.stressed[Math.floor(Math.random() * aiResponses.mood_responses.stressed.length)];
  }
  
  // Help/coping strategies
  if (message.includes('help') || message.includes('cope') || message.includes('what should i do')) {
    return aiResponses.coping_strategies[Math.floor(Math.random() * aiResponses.coping_strategies.length)];
  }
  
  // Professional help keywords
  if (message.includes('therapist') || message.includes('professional') || message.includes('counselor')) {
    return aiResponses.professional_help[Math.floor(Math.random() * aiResponses.professional_help.length)];
  }
  
  // Default supportive response
  const supportiveResponses = [
    ...aiResponses.supportive_responses,
    ...aiResponses.encouragement
  ];
  
  return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
};

// Quick Action Prompts
const quickPrompts = [
  { text: "I'm feeling anxious", icon: <PsychologyOutlined /> },
  { text: "I need some encouragement", icon: <FavoriteOutlined /> },
  { text: "Help me cope with stress", icon: <SelfImprovementOutlined /> },
  { text: "I'm having a good day!", icon: <EmojiEmotionsOutlined /> },
  { text: "I need coping strategies", icon: <LightbulbOutlined /> },
  { text: "Tell me something positive", icon: <AutoAwesomeOutlined /> }
];

export default function AIChat() {
  const { state } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI mental health companion. I'm here to listen, support, and help you on your wellness journey. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(messageText, messages);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI mental health companion. I'm here to listen, support, and help you on your wellness journey. How are you feeling today?",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
    ]);
    toast.success('Chat cleared! Starting fresh conversation.');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
      {/* Header */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 2, 
          background: `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.secondary}15 100%)`,
          borderRadius: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ 
              mr: 2, 
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              width: 56,
              height: 56
            }}>
              <SmartToyOutlined sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, color: colors.primary }}>
                AI Mental Health Assistant
              </Typography>
              <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                Your compassionate AI companion for mental wellness support
              </Typography>
            </Box>
          </Box>
          <Button
            startIcon={<RefreshOutlined />}
            onClick={clearChat}
            sx={{ color: colors.secondary }}
          >
            Clear Chat
          </Button>
        </Box>
      </Paper>

      {/* Quick Action Prompts */}
      <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: colors.text.secondary }}>
          Quick Actions:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickPrompts.map((prompt, index) => (
            <Chip
              key={index}
              icon={prompt.icon}
              label={prompt.text}
              onClick={() => handleSendMessage(prompt.text)}
              sx={{
                backgroundColor: `${colors.primary}10`,
                color: colors.primary,
                '&:hover': {
                  backgroundColor: `${colors.primary}20`
                }
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Chat Messages */}
      <Paper 
        elevation={1} 
        sx={{ 
          flex: 1, 
          p: 2, 
          mb: 2, 
          overflow: 'auto',
          background: '#fafafa',
          borderRadius: 2
        }}
      >
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  maxWidth: '70%',
                  flexDirection: message.sender === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar
                  sx={{
                    mx: 1,
                    width: 40,
                    height: 40,
                    backgroundColor: message.sender === 'user' ? colors.secondary : colors.primary
                  }}
                >
                  {message.sender === 'user' ? <PersonOutlined /> : <SmartToyOutlined />}
                </Avatar>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? colors.secondary : 'white',
                    color: message.sender === 'user' ? 'white' : colors.text.primary,
                    borderRadius: 2,
                    maxWidth: '100%'
                  }}
                >
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {message.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      mt: 1, 
                      display: 'block',
                      opacity: 0.7
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </motion.div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <Fade in={isTyping}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ mr: 1, backgroundColor: colors.primary, width: 40, height: 40 }}>
                <SmartToyOutlined />
              </Avatar>
              <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    AI is thinking...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Fade>
        )}
        
        <div ref={messagesEndRef} />
      </Paper>

      {/* Message Input */}
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message here... Share what's on your mind."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />
          <IconButton
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            sx={{
              backgroundColor: colors.primary,
              color: 'white',
              '&:hover': {
                backgroundColor: colors.primaryDark
              },
              '&:disabled': {
                backgroundColor: colors.text.light
              }
            }}
          >
            <SendOutlined />
          </IconButton>
        </Box>
        
        <Typography variant="caption" sx={{ color: colors.text.secondary, mt: 1, display: 'block' }}>
          💡 This AI assistant provides supportive guidance but is not a replacement for professional mental health care.
        </Typography>
      </Paper>
    </Box>
  );
}
