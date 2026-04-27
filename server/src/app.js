const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/products', async (req, res) => {
  const where = {};
  if (req.query.category) where.category = req.query.category;
  if (req.query.style) where.style = req.query.style;
  if (req.query.featured === 'true') where.featured = true;
  if (req.query.sale === 'true') where.salePrice = { not: null };
  if (req.query.customizable === 'true') where.customizable = true;
  const products = await prisma.product.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json(products.map(p => ({ ...p, sizes: JSON.parse(p.sizes) })));
});

app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ ...product, sizes: JSON.parse(product.sizes) });
});

app.get('/api/features', async (req, res) => {
  const features = await prisma.feature.findMany({ orderBy: { number: 'asc' } });
  res.json(features);
});

app.get('/api/cart', async (req, res) => {
  const items = await prisma.cartItem.findMany({ include: { product: true } });
  res.json(items.map(i => ({ ...i, product: { ...i.product, sizes: JSON.parse(i.product.sizes) } })));
});

app.post('/api/cart', async (req, res) => {
  const { productId, size } = req.body;
  const existing = await prisma.cartItem.findFirst({ where: { productId, size } });
  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
      include: { product: true },
    });
    return res.json({ ...updated, product: { ...updated.product, sizes: JSON.parse(updated.product.sizes) } });
  }
  const item = await prisma.cartItem.create({
    data: { productId, size },
    include: { product: true },
  });
  res.json({ ...item, product: { ...item.product, sizes: JSON.parse(item.product.sizes) } });
});

app.delete('/api/cart/:id', async (req, res) => {
  await prisma.cartItem.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

app.get('/', (req, res) => {
  res.send('ShopOn Backend Service');
});

module.exports = app;