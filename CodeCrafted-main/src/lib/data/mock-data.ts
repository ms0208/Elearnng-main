// src/lib/data/mock-data.ts

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'teacher' | 'student';
    avatar: string;
  }
  
  export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    teacherId: string;
    teacherName: string;
    createdAt: string;
    updatedAt: string;
    purchaseCount: number;
    rating: number;
    duration: string;
    lessons: Lesson[];
    category: string;
  }
  
  export interface Lesson {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    duration: string;
    order: number;
  }
  
  export interface Purchase {
    id: string;
    userId: string;
    courseId: string;
    purchaseDate: string;
    amount: number;
  }
  
  // Mock Users
  export const users: User[] = [
    {
      id: "t1",
      name: "John Smith",
      email: "john@example.com",
      role: "teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
    },
    {
      id: "t2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "teacher",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
    },
    {
      id: "s1",
      name: "Alex Brown",
      email: "alex@example.com",
      role: "student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex"
    },
    {
      id: "s2",
      name: "Jessica Lee",
      email: "jessica@example.com",
      role: "student",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica"
    }
  ];
  
  // Mock Courses
  export const courses: Course[] = [
    {
      id: "c1",
      title: "Web Development Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript to build modern websites from scratch.",
      price: 49.99,
      thumbnail: "https://img.freepik.com/free-photo/programming-background-with-person-working-with-codes-computer_23-2150010125.jpg",
      teacherId: "t1",
      teacherName: "John Smith",
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2023-02-20T14:30:00Z",
      purchaseCount: 245,
      rating: 4.7,
      duration: "12 hours",
      category: "Web Development",
      lessons: [
        {
          id: "l1c1",
          title: "Introduction to HTML",
          description: "Learn the basics of HTML structure and tags",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          duration: "45 minutes",
          order: 1
        },
        {
          id: "l2c1",
          title: "CSS Styling Basics",
          description: "Learn how to style your HTML with CSS",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
          duration: "55 minutes",
          order: 2
        },
        {
          id: "l3c1",
          title: "JavaScript Fundamentals",
          description: "Introduction to JavaScript programming",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          duration: "60 minutes",
          order: 3
        }
      ]
    },
    {
      id: "c2",
      title: "React for Beginners",
      description: "Master React.js and build modern, interactive UIs for web applications.",
      price: 59.99,
      thumbnail: "https://process.fs.teachablecdn.com/ADNupMnWyR7kCWRvm76Laz/resize=width:705/https://www.filepicker.io/api/file/fGWjtyQtG4JE7UXgaPAN",
      teacherId: "t1",
      teacherName: "John Smith",
      createdAt: "2023-03-10T09:15:00Z",
      updatedAt: "2023-04-05T11:20:00Z",
      purchaseCount: 189,
      rating: 4.8,
      duration: "15 hours",
      category: "Web Development",
      lessons: [
        {
          id: "l1c2",
          title: "React Fundamentals",
          description: "Understanding React components and JSX",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          duration: "65 minutes",
          order: 1
        },
        {
          id: "l2c2",
          title: "State and Props",
          description: "Managing state and props in React applications",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          duration: "70 minutes",
          order: 2
        }
      ]
    },
    {
      id: "c3",
      title: "Data Science with Python",
      description: "Learn data analysis, visualization, and machine learning with Python.",
      price: 69.99,
      thumbnail: "https://media.assettype.com/analyticsinsight%2F2024-07%2Fafccd6ac-6bc3-4872-954a-82710c8b0ca3%2FTop_10_Best_and_Free_Data_Science_Certification_Courses_2019_2.png",
      teacherId: "t2",
      teacherName: "Sarah Johnson",
      createdAt: "2023-02-05T08:30:00Z",
      updatedAt: "2023-03-15T13:45:00Z",
      purchaseCount: 312,
      rating: 4.9,
      duration: "20 hours",
      category: "Data Science",
      lessons: [
        {
          id: "l1c3",
          title: "Python Basics for Data Science",
          description: "Introduction to Python for data analysis",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          duration: "50 minutes",
          order: 1
        },
        {
          id: "l2c3",
          title: "Data Visualization with Matplotlib",
          description: "Creating effective data visualizations",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          duration: "55 minutes",
          order: 2
        }
      ]
    },
    {
      id: "c4",
      title: "Advanced JavaScript Patterns",
      description: "Master advanced JavaScript concepts and design patterns for professional development.",
      price: 79.99,
      thumbnail: "https://i.ytimg.com/vi/o1IaduQICO0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD-yAO_hfaFQl3_21gvZ1JFggG3UQ",
      teacherId: "t2",
      teacherName: "Sarah Johnson",
      createdAt: "2023-04-20T10:30:00Z",
      updatedAt: "2023-05-15T16:20:00Z",
      purchaseCount: 156,
      rating: 4.6,
      duration: "18 hours",
      category: "Web Development",
      lessons: [
        {
          id: "l1c4",
          title: "Closures and Scope",
          description: "Understanding JavaScript closures and scoping",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          duration: "60 minutes",
          order: 1
        },
        {
          id: "l2c4",
          title: "Prototypal Inheritance",
          description: "Deep dive into JavaScript's inheritance model",
          videoUrl: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          duration: "65 minutes",
          order: 2
        }
      ]
    }
  ];
  
  // Mock Purchases
  export const purchases: Purchase[] = [
    {
      id: "p1",
      userId: "s1",
      courseId: "c1",
      purchaseDate: "2023-02-10T14:25:00Z",
      amount: 49.99
    },
    {
      id: "p2",
      userId: "s1",
      courseId: "c3",
      purchaseDate: "2023-03-05T09:10:00Z",
      amount: 69.99
    },
    {
      id: "p3",
      userId: "s2",
      courseId: "c2",
      purchaseDate: "2023-03-15T16:40:00Z",
      amount: 59.99
    },
    {
      id: "p4",
      userId: "s2",
      courseId: "c4",
      purchaseDate: "2023-05-20T11:15:00Z",
      amount: 79.99
    }
  ];
  
  // Helper Functions to simulate API responses
  export const getPopularCourses = (): Course[] => {
    return [...courses].sort((a, b) => b.purchaseCount - a.purchaseCount);
  };
  
  export const getTeacherCourses = (teacherId: string): Course[] => {
    return courses.filter(course => course.teacherId === teacherId);
  };
  
  export const getStudentPurchasedCourses = (studentId: string): Course[] => {
    const purchasedCourseIds = purchases
      .filter(purchase => purchase.userId === studentId)
      .map(purchase => purchase.courseId);
    
    return courses.filter(course => purchasedCourseIds.includes(course.id));
  };
  
  export const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId);
  };
  
  export const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };
  
  export const searchCourses = (query: string): Course[] => {
    const lowercaseQuery = query.toLowerCase();
    return courses.filter(
      course => 
        course.title.toLowerCase().includes(lowercaseQuery) || 
        course.description.toLowerCase().includes(lowercaseQuery) ||
        course.category.toLowerCase().includes(lowercaseQuery)
    );
  };
  
  // Categories extracted from courses for filtering
  export const categories = Array.from(
    new Set(courses.map(course => course.category))
  );