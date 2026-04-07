const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client'); 

const prisma = new PrismaClient(); 
const app = express();

app.use(cors());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.get('/api/sneakers', async (req, res) => {
  try {
    const sneakers = await prisma.product.findMany();
    res.json(sneakers);
  }
  catch (err){
    console.error("Error fetching from DB:", err);
    res.status(500).json({ error: 'Failed to fetch sneakers from database' });
  }
});

app.get('/', (req, res) => {
  res.send('Shon On Backend Service is running locally!');
});

module.exports = app;