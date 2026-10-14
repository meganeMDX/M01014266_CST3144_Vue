export const teachers =
[
    {
        id: "001",
        title: "Dr",
        firstName: "Evelyn",
        lastName: "Vance"
    },
    {
        id: "002",
        title: "Mr",
        firstName: "Arthur",
        lastName: "Sterling"
    },
    {
        id: "003",
        title: "Mrs",
        firstName: "Emma",
        lastName: "Carson"
    },
]

export const lessons =
[
    {
        id: "001",
        topic: "Web Development",
        category: "Technology",
        itemType: "lesson",
        price: 15.00,
        location: "Hendon",
        space: 5,
        description: "Learn the fundamentals of building websites using HTML, CSS and JavaScript. Develop your skills by creating simple, interactive web pages while discovering how modern websites are designed and structured.",
        teacherId: "001",
        rating: 4,
        ratingCount: 1,
        imagePath: "images/lessons/web.jpeg",
        scheduledDay: "Monday",
        scheduledStartTime: "16:00",
        scheduledEndTime: "17:30",
    },
    {
        id: "002",
        topic: "Robotics for Beginners",
        category: "Technology",
        itemType: "lesson",
        price: 19.99,
        location: "Hendon",
        space: 5,
        description: "Discover the exciting world of robotics by exploring sensors, motors and basic programming. Learn how robots interact with their surroundings and experiment with simple robotic projects in a hands-on learning environment.",
        teacherId: "001",
        rating: 0,
        ratingCount: 0,
        imagePath: "images/lessons/robotics.jpg",
        scheduledDay: "Monday",
        scheduledStartTime: "16:00",
        scheduledEndTime: "17:30",
    },
    {
        id: "003",
        topic: "Music Theory",
        category: "Music",
        itemType: "lesson",
        price: 9.99,
        location: "Daisy Hall",
        space: 5,
        description: "Explore the building blocks of music, including notes, rhythm, scales and chords. Develop your understanding of musical notation and learn how different musical elements work together to create melodies and harmonies.",
        teacherId: "003",
        rating: 0,
        ratingCount: 0,
        imagePath: "images/lessons/musicTheory.png",
        scheduledDay: "Wednesday",
        scheduledStartTime: "17:00",
        scheduledEndTime: "18:30",
    },
    {
        id: "004",
        topic: "Crochet Workshop",
        category: "Crafts",
        itemType: "activity",
        price: 8.99,
        location: "Cozy Corner Studio",
        space: 5,
        description: "Learn basic crochet techniques, from making loops and chains to creating simple patterns. Experiment with colourful yarn and crochet hooks while developing your creativity and making small handmade projects to take home.",
        teacherId: "002",
        rating: 5,
        ratingCount: 1,
        imagePath: "images/activities/crochet.jpeg",
        scheduledDay: "Monday",
        scheduledStartTime: "16:00",
        scheduledEndTime: "17:30",
    },
    {
        id: "005",
        topic: "Drama & Theatre",
        category: "Performing Arts",
        itemType: "activity",
        price: 5.99,
        location: "The Horizon Theatre",
        space: 5,
        description: "Build confidence through acting exercises, improvisation and storytelling. Explore character development, expression and teamwork in a welcoming environment, with opportunities to practise scenes and bring stories to life.",
        teacherId: "002",
        rating: 0,
        ratingCount: 0,
        imagePath: "images/activities/theatre.jpeg",
        scheduledDay: "Friday",
        scheduledStartTime: "16:00",
        scheduledEndTime: "19:00",
    }
]

export const users =
[
    {
        id: "001",
        name: "Christy Watson",
        email: "christy@gmail.com",
        password: "C12345678",
        savedLessonIDs: ["001"]
    }
]

export const orders =
[
    {
        id: "001",
        userId: "001",
        name: "Christy Watson",
        phoneNumber: "55555555",
        lessonIDs: [
            {
                lessonId:"001",
                space:1
            },
            {
                lessonId:"004",
                space:2
            }
        ],
        orderDate: "2026-10-14",
        totalPrice: 32.98
    }
]

export const ratings=
[
    {
        id: "001",
        userId: "001",
        lessonId: "001",
        rating: 4,
    },
    {
        id: "002",
        userId: "001",
        lessonId: "004",
        rating: 5,
    }
]