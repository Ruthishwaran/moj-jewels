// High-capacity local database cache using browser IndexedDB.
// Unlike localStorage (which has a strict 5MB limit), IndexedDB can hold
// hundreds of megabytes, allowing all 100+ jewelry products with images
// to load in 10-20ms instantly on page load or refresh.

const DB_NAME = 'moj_jewels_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'products_cache';

function openIDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function getIdbProducts() {
  try {
    const db = await openIDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = req.result;
        resolve(Array.isArray(list) ? list : []);
      };
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    return [];
  }
}

// Atomically replaces all products in IDB with the fresh server list
// This guarantees that any deleted products are completely removed from cache!
export async function replaceIdbProducts(products) {
  if (!Array.isArray(products) || products.length === 0) return;
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear(); // Clear old cached entries including deleted items
    for (const prod of products) {
      if (prod && prod.id) {
        store.put(prod);
      }
    }
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    // Non-fatal
  }
}

export async function saveIdbProducts(products) {
  if (!Array.isArray(products) || products.length === 0) return;
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const prod of products) {
      if (prod && prod.id) {
        store.put(prod);
      }
    }
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    // Non-fatal
  }
}

export async function deleteIdbProduct(id) {
  if (!id) return;
  try {
    const db = await openIDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    return new Promise((resolve) => {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    // Non-fatal
  }
}
