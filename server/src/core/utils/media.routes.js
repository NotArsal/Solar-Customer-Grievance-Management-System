import express from 'express';
import axios from 'axios';

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
    
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream'
    });

    response.data.pipe(res);
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

    const formData = new URLSearchParams();
    formData.append('image', image.replace(/^data:image\/[a-z]+;base64,/, ''));
    
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.VITE_IMGBB_API_KEY || '1c0de0ad3650cd6da14dfb02d511cbcd'}`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('ImgBB upload error:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

export default router;
