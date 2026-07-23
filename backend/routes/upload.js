const express = require('express');
const router = express.Router();
const { uploadToCloudinary, deleteFromCloudinary } = require('../lib/cloudinary');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Note: This route expects multipart/form-data with a field named 'file'
// You'll need multer middleware on the frontend or use base64 encoding

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { file, folder } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Accept base64 encoded files
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const result = await uploadToCloudinary(buffer, folder || 'edmark-rwanda');
    
    res.json({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('Upload failed:', error.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.delete('/:publicId', authenticate, requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    const decoded = decodeURIComponent(publicId);
    await deleteFromCloudinary(decoded);
    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Delete failed:', error.message);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
