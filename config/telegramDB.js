const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Disable TLS check for Telegram API in custom networks
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const token = (process.env.TELEGRAM_BOT_TOKEN || '').trim();
const chatId = (process.env.TELEGRAM_CHAT_ID || '').trim();

let dbState = {
  Admission: [],
  Contact: [],
  GalleryItem: [],
  HomeSettings: [],
  News: [],
  PortalMessage: [],
  SectionContent: [],
  Settings: [],
  Slider: [],
  Story: [],
  Student: [],
  Subscriber: [],
  User: [],
  Usthad: []
};

// We will fetch from Telegram on startup
let isInitialized = false;

// Helpers to sync to/from Telegram
async function uploadDbToTelegram() {
  if (!token || !chatId) return;
  try {
    const buf = Buffer.from(JSON.stringify(dbState, null, 2));
    const formData = new FormData();
    formData.append('chat_id', chatId);
    const blob = new Blob([buf], { type: 'application/json' });
    formData.append('document', blob, 'db.json');

    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (data.ok) {
      const msgId = data.result.message_id;
      await fetch(`https://api.telegram.org/bot${token}/pinChatMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, message_id: msgId })
      });
      console.log('✅ DB State backed up to Telegram (Pinned Msg ID:', msgId, ')');
    }
  } catch (err) {
    console.error('Failed to backup DB to Telegram:', err.message);
  }
}

// Debounced save
let saveTimeout = null;
function scheduleSave() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    uploadDbToTelegram();
  }, 5000); // Wait 5 seconds after last write before uploading
}

async function loadDbFromTelegram() {
  if (!token || !chatId) {
    console.warn('⚠️ Telegram bot credentials not found. Using empty DB.');
    return;
  }
  try {
    console.log('Fetching latest DB from Telegram...');
    const chatRes = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
    const chatData = await chatRes.json();
    
    const pinnedMsg = chatData.result?.pinned_message;
    if (pinnedMsg && pinnedMsg.document) {
      const fileId = pinnedMsg.document.file_id;
      const fileRes = await fetch(`https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`);
      const fileData = await fileRes.json();
      if (fileData.ok) {
        const filePath = fileData.result.file_path;
        const dlRes = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`);
        const dbJson = await dlRes.json();
        dbState = { ...dbState, ...dbJson };
        console.log('✅ DB State loaded from Telegram.');
      }
    } else {
      console.log('No pinned DB found in Telegram. Starting fresh.');
      // Initialize with default HomeSettings if missing
      dbState.HomeSettings.push({
        _id: 'default_home',
        principalName: 'Sheikhuna Ibrahim Baqavi Al Haithami',
        statsStudents: 87,
        statsUstads: 6,
        statsYears: 50,
        statsAlumni: 25
      });
      scheduleSave();
    }
  } catch (err) {
    console.error('Failed to load DB from Telegram:', err.message);
  }
}

// Mock Mongoose Query Object
class MockQuery {
  constructor(data) {
    this.data = data;
  }
  sort(sortObj) {
    if (!this.data || !Array.isArray(this.data)) return this;
    const key = Object.keys(sortObj)[0];
    const dir = sortObj[key] === -1 || sortObj[key] === 'desc' ? -1 : 1;
    this.data.sort((a, b) => {
      let valA = a[key];
      let valB = b[key];
      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });
    return this;
  }
  populate(field) {
    // Basic mock for populate
    return this; 
  }
  async then(resolve, reject) {
    try {
      resolve(this.data);
    } catch(e) {
      reject(e);
    }
  }
}

// Mongoose Mock Model Factory
function createMockModel(modelName) {
  return class MockModel {
    constructor(data) {
      Object.assign(this, data);
      if (!this._id) this._id = crypto.randomBytes(12).toString('hex');
      if (!this.createdAt) this.createdAt = new Date();
    }

    async save() {
      const collection = dbState[modelName];
      const index = collection.findIndex(item => item._id === this._id);
      if (index !== -1) {
        collection[index] = { ...this };
      } else {
        collection.push({ ...this });
      }
      scheduleSave();
      return this;
    }

    static find(query = {}) {
      let result = dbState[modelName].filter(item => {
        for (let key in query) {
          if (key === '$or') {
            const orQuery = query[key];
            const match = orQuery.some(q => {
              const k = Object.keys(q)[0];
              return item[k] === q[k];
            });
            if (!match) return false;
            continue;
          }
          if (key === '$in') continue; // Skip complex $in filters for mock
          if (typeof query[key] === 'object' && query[key] !== null) {
            if (query[key].$gt) {
              if (!(new Date(item[key]) > new Date(query[key].$gt))) return false;
            }
          }
          else if (item[key] !== query[key]) return false;
        }
        return true;
      });
      // Deep copy to prevent reference mutation
      result = JSON.parse(JSON.stringify(result));
      result.forEach(doc => {
        doc.save = async function() {
          const idx = dbState[modelName].findIndex(x => x._id === this._id);
          if (idx !== -1) dbState[modelName][idx] = { ...this };
          scheduleSave();
          return this;
        };
      });
      return new MockQuery(result);
    }

    static findOne(query = {}) {
      const result = this.find(query).data;
      if (result && result.length > 0) return new MockQuery(result[0]);
      return new MockQuery(null);
    }

    static findById(id) {
      const item = dbState[modelName].find(x => x._id === id);
      if (item) {
        const copy = JSON.parse(JSON.stringify(item));
        copy.save = async function() {
          const idx = dbState[modelName].findIndex(x => x._id === this._id);
          if (idx !== -1) dbState[modelName][idx] = { ...this };
          scheduleSave();
          return this;
        };
        return new MockQuery(copy);
      }
      return new MockQuery(null);
    }

    static async findByIdAndDelete(id) {
      const index = dbState[modelName].findIndex(x => x._id === id);
      if (index !== -1) {
        const doc = dbState[modelName].splice(index, 1)[0];
        scheduleSave();
        return doc;
      }
      return null;
    }

    static async findOneAndUpdate(query, update, options = {}) {
      let doc = this.findOne(query).data;
      if (doc) {
        const index = dbState[modelName].findIndex(x => x._id === doc._id);
        if (index !== -1) {
          dbState[modelName][index] = { ...dbState[modelName][index], ...update };
          scheduleSave();
          return dbState[modelName][index];
        }
      } else if (options.upsert) {
        const newDoc = new this({ ...query, ...update });
        await newDoc.save();
        return newDoc;
      }
      return null;
    }

    static async countDocuments(query = {}) {
      return this.find(query).data.length;
    }
  };
}

module.exports = {
  loadDbFromTelegram,
  Admission: createMockModel('Admission'),
  Contact: createMockModel('Contact'),
  GalleryItem: createMockModel('GalleryItem'),
  HomeSettings: createMockModel('HomeSettings'),
  News: createMockModel('News'),
  PortalMessage: createMockModel('PortalMessage'),
  SectionContent: createMockModel('SectionContent'),
  Settings: createMockModel('Settings'),
  Slider: createMockModel('Slider'),
  Story: createMockModel('Story'),
  Student: createMockModel('Student'),
  Subscriber: createMockModel('Subscriber'),
  User: createMockModel('User'),
  Usthad: createMockModel('Usthad')
};
