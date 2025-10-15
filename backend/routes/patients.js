import express from 'express';
import { body, validationResult } from 'express-validator';
import Patient from '../models/Patient.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new patient tied to the authenticated user
router.post('/', [
  body('name').notEmpty().withMessage('Patient name is required').isLength({ max: 200 }),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date'),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say'])
], async (req, res) => {
  try {
    console.log('Create patient request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const data = {
      user: req.user._id,
      username: req.user.username,
      name: req.body.name,
      dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : undefined,
      gender: req.body.gender,
      contact: req.body.contact || {},
      medicalHistory: req.body.medicalHistory || '',
      notes: req.body.notes || ''
    };

    const patient = new Patient(data);
    await patient.save();

    // Return plain object to avoid MongooseDocument wrapper problems on the client
    res.status(201).json({ message: 'Patient created', patient: patient.toObject() });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Failed to create patient', message: 'Internal server error' });
  }
});

// Get all patients for authenticated user
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find({ user: req.user._id, isActive: true }).sort({ createdAt: -1 }).lean();
    res.json({ patients });
  } catch (error) {
    console.error('List patients error:', error);
    res.status(500).json({ error: 'Failed to list patients' });
  }
});

// Get a single patient by ID (must belong to user)
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({ _id: req.params.id, user: req.user._id, isActive: true });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ patient });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Failed to get patient' });
  }
});

// Update a patient (partial update)
router.put('/:id', [
  body('name').optional().isLength({ max: 200 }),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female', 'other', 'prefer-not-to-say'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });

    const updateData = {};
    ['name', 'dateOfBirth', 'gender', 'medicalHistory', 'notes', 'contact'].forEach(key => {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    });

    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient updated', patient });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Failed to update patient' });
  }
});

// Soft-delete a patient
router.delete('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false },
      { new: true }
    );
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient removed' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Failed to remove patient' });
  }
});

export default router;
