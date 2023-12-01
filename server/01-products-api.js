import express from 'express';
import cors from 'cors';
import config from './config.json' assert { type: "json" };

const app = express();
const port = process.env.PORT || config.productsApiPort;

app.use(cors());

app.get('/products', (req, res) => {
  const products = [
    { sku: 'TSH-001', name: 'White T-Shirt', price: 10.99 },
    { sku: 'JNS-002', name: 'Blue Jeans', price: 37.99 },
    { sku: 'SNK-003', name: 'Black Sneakers', price: 45.99 },
    { sku: 'CAP-004', name: 'Baseball Cap', price: 13.99 },
    { sku: 'SUN-005', name: 'Sunglasses', price: 19.99 },
    { sku: 'SCK-006', name: 'Socks', price: 5.99 },
    { sku: 'BLT-007', name: 'Belt', price: 15.99 },
    { sku: 'SCF-008', name: 'Patterned Scarf', price: 12.99 },
    { sku: 'BEA-009', name: 'Grey Beanie', price: 10.99 },
    { sku: 'GLV-010', name: 'Red Gloves', price: 8.99 },
    { sku: 'TIE-011', name: 'Formal Tie', price: 9.99 },
    { sku: 'JCK-012', name: 'Green Jacket', price: 59.99 },
    { sku: 'SWT-013', name: 'Navy Sweater', price: 39.99 },
    { sku: 'HOD-014', name: 'Purple Hoodie', price: 29.99 },
    { sku: 'SHT-015', name: 'Brown Shorts', price: 19.99 },
    { sku: 'RAI-016', name: 'Yellow Raincoat', price: 39.99 },
  ];

  res.json(products);
});

app.listen(port, () => {
  console.log(`Products API is running @ http://localhost:${port}`);
});