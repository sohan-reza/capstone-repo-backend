import mongoose from 'mongoose';

const lineSchema = new mongoose.Schema({
  filename: String,
  content: String,
}, {
  timestamps: true,
});

lineSchema.index({ content: 'text' });

export const DocumentLine = mongoose.model('DocumentLine', lineSchema);

