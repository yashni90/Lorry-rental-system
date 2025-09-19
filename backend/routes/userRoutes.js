const express = require('express');
const router = express.Router();
const { signup, signin, getAllUsers, getUser, updateUser, deleteUser } = require('../controller/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getUserById, updateUser: updateUserService, deleteUser: deleteUserService } = require('../service/userService'); // service only

// ---------- Public routes ----------
router.post('/signup', signup);
router.post('/signin', signin);

// ---------- Logged-in user routes ----------
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/profile', protect, async (req, res) => {
  try {
    const updatedUser = await updateUserService(req.user.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/profile', protect, async (req, res) => {
  try {
    await deleteUserService(req.user.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- Admin protected routes ----------
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUser);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
