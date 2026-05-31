import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/telegram', async (req, res) => {
  try {
    const { file_path } = req.query;
    if (!file_path) {
      return res.status(400).json({ message: 'file_path is required' });
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

export default router;
