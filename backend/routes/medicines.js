const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');

// Get all medicines
router.get('/', async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create one medicine
router.post('/', async (req, res) => {
  const medicine = new Medicine({
    name: req.body.name,
    genericName: req.body.genericName,
    batchNumber: req.body.batchNumber,
    expiryDate: req.body.expiryDate,
    price: req.body.price,
    stockQuantity: req.body.stockQuantity,
    discountPercentage: req.body.discountPercentage || 0,
  });

  try {
    const newMedicine = await medicine.save();
    res.status(201).json(newMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update one medicine
router.put('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine == null) {
      return res.status(404).json({ message: 'Cannot find medicine' });
    }

    if (req.body.name != null) medicine.name = req.body.name;
    if (req.body.genericName != null) medicine.genericName = req.body.genericName;
    if (req.body.batchNumber != null) medicine.batchNumber = req.body.batchNumber;
    if (req.body.expiryDate != null) medicine.expiryDate = req.body.expiryDate;
    if (req.body.price != null) medicine.price = req.body.price;
    if (req.body.stockQuantity != null) medicine.stockQuantity = req.body.stockQuantity;
    if (req.body.discountPercentage != null) medicine.discountPercentage = req.body.discountPercentage;

    const updatedMedicine = await medicine.save();
    res.json(updatedMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one medicine
router.delete('/:id', async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (medicine == null) {
      return res.status(404).json({ message: 'Cannot find medicine' });
    }

    await medicine.deleteOne();
    res.json({ message: 'Deleted Medicine' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
