import mongoose from 'mongoose';

const InteractionSchema = new mongoose.Schema({
  UserID: Number,
  CourseID: Number,
  CourseProgress: Number,
  TimeSpent: Number,
  QuizScores: {
    type: Map,
    of: Number
  },
  TotalClicks:Number,
  Feedback: String
});

const Interactions =  mongoose.model('Interaction', InteractionSchema);

// ✅ Function to get user's taken courses
export const getUserCourses = async (UserId) => {
  const interactions = await Interactions.find({ userId });
  return interactions.map(interaction => interaction.courseId);
};

export default Interactions;
