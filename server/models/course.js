import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  CourseID: { type: Number, unique: true, required: true },
  CourseTitle: { type: String, required: true },
  Category: { type: String },
  Description: { type: String, required: true },
  Instructor: { type: String },
  Duration: { type: String, required: true }, // Changed from String to Number
  DifficultyLevel: { type: String },
  PreRequisites: { type: [String] }, // Changed to array of strings
  Tags: { type: [String] }, // Changed to array of strings
  CourseRating: {
    Average: { type: Number },
    Count: { type: Number }
  },
  PopularityMetrics: {
    Enrollments: { type: Number },
    CompletionRate: { type: Number }
  },
  CourseImages: { type: String },
  CoursePrice: { type: String }
});

export default mongoose.model('Course', CourseSchema);
