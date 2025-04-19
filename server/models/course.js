import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  CourseID: { type: Number, unique: true, required: true },
  CourseTitle: { type: String, required: true },
  Category:
  {
   type:String,
  },
  Description:{ type: String , required:true},
  Instructor:{ type:String},
  Duration: {type:String, required:true},
  DifficultyLevel: {
    type: String,
  },
  PreRequisites:{type:String},
  Tags:{ type:String,},
  CourseRating: {
    type: Number,
  },
});

export default mongoose.model('Course', CourseSchema);


