import mongoose from 'mongoose';
import { LocalItem } from '../models/localItem'; 
import dotenv from 'dotenv';
import connectDB from '../config/db';

dotenv.config();

const itemsToSeed = [
  {
    name: "The Grand Cafe",
    type: "Restaurant",
    address: "101 Main St",
    description: "Cozy cafe with excellent coffee and pastries.",
    tags: ["coffee", "bakery", "casual", "breakfast"]
  },
  {
    name: "Adventure Park",
    type: "Park",
    address: "45 River Rd",
    description: "Large park with walking trails, a lake, and picnic areas.",
    tags: ["outdoor", "nature", "family", "walking"]
  },
  {
    name: "Tech Meetup 2023",
    type: "Event",
    address: "200 Convention Center",
    description: "Annual tech conference showcasing local innovations.",
    tags: ["tech", "conference", "networking"]
  },
  {
    name: "Riverside Bookstore",
    type: "Shop",
    address: "22B Elm Street",
    description: "Independent bookstore with a wide selection of fiction and non-fiction.",
    tags: ["books", "reading", "local", "shop"]
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