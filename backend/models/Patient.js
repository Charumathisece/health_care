import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  contact: {
    phone: String,
    email: String,
    address: String
  },
  medicalHistory: {
    type: String,
    maxlength: 2000
  },
  notes: {
    type: String,
    maxlength: 2000
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Patient', patientSchema);
