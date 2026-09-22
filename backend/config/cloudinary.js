const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a local file buffer/path to Cloudinary and returns { url, publicId }
async function uploadImage(filePath, folder = 'ecopocket') {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Zero-config fallback: keep the file on this server and serve it from /uploads.
    // Works until you add CLOUDINARY_* vars to backend/.env.
    const fs = require('fs');
    const path = require('path');
    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });
    const fileName = path.basename(filePath);
    fs.renameSync(filePath, path.join(uploadsDir, fileName));
    return { url: `/uploads/${fileName}`, publicId: null };
  }
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return { url: result.secure_url, publicId: result.public_id };
}

async function deleteImage(publicId, url) {
  if (url && String(url).startsWith('/uploads/') && !process.env.CLOUDINARY_CLOUD_NAME) {
    // Local fallback cleanup — remove the file from this server's disk.
    try {
      const fs = require('fs');
      const path = require('path');
      fs.unlinkSync(path.join(__dirname, '..', 'public', String(url)));
    } catch (e) {
      // Ignore missing files.
    }
    return;
  }
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

module.exports = { cloudinary, uploadImage, deleteImage };
