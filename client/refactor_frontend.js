import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  'src/components/common',
  'src/components/layout',
  'src/features/auth/pages',
  'src/features/admin/pages',
  'src/features/employee/pages',
  'src/features/customer/pages',
  'src/hooks',
  'src/utils'
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(__dirname, d), { recursive: true });
});

const moves = [
  { from: 'src/pages/Login.jsx', to: 'src/features/auth/pages/Login.jsx' },
  { from: 'src/pages/AdminDashboard.jsx', to: 'src/features/admin/pages/AdminDashboard.jsx' },
  { from: 'src/pages/EmployeeDashboard.jsx', to: 'src/features/employee/pages/EmployeeDashboard.jsx' },
  { from: 'src/pages/CustomerPortal.jsx', to: 'src/features/customer/pages/CustomerPortal.jsx' },
  { from: 'src/pages/TrackTicket.jsx', to: 'src/features/customer/pages/TrackTicket.jsx' }
];

moves.forEach(m => {
  try {
    fs.renameSync(path.join(__dirname, m.from), path.join(__dirname, m.to));
  } catch (e) {
    console.log(`Failed to move ${m.from}: ${e.message}`);
  }
});

// Update imports
function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    replacements.forEach(r => {
      content = content.replace(new RegExp(r.search, 'g'), r.replace);
    });
    fs.writeFileSync(filePath, content);
  } catch (e) {
    console.log(`Failed to update ${filePath}: ${e.message}`);
  }
}

// App.jsx
replaceInFile(path.join(__dirname, 'src/App.jsx'), [
  { search: './pages/CustomerPortal', replace: './features/customer/pages/CustomerPortal' },
  { search: './pages/TrackTicket', replace: './features/customer/pages/TrackTicket' },
  { search: './pages/EmployeeDashboard', replace: './features/employee/pages/EmployeeDashboard' },
  { search: './pages/AdminDashboard', replace: './features/admin/pages/AdminDashboard' },
  { search: './pages/Login', replace: './features/auth/pages/Login' }
]);

// Each page imports axios from config/axios
// e.g., import axiosInstance from '../config/axios';
// Now it should be import axiosInstance from '../../../config/axios';

const pages = [
  'src/features/auth/pages/Login.jsx',
  'src/features/admin/pages/AdminDashboard.jsx',
  'src/features/employee/pages/EmployeeDashboard.jsx',
  'src/features/customer/pages/CustomerPortal.jsx',
  'src/features/customer/pages/TrackTicket.jsx'
];

pages.forEach(p => {
  replaceInFile(path.join(__dirname, p), [
    { search: "'../config/axios'", replace: "'../../../config/axios'" }
  ]);
});

console.log('Frontend refactoring done!');
