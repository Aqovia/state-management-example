import express from 'express';
import cors from 'cors';
import config from './config.json' assert { type: "json" };

const app = express();
const port = process.env.PORT || config.productsApiPort;

app.use(express.json());
app.use(cors());

const products = [
  { sku: 'TSH-001', name: 'White T-Shirt', price: 10.99, rating: 3 },
  { sku: 'JNS-002', name: 'Blue Jeans', price: 37.99, rating: 3 },
  { sku: 'SNK-003', name: 'Black Sneakers', price: 45.99, rating: 3 },
  { sku: 'CAP-004', name: 'Baseball Cap', price: 13.99, rating: 3 },
  { sku: 'SUN-005', name: 'Sunglasses', price: 19.99, rating: 3 },
  { sku: 'SCK-006', name: 'Socks', price: 5.99, rating: 3 },
  { sku: 'BLT-007', name: 'Belt', price: 15.99, rating: 3 },
  { sku: 'SCF-008', name: 'Patterned Scarf', price: 12.99, rating: 3 },
  { sku: 'BEA-009', name: 'Grey Beanie', price: 10.99, rating: 3 },
  { sku: 'GLV-010', name: 'Red Gloves', price: 8.99, rating: 3 },
  { sku: 'TIE-011', name: 'Formal Tie', price: 9.99, rating: 3 },
  { sku: 'JCK-012', name: 'Green Jacket', price: 59.99, rating: 3 },
  { sku: 'SWT-013', name: 'Navy Sweater', price: 39.99, rating: 3 },
  { sku: 'HOD-014', name: 'Purple Hoodie', price: 29.99, rating: 3 },
  { sku: 'SHT-015', name: 'Brown Shorts', price: 19.99, rating: 3 },
  { sku: 'RAI-016', name: 'Yellow Raincoat', price: 39.99, rating: 3 },
];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:sku', (req, res) => {
  const product = products.find(p => p.sku === req.params.sku);

  if (!product) return res.status(404).end();

  res.json(products);
});

app.patch('/products/:sku', (req, res) => {
  const product = products.find(p => p.sku === req.params.sku);

  if (!product) return res.status(404).end();

  if (req.body.rating) {
    if (!Number.isInteger(req.body.rating) || req.body.rating < 1 || req.body.rating > 5) {
      return res.status(400).json({
        type: 'http://shopping-app/invalid-rating',
        title: 'Invalid Rating',
        status: 400,
        detail: 'Rating must be an integer between 1 and 5',
      });
    }
    product.rating = req.body.rating;
  }

  return res.status(204).end();
});

app.listen(port, () => {
  console.log(`Products API is running @ http://localhost:${port}`);
});