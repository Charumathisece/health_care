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
  Menu,
  MenuItem,
  Fab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  BookOutlined,
  AddOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreVertOutlined,
  LockOutlined,
  PublicOutlined,
  FavoriteOutlined,
  FavoriteBorderOutlined
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import apiClient from '../services/api';
import { colors } from '../theme/theme';
import toast from 'react-hot-toast';

const journalTags = [
  'Reflection', 'Gratitude', 'Goals', 'Dreams', 'Challenges', 'Growth',
  'Relationships', 'Work', 'Health', 'Creativity', 'Inspiration', 'Learning'
];

export default function Journal() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [journalEntries, setJournalEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [error, setError] = useState(null);
  const [entry, setEntry] = useState({
    title: '',
    content: '',
    tags: [],
    privacy: 'private'
  });

  // Load journal entries on component mount
  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      setLoadingEntries(true);
      const response = await apiClient.getJournalEntries();
      setJournalEntries(response.journals || []);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
      setError('Failed to load journal entries');
    } finally {
      setLoadingEntries(false);
    }
  };

  const handleTagToggle = (tag) => {
    setEntry(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleSubmit = async () => {
    if (!entry.title.trim()) {
      toast.error('Please add a title for your journal entry');
      return;
    }

    if (!entry.content.trim()) {
      toast.error('Please write some content for your journal entry');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const journalData = {
        title: entry.title.trim(),
        content: entry.content.trim(),
        tags: entry.tags,
        privacy: entry.privacy
      };

      if (editingEntry) {
        // Update existing entry
        await apiClient.updateJournalEntry(editingEntry._id, journalData);
        toast.success('Journal entry updated!');
      } else {
        // Create new entry
        await apiClient.createJournalEntry(journalData);
        toast.success('Journal entry saved!');
      }
      
      // Reload entries and reset form
      await loadJournalEntries();
      resetForm();
    } catch (error) {
      console.error('Failed to save journal entry:', error);
      setError(error.message || 'Failed to save journal entry');
      toast.error('Failed to save journal entry');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEntry({
      title: '',
      content: '',
      tags: [],
      privacy: 'private'
    });
    setEditingEntry(null);
    setOpen(false);
  };

  const handleEdit = (entryToEdit) => {
    setEntry({
      title: entryToEdit.title,
      content: entryToEdit.content,
      tags: entryToEdit.tags || [],
      privacy: entryToEdit.privacy || 'private'
    });
    setEditingEntry(entryToEdit);
    setOpen(true);
    setAnchorEl(null);
  };

  const handleDelete = async (entryId) => {
    try {
      await apiClient.deleteJournalEntry(entryId);
      await loadJournalEntries();
      toast.success('Journal entry deleted');
    } catch (error) {
      console.error('Failed to delete journal entry:', error);
      toast.error('Failed to delete journal entry');
    }
    setAnchorEl(null);
  };

  const handleToggleFavorite = async (entryId) => {
    try {
      await apiClient.toggleJournalFavorite(entryId);
      await loadJournalEntries();
      toast.success('Journal entry updated');
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast.error('Failed to update journal entry');
    }
  };

  const handleMenuOpen = (event, entry) => {
    setAnchorEl(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEntry(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          Digital Journal
        </Typography>
        <Typography variant="h6" sx={{ color: colors.text.secondary, mb: 4 }}>
          Your private space for thoughts, reflections, and memories
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Header Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {journalEntries.length} {journalEntries.length === 1 ? 'Entry' : 'Entries'}
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
        {loadingEntries ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : journalEntries.length > 0 ? (
          <Grid container spacing={3}>
            {journalEntries.map((journalEntry, index) => (
              <Grid item xs={12} md={6} lg={4} key={journalEntry._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ 
                            fontWeight: 600, 
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {journalEntry.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.text.secondary }}>
                            {formatDate(journalEntry.createdAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleToggleFavorite(journalEntry._id)}
                            sx={{ mr: 1 }}
                          >
                            {journalEntry.isFavorite ? 
                              <FavoriteOutlined sx={{ color: colors.secondary }} /> : 
                              <FavoriteBorderOutlined />
                            }
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, journalEntry)}
                          >
                            <MoreVertOutlined />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Content Preview */}
                      <Typography variant="body2" sx={{ 
                        color: colors.text.secondary,
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.5
                      }}>
                        {journalEntry.content}
                      </Typography>

                      {/* Tags */}
                      {journalEntry.tags && journalEntry.tags.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {journalEntry.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: `${colors.primary}15`,
                                color: colors.primary,
                                fontSize: '0.75rem'
                              }}
                            />
                          ))}
                          {journalEntry.tags.length > 3 && (
                            <Chip
                              label={`+${journalEntry.tags.length - 3}`}
                              size="small"
                              sx={{
                                backgroundColor: `${colors.text.light}15`,
                                color: colors.text.secondary,
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                        </Box>
                      )}

                      {/* Privacy Indicator */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {journalEntry.privacy === 'private' ? (
                            <LockOutlined sx={{ fontSize: 16, color: colors.text.light, mr: 0.5 }} />
                          ) : (
                            <PublicOutlined sx={{ fontSize: 16, color: colors.text.light, mr: 0.5 }} />
                          )}
                          <Typography variant="caption" sx={{ color: colors.text.light }}>
                            {journalEntry.privacy === 'private' ? 'Private' : 'Public'}
                          </Typography>
                        </Box>
                        
                        <Button
                          size="small"
                          onClick={() => handleEdit(journalEntry)}
                          sx={{ color: colors.primary }}
                        >
                          Read More
                        </Button>
                      </Box>
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

        {/* Floating Action Button */}
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
            }
          }}
          onClick={() => setOpen(true)}
        >
          <AddOutlined />
        </Fab>

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
          <MenuItem onClick={() => handleToggleFavorite(selectedEntry?._id)}>
            {selectedEntry?.isFavorite ? (
              <>
                <FavoriteBorderOutlined sx={{ mr: 1 }} />
                Remove from Favorites
              </>
            ) : (
              <>
                <FavoriteOutlined sx={{ mr: 1 }} />
                Add to Favorites
              </>
            )}
          </MenuItem>
          <MenuItem onClick={() => handleDelete(selectedEntry?._id)}>
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

            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              Privacy
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<LockOutlined />}
                label="Private"
                onClick={() => setEntry(prev => ({ ...prev, privacy: 'private' }))}
                variant={entry.privacy === 'private' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: entry.privacy === 'private' ? colors.primary : 'transparent',
                  color: entry.privacy === 'private' ? 'white' : colors.text.primary,
                  borderColor: colors.primary
                }}
              />
              <Chip
                icon={<PublicOutlined />}
                label="Public"
                onClick={() => setEntry(prev => ({ ...prev, privacy: 'public' }))}
                variant={entry.privacy === 'public' ? 'filled' : 'outlined'}
                sx={{
                  backgroundColor: entry.privacy === 'public' ? colors.primary : 'transparent',
                  color: entry.privacy === 'public' ? 'white' : colors.text.primary,
                  borderColor: colors.primary
                }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={resetForm}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.secondaryDark} 100%)`
                }
              }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                editingEntry ? 'Update Entry' : 'Save Entry'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Box>
  );
}
