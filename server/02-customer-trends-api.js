import express from 'express';
import cors from 'cors';
import config from './config.json' assert { type: "json" };

const app = express();
const port = process.env.PORT || config.customerTrendsApiPort;

app.use(cors());

app.get('/trends', (req, res) => {
  const trends = [
    { id: '001', productSkus: ['BEA-009', 'SCF-008'] },
    { id: '002', productSkus: ['BEA-009', 'SCF-008', 'GLV-010'] },
    { id: '003', productSkus: ['BEA-009', 'GLV-010'] },
    { id: '004', productSkus: ['TSH-001', 'JNS-002'] },
    { id: '005', productSkus: ['SUN-005', 'SCK-006', 'BLT-007'] },
    { id: '006', productSkus: ['JCK-012', 'SWT-013', 'HOD-014'] },
    { id: '007', productSkus: ['JNS-002', 'BLT-007'] },
    { id: '008', productSkus: ['SHT-015', 'RAI-016'] },
    { id: '009', productSkus: ['TIE-011', 'JCK-012'] },
    { id: '010', productSkus: ['SNK-003', 'CAP-004'] },
    { id: '011', productSkus: ['SCK-006', 'SWT-013', 'HOD-014'] },
    { id: '012', productSkus: ['JNS-002', 'SHT-015', 'RAI-016'] },
    { id: '013', productSkus: ['TSH-001', 'SUN-005', 'BLT-007'] },
    { id: '014', productSkus: ['BEA-009', 'SCF-008', 'TIE-011'] },
    { id: '015', productSkus: ['SNK-003', 'SWT-013', 'HOD-014'] },
    { id: '016', productSkus: ['JCK-012', 'SHT-015', 'RAI-016'] },
    { id: '017', productSkus: ['TSH-001', 'SUN-005', 'SCK-006'] },
    { id: '018', productSkus: ['CAP-004', 'SHT-015', 'RAI-016'] },
    { id: '019', productSkus: ['BLT-007', 'TIE-011', 'JCK-012'] },
    { id: '020', productSkus: ['BEA-009', 'JNS-002', 'SWT-013'] },
    { id: '021', productSkus: ['TSH-001', 'BLT-007', 'SHT-015'] },
    { id: '022', productSkus: ['SNK-003', 'SUN-005', 'CAP-004'] },
    { id: '023', productSkus: ['GLV-010', 'JCK-012', 'SWT-013'] },
    { id: '024', productSkus: ['SUN-005', 'SCF-008', 'HOD-014'] },
    { id: '025', productSkus: ['TSH-001', 'SNK-003', 'SHT-015'] },
  ];

  res.json(trends);
});

app.listen(port, () => {
  console.log(`Inventory API is running @ http://localhost:${port}`);
});