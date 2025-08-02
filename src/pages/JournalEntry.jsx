import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import {
  BookOutlined,
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CancelOutlined,
  LockOutlined,
  PublicOutlined,
  LocalOfferOutlined,
  CalendarTodayOutlined,
  SearchOutlined,
  FilterListOutlined,
  SortOutlined,
  FavoriteOutlined,
  FavoriteBorderOutlined,
  ShareOutlined,
  DownloadOutlined,
  PrintOutlined,
  BookmarkOutlined,
  BookmarkBorderOutlined,
  MoodOutlined,
  PhotoCameraOutlined,
  AttachFileOutlined,
  VoiceOverOffOutlined
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useApp } from '../context/AppContext';
import { actionTypes } from '../context/AppContext';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

const journalTags = [
  'Reflection', 'Gratitude', 'Goals', 'Dreams', 'Challenges', 'Growth',
  'Relationships', 'Work', 'Health', 'Creativity', 'Inspiration', 'Learning',
  'Mindfulness', 'Achievement', 'Travel', 'Family', 'Self-Care', 'Breakthrough'
];

const moodOptions = [
  { value: 1, label: 'Very Sad', emoji: '😢', color: '#ff4444' },
  { value: 2, label: 'Sad', emoji: '😔', color: '#ff8800' },
  { value: 3, label: 'Neutral', emoji: '😐', color: '#ffcc00' },
  { value: 4, label: 'Happy', emoji: '😊', color: '#88cc00' },
  { value: 5, label: 'Very Happy', emoji: '😄', color: '#44cc44' }
];

const journalPrompts = [
  "What am I most grateful for today?",
  "What challenged me today and how did I overcome it?",
  "What did I learn about myself today?",
  "How did I show kindness to myself or others today?",
  "What would I like to improve about tomorrow?",
  "What made me smile today?",
  "What am I looking forward to?",
  "How am I growing as a person?",
  "What are three things that went well today?",
  "What emotions did I experience today and why?"
];

