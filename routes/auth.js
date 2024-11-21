const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const prisma = require('../prisma');
const express = require('express');
const router = express.Router();

router.use(express.json());

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1d' });
};

router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.register(username, password);
    const token = createToken(user.id);
    res.status(201).json({ token });
  } catch (e) {
    if (e.code === 'P2002') {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      next(e);
    }
  }
});

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.login(username, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).send('You must be logged in');

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(403).send('Forbidden');
  }
}

module.exports = {
  router,
  authenticate,
};

