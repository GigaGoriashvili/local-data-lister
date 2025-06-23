import mongoose from 'mongoose';
import { LocalItem } from '../models/localItem'; 
import dotenv from 'dotenv';
import connectDB from '../config/db';

dotenv.config();

const itemsToSeed = [
  {
    name: "Fitness Hub",
    type: "Gym",
    address: "33 Muscle Ln",
    description: "State-of-the-art gym with personal trainers and group classes.",
    tags: ["fitness", "health", "gym", "exercise"]
  },
  {
    name: "Green Leaf Market",
    type: "Shop",
    address: "88 Garden Ave",
    description: "Organic grocery store with fresh produce and local goods.",
    tags: ["organic", "grocery", "market", "healthy"]
  },
  {
    name: "Jazz Nights Downtown",
    type: "Event",
    address: "17 King St",
    description: "Weekly jazz concert featuring local and international artists.",
    tags: ["music", "jazz", "nightlife", "live"]
  },
  {
    name: "Luna Art Gallery",
    type: "Museum",
    address: "12 Crescent Blvd",
    description: "Contemporary art gallery featuring local painters and sculptors.",
    tags: ["art", "gallery", "exhibition", "local"]
  },
  {
    name: "Sunset Cinema",
    type: "Entertainment",
    address: "76 Cinema Parkway",
    description: "Outdoor cinema showing classics and new releases every weekend.",
    tags: ["movies", "outdoor", "entertainment", "film"]
  },
  {
    name: "Code & Coffee",
    type: "Cafe",
    address: "109 Tech Ave",
    description: "Coffee shop with a coworking space for developers and freelancers.",
    tags: ["coffee", "coding", "coworking", "tech"]
  },
  {
    name: "Bella Italia",
    type: "Restaurant",
    address: "91 Olive Dr",
    description: "Authentic Italian cuisine with a rustic ambiance.",
    tags: ["restaurant", "italian", "dining", "pasta"]
  },
  {
    name: "Ocean Breeze Spa",
    type: "Wellness",
    address: "28 Shoreline Rd",
    description: "Relaxing spa offering massages, facials, and steam baths.",
    tags: ["spa", "relax", "wellness", "massage"]
  },
  {
    name: "Vintage Vinyl",
    type: "Shop",
    address: "19 Retro Ln",
    description: "Music store specializing in vinyl records and vintage audio gear.",
    tags: ["music", "vinyl", "retro", "shop"]
  },
  {
    name: "The Climbing Center",
    type: "Recreation",
    address: "66 Rockway Blvd",
    description: "Indoor rock climbing facility with courses for all skill levels.",
    tags: ["climbing", "adventure", "indoor", "fitness"]
  },
  {
    name: "Cultural Fest 2024",
    type: "Event",
    address: "300 Heritage Plaza",
    description: "Annual festival celebrating food, music, and crafts from around the world.",
    tags: ["festival", "culture", "food", "music"]
  },
  {
    name: "Bright Minds Academy",
    type: "Education",
    address: "54 Knowledge Dr",
    description: "Tutoring center offering STEM programs for children and teens.",
    tags: ["education", "STEM", "learning", "students"]
  },
  {
    name: "Pet Paradise",
    type: "Shop",
    address: "8 Paw Ln",
    description: "Pet store with grooming services and organic pet food.",
    tags: ["pets", "grooming", "store", "animals"]
  },
  {
    name: "Hikers' Point",
    type: "Park",
    address: "99 Trailhead Rd",
    description: "Popular hiking spot with scenic mountain views.",
    tags: ["hiking", "outdoors", "mountains", "nature"]
  },
  {
    name: "Sunrise Yoga Studio",
    type: "Wellness",
    address: "44 Zen St",
    description: "Yoga studio offering classes for all levels with sunrise sessions.",
    tags: ["yoga", "fitness", "wellness", "mindfulness"]
  },
  {
    name: "Byte Bistro",
    type: "Restaurant",
    address: "21 Silicon Blvd",
    description: "Trendy bistro serving tech-themed dishes and drinks.",
    tags: ["food", "tech", "modern", "bistro"]
  },
  {
    name: "The Hidden Garden",
    type: "Park",
    address: "5 Blossom Path",
    description: "Small botanical garden with rare flowers and quiet spaces.",
    tags: ["garden", "botanical", "flowers", "peaceful"]
  },
  {
    name: "Puzzle Planet",
    type: "Entertainment",
    address: "123 Fun St",
    description: "Escape room venue with multiple themed rooms and group challenges.",
    tags: ["escape room", "games", "fun", "group"]
  },
  {
    name: "Crafted Creations",
    type: "Shop",
    address: "67 Artisan Ln",
    description: "Local crafts store selling handmade goods and materials.",
    tags: ["crafts", "local", "handmade", "shop"]
  },
  {
    name: "The History Vault",
    type: "Museum",
    address: "11 Heritage Way",
    description: "Interactive history museum with exhibits from ancient to modern times.",
    tags: ["museum", "history", "education", "interactive"]
  },
  {
    name: "Lakeview Bistro",
    type: "Restaurant",
    address: "101 Lakeside Dr",
    description: "Fine dining restaurant with a view over the lake.",
    tags: ["restaurant", "fine dining", "lake", "romantic"]
  },
  {
    name: "Starlight Observatory",
    type: "Education",
    address: "2 Galaxy Way",
    description: "Public observatory offering night sky tours and telescope viewing.",
    tags: ["stars", "space", "astronomy", "science"]
  }
];

const seedDatabase = async () => {
  await connectDB();
  try {
    console.log('Clearing existing data...');
    await LocalItem.deleteMany({}); // Clear existing data

    console.log('Seeding new data...');
    await LocalItem.insertMany(itemsToSeed);

    console.log('Data Successfully Seeded!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close(); // Close connection after seeding
  }
};

seedDatabase();