export default function JournalEntry() {
  const { state, dispatch } = useApp();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterTag, setFilterTag] = useState('all');
  const [showPrompts, setShowPrompts] = useState(false);
  
  const [entry, setEntry] = useState({
    title: '',
    content: '',
    tags: [],
    privacy: 'private',
    mood: null,
    favorite: false,
    bookmark: false,
    date: new Date().toISOString(),
    wordCount: 0,
    readTime: 0
  });

  useEffect(() => {
    setEntries(state.journalEntries || []);
  }, [state.journalEntries]);

  useEffect(() => {
    let filtered = [...entries];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Tag filter
    if (filterTag !== 'all') {
      filtered = filtered.filter(entry => entry.tags.includes(filterTag));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'wordCount':
          return (b.wordCount || 0) - (a.wordCount || 0);
        case 'mood':
          return (b.mood || 0) - (a.mood || 0);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredEntries(filtered);
  }, [entries, searchQuery, filterTag, sortBy]);

  const calculateWordCount = (content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text ? text.split(/\s+/).length : 0;
  };

  const calculateReadTime = (wordCount) => {
    return Math.ceil(wordCount / 200); // Average reading speed
  };

  const handleSave = () => {
    if (!entry.title.trim() || !entry.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const wordCount = calculateWordCount(entry.content);
    const readTime = calculateReadTime(wordCount);

    const entryData = {
      ...entry,
      id: editingEntry ? editingEntry.id : Date.now(),
      wordCount,
      readTime,
      date: editingEntry ? editingEntry.date : new Date().toISOString()
    };

    if (editingEntry) {
      dispatch({
        type: actionTypes.UPDATE_JOURNAL_ENTRY,
        payload: entryData
      });
      toast.success('Entry updated successfully!');
    } else {
      dispatch({
        type: actionTypes.ADD_JOURNAL_ENTRY,
        payload: entryData
      });
      toast.success('Entry saved successfully!');
    }

    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
    setEditingEntry(null);
    setEntry({
      title: '',
      content: '',
      tags: [],
      privacy: 'private',
      mood: null,
      favorite: false,
      bookmark: false,
      date: new Date().toISOString(),
      wordCount: 0,
      readTime: 0
    });
  };

  const handleEdit = (entryToEdit) => {
    setEditingEntry(entryToEdit);
    setEntry(entryToEdit);
    setOpen(true);
  };

  const handleDelete = (entryId) => {
    dispatch({
      type: actionTypes.DELETE_JOURNAL_ENTRY,
      payload: entryId
    });
    toast.success('Entry deleted successfully');
  };

  const toggleFavorite = (entryId) => {
    const entryToUpdate = entries.find(e => e.id === entryId);
    if (entryToUpdate) {
      dispatch({
        type: actionTypes.UPDATE_JOURNAL_ENTRY,
        payload: { ...entryToUpdate, favorite: !entryToUpdate.favorite }
      });
    }
  };

  const toggleBookmark = (entryId) => {
    const entryToUpdate = entries.find(e => e.id === entryId);
    if (entryToUpdate) {
      dispatch({
        type: actionTypes.UPDATE_JOURNAL_ENTRY,
        payload: { ...entryToUpdate, bookmark: !entryToUpdate.bookmark }
      });
    }
  };

  const addTag = (tag) => {
    if (!entry.tags.includes(tag)) {
      setEntry(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const insertPrompt = (prompt) => {
    setEntry(prev => ({
      ...prev,
      content: prev.content + (prev.content ? '\n\n' : '') + prompt + '\n\n'
    }));
    setShowPrompts(false);
  };

  const getMoodColor = (moodValue) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.color : '#ccc';
  };

  const getMoodEmoji = (moodValue) => {
    const mood = moodOptions.find(m => m.value === moodValue);
    return mood ? mood.emoji : '😐';
  };

  const speedDialActions = [
    { icon: <MoodOutlined />, name: 'Quick Mood Entry', onClick: () => setOpen(true) },
    { icon: <BookmarkOutlined />, name: 'Bookmarked Entries', onClick: () => setFilterTag('bookmark') },
    { icon: <FavoriteOutlined />, name: 'Favorite Entries', onClick: () => setFilterTag('favorite') },
    { icon: <LocalOfferOutlined />, name: 'Browse by Tags', onClick: () => setShowPrompts(true) }
  ];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              <BookOutlined sx={{ mr: 2, verticalAlign: 'middle' }} />
              Journal Entries
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Capture your thoughts, feelings, and experiences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddOutlined />}
            onClick={() => setOpen(true)}
            sx={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`
              }
            }}
          >
            New Entry
          </Button>
        </Box>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchOutlined sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Filter by Tag</InputLabel>
                  <Select
                    value={filterTag}
                    label="Filter by Tag"
                    onChange={(e) => setFilterTag(e.target.value)}
                  >
                    <MenuItem value="all">All Entries</MenuItem>
                    {journalTags.map(tag => (
                      <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort by"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="wordCount">Word Count</MenuItem>
                    <MenuItem value="mood">Mood</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {filteredEntries.length} entries
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Entries Grid */}
      <Grid container spacing={3}>
        <AnimatePresence>
          {filteredEntries.map((journalEntry, index) => (
            <Grid item xs={12} md={6} lg={4} key={journalEntry.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                layout
              >
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.3s ease'
                }}>
                  {/* Mood Indicator */}
                  {journalEntry.mood && (
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: getMoodColor(journalEntry.mood),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      zIndex: 1
                    }}>
                      {getMoodEmoji(journalEntry.mood)}
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold',
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          {journalEntry.title}
                          {journalEntry.favorite && (
                            <FavoriteOutlined sx={{ color: colors.primary, fontSize: 16 }} />
                          )}
                          {journalEntry.bookmark && (
                            <BookmarkOutlined sx={{ color: colors.secondary, fontSize: 16 }} />
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {new Date(journalEntry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => toggleFavorite(journalEntry.id)}
                          sx={{ color: journalEntry.favorite ? colors.primary : 'text.secondary' }}
                        >
                          {journalEntry.favorite ? <FavoriteOutlined /> : <FavoriteBorderOutlined />}
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => toggleBookmark(journalEntry.id)}
                          sx={{ color: journalEntry.bookmark ? colors.secondary : 'text.secondary' }}
                        >
                          {journalEntry.bookmark ? <BookmarkOutlined /> : <BookmarkBorderOutlined />}
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      dangerouslySetInnerHTML={{ 
                        __html: journalEntry.content.replace(/<[^>]*>/g, '') 
                      }}
                    />

                    {/* Tags */}
                    <Box sx={{ mb: 2 }}>
                      {journalEntry.tags.slice(0, 3).map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            backgroundColor: `${colors.primary}20`,
                            color: colors.secondary
                          }}
                        />
                      ))}
                      {journalEntry.tags.length > 3 && (
                        <Chip
                          label={`+${journalEntry.tags.length - 3} more`}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            backgroundColor: `${colors.secondary}20`,
                            color: colors.primary
                          }}
                        />
                      )}
                    </Box>

                    {/* Entry Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {journalEntry.wordCount || 0} words • {journalEntry.readTime || 1} min read
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {journalEntry.privacy === 'private' ? (
                          <LockOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                        ) : (
                          <PublicOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
                        )}
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Action Buttons */}
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      size="small"
                      startIcon={<EditOutlined />}
                      onClick={() => handleEdit(journalEntry)}
                      sx={{ color: colors.primary }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteOutlined />}
                      onClick={() => handleDelete(journalEntry.id)}
                      color="error"
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      {/* Empty State */}
      {filteredEntries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BookOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              {searchQuery || filterTag !== 'all' ? 'No entries found' : 'No journal entries yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery || filterTag !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start your journaling journey by creating your first entry'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => setOpen(true)}
              sx={{
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`
                }
              }}
            >
              Create First Entry
            </Button>
          </Box>
        </motion.div>
      )}

      {/* Entry Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minHeight: '70vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20)`,
          borderBottom: `1px solid ${colors.primary}40`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
            </Typography>
            <Button
              size="small"
              onClick={() => setShowPrompts(!showPrompts)}
              startIcon={<LocalOfferOutlined />}
            >
              Prompts
            </Button>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {/* Writing Prompts */}
          {showPrompts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Paper sx={{ p: 2, mb: 3, background: `${colors.primary}10` }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Writing Prompts
                </Typography>
                <Grid container spacing={1}>
                  {journalPrompts.map((prompt, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => insertPrompt(prompt)}
                        sx={{ 
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          textTransform: 'none',
                          mb: 1
                        }}
                      >
                        {prompt}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Entry Title"
                value={entry.title}
                onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Mood</InputLabel>
                <Select
                  value={entry.mood || ''}
                  label="Mood"
                  onChange={(e) => setEntry(prev => ({ ...prev, mood: e.target.value }))}
                >
                  {moodOptions.map(mood => (
                    <MenuItem key={mood.value} value={mood.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span style={{ fontSize: '18px' }}>{mood.emoji}</span>
                        {mood.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Privacy</InputLabel>
                <Select
                  value={entry.privacy}
                  label="Privacy"
                  onChange={(e) => setEntry(prev => ({ ...prev, privacy: e.target.value }))}
                >
                  <MenuItem value="private">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockOutlined fontSize="small" />
                      Private
                    </Box>
                  </MenuItem>
                  <MenuItem value="public">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PublicOutlined fontSize="small" />
                      Public
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Content</Typography>
              <ReactQuill
                value={entry.content}
                onChange={(content) => setEntry(prev => ({ ...prev, content }))}
                style={{ height: '300px', marginBottom: '50px' }}
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link', 'blockquote', 'code-block'],
                    ['clean']
                  ]
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Tags</Typography>
              <Box sx={{ mb: 2 }}>
                {entry.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      backgroundColor: `${colors.primary}20`,
                      color: colors.secondary
                    }}
                  />
                ))}
              </Box>
              <Box>
                {journalTags.filter(tag => !entry.tags.includes(tag)).map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onClick={() => addTag(tag)}
                    variant="outlined"
                    sx={{
                      mr: 0.5,
                      mb: 0.5,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: `${colors.primary}10`
                      }
                    }}
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={entry.favorite}
                      onChange={(e) => setEntry(prev => ({ ...prev, favorite: e.target.checked }))}
                      color="primary"
                    />
                  }
                  label="Mark as Favorite"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={entry.bookmark}
                      onChange={(e) => setEntry(prev => ({ ...prev, bookmark: e.target.checked }))}
                      color="secondary"
                    />
                  }
                  label="Bookmark"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: `1px solid ${colors.primary}40` }}>
          <Button onClick={handleClose} startIcon={<CancelOutlined />}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveOutlined />}
            sx={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`
              }
            }}
          >
            {editingEntry ? 'Update' : 'Save'} Entry
          </Button>
        </DialogActions>
      </Dialog>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Journal actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
