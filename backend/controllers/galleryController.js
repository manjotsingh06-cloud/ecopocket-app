const Gallery = require('../models/Gallery');
const { uploadImage, deleteImage } = require('../config/cloudinary');

async function getGallery(req, res, next) {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Gallery.find(filter).sort('-createdAt');
    res.json({ success: true, items });
  } catch (err) {
    next(err);
  }
}

async function addGalleryItem(req, res, next) {
  try {
    // Accept a file upload OR a plain image URL (keeps the admin panel usable without Cloudinary).
    const uploaded = req.file
      ? await uploadImage(req.file.path, 'ecopocket/gallery')
      : (req.body.imageUrl ? { url: req.body.imageUrl, publicId: null } : req.body.image);
    const item = await Gallery.create({
      image: uploaded,
      category: req.body.category,
      caption: req.body.caption,
    });
    res.status(201).json({ success: true, item });
  } catch (err) {
    next(err);
  }
}

async function deleteGalleryItem(req, res, next) {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found.' });
    await deleteImage(item.image?.publicId, item.image?.url);
    await item.deleteOne();
    res.json({ success: true, message: 'Gallery item deleted.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getGallery, addGalleryItem, deleteGalleryItem };
