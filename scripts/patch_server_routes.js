const fs = require('node:fs');
const path = require('node:path');

const serverJsPath = path.join(__dirname, '..', 'server', 'server.js');
let content = fs.readFileSync(serverJsPath, 'utf8');

// 1. Add static uploads if not already present
if (!content.includes("app.use('/uploads'")) {
  content = content.replace(
    "app.use(express.static(path.join(__dirname, '..', 'public')));",
    "app.use(express.static(path.join(__dirname, '..', 'public')));\napp.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));"
  );
  console.log('Added static uploads route.');
}

// 2. Add Employee Documents and Photo routes
const marker = '/* =========================================================================\n   5. ATTENDANCE & BIOMETRIC ROUTES';
const markerCRLF = '/* =========================================================================\r\n   5. ATTENDANCE & BIOMETRIC ROUTES';

const newRoutes = `
// -------------------------------------------------------------
// Employee Photo & Official Documents Management
// -------------------------------------------------------------
const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, '..', 'uploads', 'employee_docs');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_\\-\\u0600-\\u06FF]/g, '_');
    cb(null, \`emp-\${req.params.id || 'doc'}-\${Date.now()}-\${safeBase}\${ext}\`);
  }
});
const uploadDoc = multer({ storage: docStorage });

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destDir = path.join(__dirname, '..', 'uploads', 'photos');
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    cb(null, destDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, \`avatar-emp-\${req.params.id}-\${Date.now()}\${ext}\`);
  }
});
const uploadPhoto = multer({ storage: photoStorage });

// Upload Employee Photo
app.post('/api/employees/:id/photo', uploadPhoto.single('photo'), (req, res) => {
  try {
    const empId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم إرسال ملف الصورة' });
    }
    const photoUrl = \`/uploads/photos/\${req.file.filename}\`;
    run('UPDATE employees SET photo_url = ? WHERE id = ?', [photoUrl, empId]);
    res.json({ success: true, message: 'تم تحديث الصورة الشخصية بنجاح', photo_url: photoUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload Employee Official Document
app.post('/api/employees/:id/documents', uploadDoc.single('file'), (req, res) => {
  try {
    const empId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم إرسال الملف' });
    }
    const { doc_type = 'مستند رسمي', title } = req.body;
    const docTitle = title || req.file.originalname;
    const filePath = \`/uploads/employee_docs/\${req.file.filename}\`;
    const fileSize = req.file.size;
    const mimeType = req.file.mimetype;
    const user = extractUserContext(req);
    const uploadedBy = user ? user.id : null;

    const result = run(\`
      INSERT INTO employee_documents (
        emp_id, doc_type, title, file_path, file_name, file_size, mime_type, uploaded_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    \`, [empId, doc_type, docTitle, filePath, req.file.originalname, fileSize, mimeType, uploadedBy]);

    res.status(201).json({
      success: true,
      message: 'تم رفع المستند وحفظه بنجاح',
      data: {
        id: result.lastInsertRowid,
        emp_id: empId,
        doc_type,
        title: docTitle,
        file_path: filePath,
        file_name: req.file.originalname,
        file_size: fileSize,
        mime_type: mimeType
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get Employee Documents
app.get('/api/employees/:id/documents', (req, res) => {
  try {
    const empId = req.params.id;
    const docs = query('SELECT * FROM employee_documents WHERE emp_id = ? ORDER BY id DESC', [empId]);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete Employee Document
app.delete('/api/employees/:id/documents/:docId', (req, res) => {
  try {
    const { id: empId, docId } = req.params;
    const doc = get('SELECT * FROM employee_documents WHERE id = ? AND emp_id = ?', [docId, empId]);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'المستند غير موجود' });
    }
    run('DELETE FROM employee_documents WHERE id = ?', [docId]);
    try {
      const fullPath = path.join(__dirname, '..', doc.file_path);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (e) {}

    res.json({ success: true, message: 'تم حذف المستند بنجاح' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

`;

if (!content.includes('/api/employees/:id/photo')) {
  if (content.includes(markerCRLF)) {
    content = content.replace(markerCRLF, newRoutes + '\r\n' + markerCRLF);
    console.log('Added routes before marker (CRLF).');
  } else if (content.includes(marker)) {
    content = content.replace(marker, newRoutes + '\n' + marker);
    console.log('Added routes before marker (LF).');
  } else {
    console.error('Marker not found!');
  }
}

fs.writeFileSync(serverJsPath, content, 'utf8');
console.log('server.js updated successfully.');
