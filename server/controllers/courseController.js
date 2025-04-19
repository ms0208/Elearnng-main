import Course from '../models/course.js';

export const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const saved = await course.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

export const getCourseById = async (req, res) => {
  try {
    const courseId = parseInt(req.params.id, 10);
    const course = await Course.findOne({ CourseID: courseId });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
