// src/lib/api/mock-api.ts
import {
    User,
    Course,
    users,
    courses,
    purchases,
    getPopularCourses,
    getTeacherCourses,
    getStudentPurchasedCourses,
    getCourseById,
    searchCourses
  } from '../data/mock-data';
  
  // Simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Authentication APIs
  export const authApi = {
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      await delay(800); // Simulate network delay
      
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you'd validate the password here
      // For our mock, we'll just check if the password exists
      if (!password) {
        throw new Error('Password is required');
      }
      
      // Generate a fake token
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      return { user, token };
    },
    
    signup: async (userData: { name: string; email: string; password: string; role: 'teacher' | 'student' }): Promise<{ user: User; token: string }> => {
      await delay(1000);
      
      // Check if user already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create a new user
      const newUser: User = {
        id: `${userData.role[0]}${users.length + 1}`, // Simple ID generation
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`
      };
      
      // In a real app, you'd save this to a database
      users.push(newUser);
      
      // Generate a fake token
      const token = `mock_token_${newUser.id}_${Date.now()}`;
      
      return { user: newUser, token };
    },
    
    getCurrentUser: async (): Promise<User> => {
      await delay(500);
      
      // This would normally use the token to fetch the current user
      // For our mock, we'll just return the first user of the requested role
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Extract user ID from token
      const userId = token.split('_')[1];
      const user = users.find(u => u.id === userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return user;
    },
    
    logout: async (): Promise<void> => {
      await delay(300);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };
  
  // Course APIs
  export const courseApi = {
    // Get all courses
    getAllCourses: async (): Promise<Course[]> => {
      await delay(800);
      return [...courses];
    },
    
    // Get popular courses
    // Put my url
    getPopularCourses: async (): Promise<Course[]> => {
      await delay(800);
      return getPopularCourses();
    },
    
    // Get course by ID
    getCourseById: async (courseId: string): Promise<Course> => {
      await delay(600);
      const course = getCourseById(courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      return course;
    },
    
    // Search courses
    searchCourses: async (query: string): Promise<Course[]> => {
      await delay(700);
      return searchCourses(query);
    },
    
    // Create a new course
    createCourse: async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'purchaseCount'>): Promise<Course> => {
      await delay(1200);
      
      const newCourse: Course = {
        ...courseData,
        id: `c${courses.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        purchaseCount: 0,
      };
      
      courses.push(newCourse);
      
      return newCourse;
    },
    
    // Update a course
    updateCourse: async (courseId: string, courseData: Partial<Course>): Promise<Course> => {
      await delay(1000);
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      // Update the course
      const updatedCourse = {
        ...courses[courseIndex],
        ...courseData,
        updatedAt: new Date().toISOString()
      };
      
      courses[courseIndex] = updatedCourse;
      
      return updatedCourse;
    },
    
    // Delete a course
    deleteCourse: async (courseId: string): Promise<void> => {
      await delay(800);
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      courses.splice(courseIndex, 1);
    }
  };
  
  // Teacher APIs
  export const teacherApi = {
    // Get courses by teacher ID
    getTeacherCourses: async (teacherId: string): Promise<Course[]> => {
      await delay(700);
      return getTeacherCourses(teacherId);
    },
    
    // Get teacher stats
    getTeacherStats: async (teacherId: string): Promise<{
      totalCourses: number;
      totalStudents: number;
      totalRevenue: number;
    }> => {
      await delay(900);
      
      const teacherCourses = getTeacherCourses(teacherId);
      const courseIds = teacherCourses.map(course => course.id);
      
      // Get purchases for teacher's courses
      const coursesPurchases = purchases.filter(purchase => 
        courseIds.includes(purchase.courseId)
      );
      
      // Calculate stats
      const totalCourses = teacherCourses.length;
      const totalStudents = new Set(coursesPurchases.map(p => p.userId)).size;
      const totalRevenue = coursesPurchases.reduce((sum, p) => sum + p.amount, 0);
      
      return {
        totalCourses,
        totalStudents,
        totalRevenue
      };
    },
    
    // Add a lesson to a course
    addLesson: async (courseId: string, lessonData: Omit<Course['lessons'][0], 'id'>): Promise<Course> => {
      await delay(1000);
      
      const courseIndex = courses.findIndex(c => c.id === courseId);
      
      if (courseIndex === -1) {
        throw new Error('Course not found');
      }
      
      const course = courses[courseIndex];
      
      // Create a new lesson
      const newLesson = {
        ...lessonData,
        id: `l${course.lessons.length + 1}c${course.id.slice(1)}`
      };
      
      // Add the lesson to the course
      course.lessons.push(newLesson);
      course.updatedAt = new Date().toISOString();
      
      return course;
    }
  };
  
  // Student APIs
  export const studentApi = {
    // Get purchased courses
    getPurchasedCourses: async (studentId: string): Promise<Course[]> => {
      await delay(800);
      return getStudentPurchasedCourses(studentId);
    },
    
    // Purchase a course
    purchaseCourse: async (studentId: string, courseId: string): Promise<void> => {
      await delay(1500);
      
      // Check if the course exists
      const course = getCourseById(courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Check if the student has already purchased this course
      const alreadyPurchased = purchases.some(
        p => p.userId === studentId && p.courseId === courseId
      );
      
      if (alreadyPurchased) {
        throw new Error('Course already purchased');
      }
      
      // Create a new purchase
      const newPurchase = {
        id: `p${purchases.length + 1}`,
        userId: studentId,
        courseId,
        purchaseDate: new Date().toISOString(),
        amount: course.price
      };
      
      purchases.push(newPurchase);
      
      // Increment the purchase count for the course
      const courseIndex = courses.findIndex(c => c.id === courseId);
      courses[courseIndex].purchaseCount += 1;
    }
  };