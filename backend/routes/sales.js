const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new sale
router.post('/', async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Check stock and deduct
    for (let item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine) {
        return res.status(404).json({ message: `Medicine not found: ${item.name}` });
      }
      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}` });
      }
      medicine.stockQuantity -= item.quantity;
      await medicine.save();
    }

    const sale = new Sale({
      items,
      totalAmount
    });
    
    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
