const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const crypto   = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    avatar: { type: String, default: '' },

    // Email verification
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },

    // Password reset
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // Indian household preferences
    familySize: { type: Number, default: 4, min: 1, max: 20 },
    dietaryPreference: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan', 'eggetarian', 'pescatarian'],
      default: 'vegetarian',
    },
    region: {
      type: String,
      enum: ['north', 'south', 'east', 'west', 'northeast', 'pan-india'],
      default: 'pan-india',
    },
    spiceLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'very-hot'],
      default: 'medium',
    },
    allergies: [String],
    budget: {
      type: String,
      enum: ['budget', 'moderate', 'premium'],
      default: 'moderate',
    },
    cookingSkill: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },

    // Engagement
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: null },
    totalRecipesSaved: { type: Number, default: 0 },

    // Preferences
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return token;
};

userSchema.methods.getPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000;
  return token;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
