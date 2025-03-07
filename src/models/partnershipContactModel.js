import mongoose from "mongoose";

const partnershipContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  organization: {
    type: String,
    required: [true, 'Organization is required'],
    trim: true
  },
  partnershipType: {
    type: String,
    required: [true, 'Partnership type is required'],
    enum: [
      "Healthcare Provider",
      "Investor",
      "Government/NGO",
      "Tech Institution",
      "Patient Engagement Solutions",
      "Other"
    ]
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const partnershipContact  = mongoose.model('partnershipContact', partnershipContactSchema);