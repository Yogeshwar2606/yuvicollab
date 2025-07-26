const Address = require('../models/Address');

// Get all addresses for user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new address
exports.addAddress = async (req, res) => {
  try {
    const { fullName, phone, street, city, state, zip, country, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const address = await Address.create({
      user: req.user.id,
      fullName,
      phone,
      street,
      city,
      state,
      zip,
      country,
      isDefault: !!isDefault,
    });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, street, city, state, zip, country, isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { fullName, phone, street, city, state, zip, country, isDefault: !!isDefault },
      { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findOneAndDelete({ _id: id, user: req.user.id });
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await Address.updateMany({ user: req.user.id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { isDefault: true },
      { new: true }
    );
    if (!address) return res.status(404).json({ message: 'Address not found' });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 