import mongoose from 'mongoose';

const resetTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true, // adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Token', resetTokenSchema);
