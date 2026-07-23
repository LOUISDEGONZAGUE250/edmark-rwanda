const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} folder - Cloudinary folder name
 * @param {string} filename - Original filename
 * @returns {Promise<object>} Cloudinary upload result
 */
async function uploadToCloudinary(fileBuffer, folder = 'edmark-rwanda', filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename ? filename.replace(/\.[^/.]+$/, '') : undefined,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary by public_id
 * @param {string} publicId - The public_id of the asset
 * @returns {Promise<object>} Cloudinary deletion result
 */
async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

/**
 * Generate an optimized image URL
 * @param {string} publicId - The public_id of the asset
 * @param {object} options - Transformation options
 * @returns {string} Optimized image URL
 */
function getOptimizedUrl(publicId, options = {}) {
  return cloudinary.url(publicId, {
    transformation: [
      {
        width: options.width || 800,
        height: options.height || 800,
        crop: options.crop || 'limit',
        quality: options.quality || 'auto',
        format: 'auto',
      },
    ],
  });
}

module.exports = { uploadToCloudinary, deleteFromCloudinary, getOptimizedUrl, cloudinary };
