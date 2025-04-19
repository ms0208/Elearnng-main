import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  EducationLevel: String,
  SkillsInterests: String,
  EnrolledCourses: [Number],
  CompletedCourses: [Number],
});

export default mongoose.model('User', UserSchema);
