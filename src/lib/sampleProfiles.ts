export interface ProfileCard {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  photo: string;
  verified: boolean;
  premium: boolean;
}

export const sampleProfiles: ProfileCard[] = [
  {
    id: "1",
    name: "Priya Sharma",
    age: 26,
    location: "Mumbai, Maharashtra",
    profession: "Software Engineer",
    education: "B.Tech Computer Science",
    photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
    verified: true,
    premium: true
  },
  {
    id: "2",
    name: "Anita Gupta",
    age: 24,
    location: "Delhi, NCR",
    profession: "Teacher",
    education: "M.A. English",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face",
    verified: true,
    premium: false
  },
  {
    id: "3",
    name: "Kavya Patel",
    age: 28,
    location: "Bangalore, Karnataka",
    profession: "Marketing Manager",
    education: "MBA Marketing",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=600&fit=crop&crop=face",
    verified: false,
    premium: true
  },
  {
    id: "4",
    name: "Sneha Singh",
    age: 25,
    location: "Pune, Maharashtra",
    profession: "Doctor",
    education: "MBBS",
    photo: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop&crop=face",
    verified: true,
    premium: true
  },
  {
    id: "5",
    name: "Riya Jain",
    age: 27,
    location: "Hyderabad, Telangana",
    profession: "Designer",
    education: "B.Des Fashion",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    verified: true,
    premium: false
  },
  {
    id: "6",
    name: "Pooja Verma",
    age: 23,
    location: "Chennai, Tamil Nadu",
    profession: "Architect",
    education: "B.Arch",
    photo: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=600&fit=crop&crop=face",
    verified: false,
    premium: false
  }
];

export default sampleProfiles;
