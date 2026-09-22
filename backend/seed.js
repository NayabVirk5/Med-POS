require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');

const sampleMedicines = [
  {
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    batchNumber: "B-2023-01",
    expiryDate: new Date("2026-12-31"),
    price: 5.99,
    stockQuantity: 150,
    discountPercentage: 0
  },
  {
    name: "Amoxicillin 250mg",
    genericName: "Amoxicillin",
    batchNumber: "B-2023-05",
    expiryDate: new Date("2025-10-15"),
    price: 12.50,
    stockQuantity: 80,
    discountPercentage: 10
  },
  {
    name: "Ibuprofen 400mg",
    genericName: "Ibuprofen",
    batchNumber: "B-2024-02",
    expiryDate: new Date("2027-01-20"),
    price: 8.75,
    stockQuantity: 200,
    discountPercentage: 0
  },
  {
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    batchNumber: "B-2023-11",
    expiryDate: new Date("2025-08-10"),
    price: 15.00,
    stockQuantity: 60,
    discountPercentage: 15
  },
  {
    name: "Vitamin C 1000mg",
    genericName: "Ascorbic Acid",
    batchNumber: "B-2024-04",
    expiryDate: new Date("2027-05-30"),
    price: 10.00,
    stockQuantity: 300,
    discountPercentage: 25
  },
  {
    name: "Loratadine 10mg",
    genericName: "Loratadine",
    batchNumber: "B-2023-08",
    expiryDate: new Date("2025-11-20"),
    price: 9.50,
    stockQuantity: 120,
    discountPercentage: 0
  },
  {
    name: "Cough Syrup 200ml",
    genericName: "Dextromethorphan",
    batchNumber: "B-2023-12",
    expiryDate: new Date("2026-03-15"),
    price: 14.25,
    stockQuantity: 45,
    discountPercentage: 5
  },
  {
    name: "Aspirin 81mg",
    genericName: "Acetylsalicylic Acid",
    batchNumber: "B-2024-01",
    expiryDate: new Date("2026-10-05"),
    price: 6.50,
    stockQuantity: 500,
    discountPercentage: 0
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medical_store_pos')
  .then(async () => {
    console.log('Connected to DB for seeding...');
    
    // Clear existing data to avoid duplicates for now
    await Medicine.deleteMany({});
    console.log('Cleared existing medicines');

    // Insert sample data
    await Medicine.insertMany(sampleMedicines);
    console.log('Successfully seeded database with sample medicines');
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  });
