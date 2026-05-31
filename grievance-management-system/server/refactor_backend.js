import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirs = [
  'src/config',
  'src/core/middleware',
  'src/core/utils',
  'src/modules/auth',
  'src/modules/complaint',
  'src/modules/user',
  'src/services',
  'src/jobs'
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(__dirname, d), { recursive: true });
});

const moves = [
  { from: 'config/db.js', to: 'src/config/db.js' },
  { from: 'middleware/auth.middleware.js', to: 'src/core/middleware/auth.middleware.js' },
  { from: 'middleware/error.middleware.js', to: 'src/core/middleware/error.middleware.js' },
  { from: 'controllers/auth.controller.js', to: 'src/modules/auth/auth.controller.js' },
  { from: 'routes/auth.routes.js', to: 'src/modules/auth/auth.routes.js' },
  { from: 'controllers/complaint.controller.js', to: 'src/modules/complaint/complaint.controller.js' },
  { from: 'models/Complaint.js', to: 'src/modules/complaint/complaint.model.js' },
  { from: 'models/TicketHistory.js', to: 'src/modules/complaint/ticketHistory.model.js' },
  { from: 'routes/complaint.routes.js', to: 'src/modules/complaint/complaint.routes.js' },
  { from: 'models/User.js', to: 'src/modules/user/user.model.js' },
  { from: 'services/email.service.js', to: 'src/services/email.service.js' },
  { from: 'services/telegram.service.js', to: 'src/services/telegram.service.js' },
  { from: 'routes/telegram.routes.js', to: 'src/services/telegram.routes.js' }, // Or modules/telegram
  { from: 'routes/media.routes.js', to: 'src/core/utils/media.routes.js' },
  { from: 'jobs/sla.checker.js', to: 'src/jobs/sla.checker.js' },
  { from: 'app.js', to: 'src/app.js' },
  // src/server.js is already there
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

// server.js
replaceInFile(path.join(__dirname, 'src/server.js'), [
  { search: '../app.js', replace: './app.js' },
  { search: '../config/db.js', replace: './config/db.js' },
  { search: '../jobs/sla.checker.js', replace: './jobs/sla.checker.js' }
]);

// app.js
replaceInFile(path.join(__dirname, 'src/app.js'), [
  { search: './routes/auth.routes.js', replace: './modules/auth/auth.routes.js' },
  { search: './routes/complaint.routes.js', replace: './modules/complaint/complaint.routes.js' },
  { search: './routes/telegram.routes.js', replace: './services/telegram.routes.js' },
  { search: './routes/media.routes.js', replace: './core/utils/media.routes.js' },
  { search: './middleware/error.middleware.js', replace: './core/middleware/error.middleware.js' }
]);

// auth.controller.js
replaceInFile(path.join(__dirname, 'src/modules/auth/auth.controller.js'), [
  { search: '../models/User.js', replace: '../user/user.model.js' }
]);

// auth.routes.js
replaceInFile(path.join(__dirname, 'src/modules/auth/auth.routes.js'), [
  { search: '../controllers/auth.controller.js', replace: './auth.controller.js' }
]);

// complaint.controller.js
replaceInFile(path.join(__dirname, 'src/modules/complaint/complaint.controller.js'), [
  { search: '../models/Complaint.js', replace: './complaint.model.js' },
  { search: '../models/TicketHistory.js', replace: './ticketHistory.model.js' },
  { search: '../services/email.service.js', replace: '../../services/email.service.js' },
  { search: '../services/telegram.service.js', replace: '../../services/telegram.service.js' }
]);

// complaint.routes.js
replaceInFile(path.join(__dirname, 'src/modules/complaint/complaint.routes.js'), [
  { search: '../controllers/complaint.controller.js', replace: './complaint.controller.js' },
  { search: '../middleware/auth.middleware.js', replace: '../../core/middleware/auth.middleware.js' }
]);

// auth.middleware.js
replaceInFile(path.join(__dirname, 'src/core/middleware/auth.middleware.js'), [
  { search: '../models/User.js', replace: '../../modules/user/user.model.js' }
]);

// email.service.js - no internal imports to change
// telegram.service.js
replaceInFile(path.join(__dirname, 'src/services/telegram.service.js'), [
  { search: '../models/Complaint.js', replace: '../modules/complaint/complaint.model.js' },
  { search: '../models/TicketHistory.js', replace: '../modules/complaint/ticketHistory.model.js' }
]);

// telegram.routes.js
replaceInFile(path.join(__dirname, 'src/services/telegram.routes.js'), [
  { search: '../services/telegram.service.js', replace: './telegram.service.js' }
]);

// sla.checker.js
replaceInFile(path.join(__dirname, 'src/jobs/sla.checker.js'), [
  { search: '../models/Complaint.js', replace: '../modules/complaint/complaint.model.js' }
]);

console.log('Backend refactoring done!');
