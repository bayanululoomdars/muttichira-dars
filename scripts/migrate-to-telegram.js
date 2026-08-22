require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');

// Import models
const GalleryItem = require('../models/GalleryItem');
const News = require('../models/News');
const Slider = require('../models/Slider');
const Story = require('../models/Story');
const HomeSettings = require('../models/HomeSettings');
const Admission = require('../models/Admission');
const Usthad = require('../models/Usthad');
const Student = require('../models/Student');
const Settings = require('../models/Settings');

const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

if (!token || !chatId) {
  console.error('❌ Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env');
  process.exit(1);
}

function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'mp4': 'video/mp4',
    'webm': 'video/webm'
  };
  return map[ext] || 'application/octet-stream';
}

async function uploadBufferToTelegram(buffer, filename, mimetype) {
  let method = 'sendDocument';
  let field = 'document';
  
  if (mimetype.startsWith('image/')) {
    method = 'sendPhoto';
    field = 'photo';
  } else if (mimetype.startsWith('video/')) {
    method = 'sendVideo';
    field = 'video';
  }

  const formData = new FormData();
  formData.append('chat_id', chatId);
  const blob = new Blob([buffer], { type: mimetype });
  formData.append(field, blob, filename);

  const url = `https://api.telegram.org/bot${token}/${method}`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Telegram upload failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API Error: ${data.description}`);
  }

  let fileId = '';
  if (method === 'sendPhoto') {
    const photos = data.result.photo;
    fileId = photos[photos.length - 1].file_id;
  } else if (method === 'sendVideo') {
    fileId = data.result.video.file_id;
  } else {
    fileId = data.result.document.file_id;
  }

  return fileId;
}

async function processUrlOrPath(mediaSource) {
  if (!mediaSource) return null;

  // If already migrated, skip
  if (mediaSource.startsWith('/api/media/tg/')) {
    console.log(`  Skipping: Already migrated (${mediaSource})`);
    return null;
  }

  let fileBuffer = null;
  let filename = 'file';
  let mimetype = 'application/octet-stream';

  try {
    if (mediaSource.startsWith('http://') || mediaSource.startsWith('https://')) {
      // It's a remote URL (Cloudinary or other)
      console.log(`  Downloading remote: ${mediaSource}`);
      const res = await fetch(mediaSource);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      
      const arrayBuffer = await res.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      mimetype = res.headers.get('content-type') || 'application/octet-stream';
      filename = mediaSource.split('/').pop().split('?')[0] || 'remote-file';
      if (!filename.includes('.')) {
        filename += mimetype.includes('/') ? '.' + mimetype.split('/')[1] : '';
      }
    } else {
      // It's a local file path
      // Resolve path relative to public dir
      const cleanPath = mediaSource.startsWith('/') ? mediaSource.substring(1) : mediaSource;
      const absolutePath = path.join(__dirname, '../public', cleanPath);
      
      if (fs.existsSync(absolutePath)) {
        console.log(`  Reading local: ${absolutePath}`);
        fileBuffer = fs.readFileSync(absolutePath);
        filename = path.basename(absolutePath);
        mimetype = getMimeType(filename);
      } else {
        console.log(`  ⚠️ File not found locally or remote: ${mediaSource}`);
        return null;
      }
    }

    if (fileBuffer) {
      console.log(`  Uploading to Telegram (${filename}, ${mimetype})...`);
      const fileId = await uploadBufferToTelegram(fileBuffer, filename, mimetype);
      const newUrl = `/api/media/tg/${fileId}`;
      console.log(`  ✅ Success: ${mediaSource} -> ${newUrl}`);
      return { fileId, newUrl };
    }
  } catch (err) {
    console.error(`  ❌ Error migrating ${mediaSource}:`, err.message);
  }

  return null;
}

async function runMigration() {
  console.log('🏁 Starting Cloud-to-Telegram Media Migration...');
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Failed to connect to MongoDB');
    process.exit(1);
  }

  // 1. Migrate GalleryItem
  console.log('\n--- GalleryItem Collection ---');
  const galleryItems = await GalleryItem.find({});
  console.log(`Found ${galleryItems.length} items`);
  for (const item of galleryItems) {
    const result = await processUrlOrPath(item.imageUrl);
    if (result) {
      item.imageUrl = result.newUrl;
      item.telegramFileId = result.fileId;
      await item.save();
    }
  }

  // 2. Migrate News
  console.log('\n--- News Collection ---');
  const newsItems = await News.find({});
  console.log(`Found ${newsItems.length} items`);
  for (const item of newsItems) {
    const result = await processUrlOrPath(item.imageUrl);
    if (result) {
      item.imageUrl = result.newUrl;
      item.telegramFileId = result.fileId;
      await item.save();
    }
  }

  // 3. Migrate Slider
  console.log('\n--- Slider Collection ---');
  const sliderItems = await Slider.find({});
  console.log(`Found ${sliderItems.length} items`);
  for (const item of sliderItems) {
    const result = await processUrlOrPath(item.mediaUrl);
    if (result) {
      item.mediaUrl = result.newUrl;
      item.telegramFileId = result.fileId;
      await item.save();
    }
  }

  // 4. Migrate Story
  console.log('\n--- Story Collection ---');
  const storyItems = await Story.find({});
  console.log(`Found ${storyItems.length} items`);
  for (const item of storyItems) {
    const result = await processUrlOrPath(item.imageUrl);
    if (result) {
      item.imageUrl = result.newUrl;
      item.telegramFileId = result.fileId;
      await item.save();
    }
  }

  // 5. Migrate HomeSettings
  console.log('\n--- HomeSettings Collection ---');
  const homeSettingsList = await HomeSettings.find({});
  console.log(`Found ${homeSettingsList.length} settings`);
  for (const setting of homeSettingsList) {
    let modified = false;
    
    // Principal Image
    if (setting.principalImageUrl) {
      const result = await processUrlOrPath(setting.principalImageUrl);
      if (result) {
        setting.principalImageUrl = result.newUrl;
        modified = true;
      }
    }

    // Assistant Mudarris list
    if (setting.assistantMudarris && setting.assistantMudarris.length > 0) {
      for (const assistant of setting.assistantMudarris) {
        if (assistant.imageUrl) {
          const result = await processUrlOrPath(assistant.imageUrl);
          if (result) {
            assistant.imageUrl = result.newUrl;
            assistant.telegramFileId = result.fileId;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      await setting.save();
    }
  }

  // 6. Migrate Admission
  console.log('\n--- Admission Collection ---');
  const admissions = await Admission.find({});
  console.log(`Found ${admissions.length} admissions`);
  for (const item of admissions) {
    const result = await processUrlOrPath(item.imageUrl);
    if (result) {
      item.imageUrl = result.newUrl;
      await item.save();
    }
  }

  // 7. Migrate Usthad
  console.log('\n--- Usthad Collection ---');
  const usthads = await Usthad.find({});
  console.log(`Found ${usthads.length} usthads`);
  for (const item of usthads) {
    const result = await processUrlOrPath(item.photoUrl);
    if (result) {
      item.photoUrl = result.newUrl;
      await item.save();
    }
  }

  // 8. Migrate Student
  console.log('\n--- Student Collection ---');
  const students = await Student.find({});
  console.log(`Found ${students.length} students`);
  for (const item of students) {
    const result = await processUrlOrPath(item.photoUrl);
    if (result) {
      item.photoUrl = result.newUrl;
      await item.save();
    }
  }

  // 9. Migrate Settings
  console.log('\n--- Settings Collection ---');
  const mediaSettingsKeys = ['admissionPosterUrl', 'whyUsMediaUrl', 'committeePosterUrl', 'burdaTeamImageUrl'];
  const settingsItems = await Settings.find({ key: { $in: mediaSettingsKeys } });
  console.log(`Found ${settingsItems.length} settings items`);
  for (const item of settingsItems) {
    if (item.value) {
      const result = await processUrlOrPath(item.value);
      if (result) {
        item.value = result.newUrl;
        await item.save();
      }
    }
  }

  console.log('\n🎉 Migration process completed!');
  mongoose.connection.close();
}

runMigration();
