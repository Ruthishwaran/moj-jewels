// Universal fail-proof REST fetcher for MOJ Jewels products
// Works on all mobile devices, WebViews, iOS Safari, Android, and restrictive mobile networks
// where WebSocket or Firestore Web SDK connections might be blocked or throttled.

export async function fetchProductsViaRest(onBatch) {
  const demoIds = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'];
  const products = [];
  let pageToken = '';

  try {
    do {
      const url = `https://firestore.googleapis.com/v1/projects/moj-jewels-58b8c/databases/(default)/documents/products?pageSize=100${
        pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''
      }`;
      const res = await fetch(url);
      if (!res.ok) break;
      const data = await res.json();

      if (data.documents && Array.isArray(data.documents)) {
        for (const doc of data.documents) {
          const id = doc.name.split('/').pop();
          if (demoIds.includes(id)) continue;

          const f = doc.fields || {};
          const p = { id };

          for (const [k, v] of Object.entries(f)) {
            if (v.stringValue !== undefined) p[k] = v.stringValue;
            else if (v.integerValue !== undefined) p[k] = Number(v.integerValue);
            else if (v.doubleValue !== undefined) p[k] = Number(v.doubleValue);
            else if (v.booleanValue !== undefined) p[k] = v.booleanValue;
            else if (v.arrayValue !== undefined) {
              p[k] = (v.arrayValue.values || []).map(val => val.stringValue !== undefined ? val.stringValue : (val.integerValue !== undefined ? Number(val.integerValue) : val));
            }
          }
          products.push(p);
        }
        if (typeof onBatch === 'function') {
          onBatch([...products].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        }
      }
      pageToken = data.nextPageToken;
    } while (pageToken);

    return products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (err) {
    console.warn('REST product fetch warning:', err);
    return products;
  }
}
