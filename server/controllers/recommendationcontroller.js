import axios from 'axios';
import Course from '../models/course.js';
import User from '../models/user.js';
// Base URL of the FastAPI server
const FASTAPI_BASE_URL = 'http://127.0.0.1:8000';


export const getRecommendations = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Construct user profile
    const userProfile = {
      UserID: user._id.toString(),
      total_courses_taken: user.CompletedCourses?.length || 0,
      avg_rating: user.AverageRating || 4.0 // You can adjust this logic
    };

    // Create the payload as per FastAPI schema
    const payload = {
      user_profile: userProfile,
      candidate_course_ids: [], // You can populate this if you want to limit recommendations
      num_recommendations: 10,
      exclude_taken_courses: true
    };

    // Call FastAPI recommendation endpoint
    const response = await axios.post(`${FASTAPI_BASE_URL}/recommend`, payload);
    res.status(200).json(response.data);

  } catch (error) {
    console.error('Error fetching recommendations:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch recommendations',
      error: error.message,
    });
  }
};




// Fetch available courses
export const getCourses = async (req, res) => {
  try {
    const course = await Course.find({})
    if(course){
      return res.json(course);
    }
  } catch (error) {
    console.error('Error getting courses:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch courses',
      error: error.message,
    });
  }
};

// Batch recommendation for multiple users
export const getBatchRecommendations = async (req, res) => {
  try {
    const response = await axios.post(`${FASTAPI_BASE_URL}/batch-recommend`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error getting batch recommendations:', error.message);
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch batch recommendations',
      error: error.message,
    });
  }
};
