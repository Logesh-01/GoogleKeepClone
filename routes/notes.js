const express = require('express');
const Note = require('..\models\Note.js');
const jwt = require('jsonwebtoken');

const router = express.Router();
const secret = 'your_jwt_secret';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send({ message: 'No token provided' });
  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'Failed to authenticate token' });
    req.userId = decoded.userId;
    next();
  });
};

router.post('/', authMiddleware, async (req, res) => {
  const { content, labels, color } = req.body;
  try {
    const note = new Note({
      content, labels, color, user: req.userId
    });
    await note.save();
    res.status(201).send(note);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId, trashed: false }).sort('-createdAt');
    res.send(notes);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
