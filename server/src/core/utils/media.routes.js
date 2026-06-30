import express from 'express';

const router = express.Router();

router.get('/telegram', async (req, res) => {
  try {
    const { file_path } = req.query;
    if (!file_path) {
      return res.status(400).json({ message: 'file_path is required' });
    }

    // Sanitize file_path to prevent directory traversal
    if (file_path.includes('..') || file_path.startsWith('/')) {
      return res.status(403).json({ message: 'Invalid file path' });
    }

    const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${file_path}`;
    
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const { Readable } = await import('stream');
    Readable.fromWeb(response.body).pipe(res);
  } catch (err) {
    console.error('Error proxying media:', err.message);
    res.status(500).json({ message: 'Error fetching media' });
  }
});

router.post('/upload', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ message: 'Base64 image data is required' });
    }

    const formData = new FormData();
    const base64Data = image.includes(',') ? image.split(',')[1] : image;
    formData.append('image', base64Data);
    
    const apiKey = process.env.IMGBB_API_KEY || process.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error('IMGBB_API_KEY is not configured on the server');
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Upload failed');

    res.json(data);
  } catch (err) {
    console.error('ImgBB upload error:', err.stack || err.message);
    res.status(500).json({ message: 'Error uploading image', details: err.message });
  }
});

export default router;
