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
  CircularProgress,
  Alert
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
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../services/api';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

// Quick Action Prompts
const quickPrompts = [
  { text: "I'm feeling anxious", icon: <PsychologyOutlined /> },
  { text: "I need some encouragement", icon: <FavoriteOutlined /> },
  { text: "Help me cope with stress", icon: <SelfImprovementOutlined /> },
  { text: "I'm having a good day!", icon: <EmojiEmotionsOutlined /> },
  { text: "I need coping strategies", icon: <LightbulbOutlined /> },
  { text: "Tell me something positive", icon: <AutoAwesomeOutlined /> }
];

// Fallback AI responses for when backend is unavailable
const fallbackResponses = [
  "I'm here to listen and support you. Thank you for sharing with me.",
  "Your feelings are valid, and it's important that you're taking care of your mental health.",
  "Remember that you're not alone in this journey. Every step you take matters.",
  "It's okay to have difficult days. What's important is that you're reaching out for support.",
  "You're showing great strength by focusing on your wellbeing. I'm here to help however I can."
];

export default function AIChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize chat session on component mount
  useEffect(() => {
    initializeChatSession();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChatSession = async () => {
    try {
      setLoading(true);
      const response = await apiClient.createChatSession({
        title: `Chat Session - ${new Date().toLocaleDateString()}`,
        type: 'support'
      });
      setCurrentSession(response.session);
      
      // Add welcome message
      const welcomeMessage = {
        _id: 'welcome',
        sender: 'ai',
        content: "Hello! I'm your AI mental health companion. I'm here to listen, support, and help you on your wellness journey. How are you feeling today?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      setError('Failed to start chat session');
      // Add fallback welcome message
      const fallbackMessage = {
        _id: 'welcome-fallback',
        sender: 'ai',
        content: "Hello! I'm here to support you. While I'm having trouble connecting to my full capabilities right now, I can still listen and provide basic support. How are you feeling today?",
        timestamp: new Date().toISOString()
      };
      setMessages([fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('anxious') || message.includes('anxiety')) {
      return "I understand you're feeling anxious. Try taking a few deep breaths with me - in for 4 counts, hold for 4, out for 6. You're not alone in this feeling.";
    }
    
    if (message.includes('sad') || message.includes('depressed')) {
      return "I hear that you're feeling sad, and I want you to know that your feelings are completely valid. It's okay to sit with these emotions. Would you like to talk about what's on your mind?";
    }
    
    if (message.includes('stressed') || message.includes('stress')) {
      return "Stress can feel overwhelming. Let's try to break things down into smaller, manageable pieces. What's the main source of your stress right now?";
    }
    
    if (message.includes('happy') || message.includes('good') || message.includes('great')) {
      return "I'm so glad to hear you're feeling positive! It's wonderful to celebrate these moments. What's bringing you joy today?";
    }
    
    // Return random supportive response
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      _id: Date.now().toString(),
      sender: 'user',
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let aiResponse;
      
      if (currentSession) {
        // Try to get AI response from backend
        try {
          const response = await apiClient.addChatMessage(currentSession._id, {
            content: messageText.trim(),
            sender: 'user'
          });
          
          // In a real implementation, this would return an AI-generated response
          // For now, we'll simulate an AI response
          aiResponse = {
            _id: Date.now().toString() + '_ai',
            sender: 'ai',
            content: generateFallbackResponse(messageText),
            timestamp: new Date().toISOString()
          };
        } catch (apiError) {
          console.error('API call failed, using fallback:', apiError);
          aiResponse = {
            _id: Date.now().toString() + '_fallback',
            sender: 'ai',
            content: generateFallbackResponse(messageText),
            timestamp: new Date().toISOString()
          };
        }
      } else {
        // Use fallback response
        aiResponse = {
          _id: Date.now().toString() + '_fallback',
          sender: 'ai',
          content: generateFallbackResponse(messageText),
          timestamp: new Date().toISOString()
        };
      }

      // Simulate typing delay
      setTimeout(() => {
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      setMessages([]);
      await initializeChatSession();
      toast.success('Chat cleared');
    } catch (error) {
      console.error('Failed to clear chat:', error);
      toast.error('Failed to clear chat');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              AI Mental Health Companion
            </Typography>
            <Typography variant="h6" sx={{ color: colors.text.secondary }}>
              Your supportive AI assistant for mental wellness
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshOutlined />}
            onClick={clearChat}
            sx={{
              borderColor: colors.primary,
              color: colors.primary,
              '&:hover': {
                borderColor: colors.primaryDark,
                backgroundColor: `${colors.primary}10`
              }
            }}
          >
            New Chat
          </Button>
        </Box>

        {error && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {error} - Using offline mode with basic responses.
          </Alert>
        )}

        {/* Quick Prompts */}
        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              <AutoAwesomeOutlined sx={{ mr: 1, verticalAlign: 'middle' }} />
              Quick Start Prompts
            </Typography>
            <Grid container spacing={1}>
              {quickPrompts.map((prompt, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Chip
                    icon={prompt.icon}
                    label={prompt.text}
                    onClick={() => handleSendMessage(prompt.text)}
                    variant="outlined"
                    sx={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      borderColor: colors.primary,
                      color: colors.text.primary,
                      '&:hover': {
                        backgroundColor: `${colors.primary}10`,
                        borderColor: colors.primaryDark
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messages Container */}
      <Paper 
        elevation={2} 
        sx={{ 
          flex: 1, 
          p: 3, 
          mb: 2, 
          borderRadius: 2, 
          overflowY: 'auto',
          backgroundColor: '#fafafa'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {messages.map((message, index) => (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
                        {message.content}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          mt: 1, 
                          display: 'block',
                          opacity: 0.7
                        }}
                      >
                        {formatTime(message.timestamp)}
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
          </>
        )}
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
