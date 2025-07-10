import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  sector: {
    type: String,
    required: true,
    enum: [
      'Health', 'Industry', 'Agriculture', 'Agro-processing', 
      'Food & Beverage', 'Construction & Engineering', 
      'Chemicals & Detergents', 'Textile & Garments', 
      'Multi-sectoral', 'Minerals'
    ]
  },
  region: {
    type: String,
    required: true
  },
  zone: {
    type: String,
    required: true,
    trim: true
  },
  woreda: {
    type: String,
    required: true,
    trim: true
  },
  approvalDate: {
    type: Date,
    required: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  advisorCompany: {
    type: String,
    trim: true
  },
  evaluator: {
    type: String,
    trim: true
  },
  grantedBy: {
    type: String,
    trim: true
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  ownerPhone: {
    type: String,
    required: true,
    trim: true
  },
  companyEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  companyWebsite: {
    type: String,
    trim: true
  },
  projectStatus: {
    type: String,
    required: true,
    enum: ['In Progress', 'Functional', 'Terminated']
  },
  clinic: {
    type: String,
    required: true,
    enum: ['Available', 'Unavailable']
  },
  employeesMale: {
    type: Number,
    default: 0,
    min: 0
  },
  employeesFemale: {
    type: Number,
    default: 0,
    min: 0
  },
  employeesTotal: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
projectSchema.index({ companyName: 1, sector: 1, region: 1 });
projectSchema.index({ sector: 1 });
projectSchema.index({ region: 1 });
projectSchema.index({ projectStatus: 1 });
projectSchema.index({ approvalDate: 1 });
projectSchema.index({ createdBy: 1 });

// Virtual for calculating total employees
projectSchema.pre('save', function(next) {
  this.employeesTotal = this.employeesMale + this.employeesFemale;
  next();
});

// Transform _id to id for frontend compatibility
projectSchema.set('toJSON', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Project', projectSchema);