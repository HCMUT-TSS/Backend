// controllers/availabilityController.js
const getAvailableSlots = (req, res) => {
  // Lọc các slot chưa bị đặt
  const available = mockSlots.filter(s => !s.isBooked);
  res.json(available);
};