import React, { useState } from 'react';
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
  Menu,
  MenuItem,
  Fab
} from '@mui/material';
import {
  BookOutlined,
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreVertOutlined,
  LockOutlined,
  PublicOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
// ReactQuill removed due to React 19 compatibility issues
import { useApp } from '../context/AppContext';
import { actionTypes } from '../context/AppContext';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

const journalTags = [
  'Reflection', 'Gratitude', 'Goals', 'Dreams', 'Challenges', 'Growth',
  'Relationships', 'Work', 'Health', 'Creativity', 'Inspiration', 'Learning'
];

export default function Journal() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [entry, setEntry] = useState({
    title: '',
    content: '',
    tags: [],
    privacy: 'private',
    date: new Date().toISOString()
  });

  const handleTagToggle = (tag) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = () => {
    if (!entry.title.trim()) {
      toast.error('Please add a title for your journal entry');
      return;
    }

    if (!entry.content.trim()) {
      toast.error('Please write some content for your journal entry');
      return;
    }

    const newEntry = {
      ...entry,
      id: editingEntry ? editingEntry.id : Date.now(),
      date: editingEntry ? editingEntry.date : new Date().toISOString()
    };

    if (editingEntry) {
      // Update existing entry
      const updatedEntries = state.journalEntries.map(e => 
        e.id === editingEntry.id ? newEntry : e
      );
      dispatch({ 
        type: actionTypes.LOAD_DATA, 
        payload: { ...state, journalEntries: updatedEntries }
      });
      toast.success('Journal entry updated!');
    } else {
      // Add new entry
      dispatch({ type: actionTypes.ADD_JOURNAL_ENTRY, payload: newEntry });
      toast.success('Journal entry saved! +20 XP');
    }
    
    resetForm();
  };

  const resetForm = () => {
    setEntry({
      title: '',
      content: '',
      tags: [],
      privacy: 'private',
      date: new Date().toISOString()
    });
    setEditingEntry(null);
    setOpen(false);
  };

  const handleEdit = (entryToEdit) => {
    setEntry(entryToEdit);
    setEditingEntry(entryToEdit);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = (entryId) => {
    const updatedEntries = state.journalEntries.filter(e => e.id !== entryId);
    dispatch({ 
      type: actionTypes.LOAD_DATA, 
      payload: { ...state, journalEntries: updatedEntries }
    });
    toast.success('Journal entry deleted');
    setAnchorEl(null);
  };

  const handleMenuOpen = (event, entry) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntry(null);
  };

  // Quill modules removed for React 19 compatibility

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
        Digital Journal
      </Typography>
      <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 4 }}>
        Your private space for thoughts, reflections, and memories
      </Typography>

      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Your Entries ({state.journalEntries.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddOutlined />}
          onClick={() => setOpen(true)}
          sx={{
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
            }
          }}
        >
          New Entry
        </Button>
      </Box>

      {/* Journal Entries */}
      {state.journalEntries.length > 0 ? (
        <Grid container spacing={3}>
          {state.journalEntries.slice().reverse().map((journalEntry, index) => (
            <Grid item xs={12} md={6} lg={4} key={journalEntry.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': { 
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {journalEntry.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {journalEntry.privacy === 'private' ? (
                          <LockOutlined sx={{ fontSize: 16, color: colors.text.light }} />
                        ) : (
                          <PublicOutlined sx={{ fontSize: 16, color: colors.text.light }} />
                        )}
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, journalEntry)}
                        >
                          <MoreVertOutlined />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.text.secondary,
                        mb: 2,
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {journalEntry.content.replace(/<[^>]*>/g, '')}
                    </Typography>

                    {journalEntry.tags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {journalEntry.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: `${colors.primary}20`,
                              color: colors.secondary,
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                        {journalEntry.tags.length > 3 && (
                          <Chip
                            label={`+${journalEntry.tags.length - 3}`}
                            size="small"
                            sx={{
                              backgroundColor: `${colors.secondary}20`,
                              color: colors.secondary,
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                    )}

                    <Typography variant="caption" sx={{ color: colors.text.light }}>
                      {new Date(journalEntry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <BookOutlined sx={{ fontSize: 64, color: colors.text.light, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Your journal is empty
            </Typography>
            <Typography variant="body2" sx={{ color: colors.text.secondary, mb: 3 }}>
              Start writing your thoughts, reflections, and memories
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setOpen(true)}
              sx={{
                borderColor: colors.primary,
                color: colors.primary,
                '&:hover': {
                  borderColor: colors.primaryDark,
                  backgroundColor: `${colors.primary}10`
                }
              }}
            >
              Write First Entry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(selectedEntry)}>
          <EditOutlined sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleDelete(selectedEntry?.id)}>
          <DeleteOutlined sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Journal Entry Dialog */}
      <Dialog open={open} onClose={resetForm} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {editingEntry ? 'Edit Journal Entry' : 'New Journal Entry'}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            placeholder="Give your entry a meaningful title..."
            value={entry.title}
            onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
            sx={{ mb: 3, mt: 1 }}
          />

          <TextField
            fullWidth
            multiline
            rows={8}
            label="Content"
            placeholder="Write your thoughts, feelings, and reflections here..."
            value={entry.content}
            onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
            sx={{ mb: 3 }}
            variant="outlined"
          />

          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Tags (optional)
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {journalTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => handleTagToggle(tag)}
                variant={entry.tags.includes(tag) ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: entry.tags.includes(tag) ? colors.primary : 'transparent',
                  color: entry.tags.includes(tag) ? 'white' : colors.text.primary,
                  borderColor: colors.primary,
                  '&:hover': {
                    backgroundColor: entry.tags.includes(tag) ? colors.primaryDark : `${colors.primary}10`
                  }
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={resetForm}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
              }
            }}
          >
            {editingEntry ? 'Update Entry' : 'Save Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
