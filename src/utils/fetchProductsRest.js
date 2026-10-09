// Universal fail-proof REST fetcher for MOJ Jewels products, config, coupons, and orders
// Works on all mobile devices, WebViews, iOS Safari, Android, and restrictive mobile networks
// where WebSocket or Firestore Web SDK connections might be blocked or throttled.

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/moj-jewels-58b8c/databases/(default)/documents';

export async function fetchProductsViaRest(onBatch) {
  const demoIds = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6'];
  const products = [];
  let pageToken = '';

  try {
    do {
      const url = `${FIRESTORE_BASE}/products?pageSize=100${
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
              p[k] = (v.arrayValue.values || []).map(val =>
                val.stringValue !== undefined
                  ? val.stringValue
                  : val.integerValue !== undefined
                  ? Number(val.integerValue)
                  : val
              );
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

export async function fetchConfigViaRest() {
  try {
    const res = await fetch(`${FIRESTORE_BASE}/config/main`);
    if (!res.ok) return null;
    const data = await res.json();
    const fields = data.fields || {};
    const config = {};

    if (fields.categories?.arrayValue?.values) {
      config.categories = fields.categories.arrayValue.values
        .map(v => v.stringValue)
        .filter(Boolean);
    }
    if (fields.subCategories?.mapValue?.fields) {
      const subMap = {};
      for (const [k, v] of Object.entries(fields.subCategories.mapValue.fields)) {
        if (v.arrayValue?.values) {
          subMap[k] = v.arrayValue.values.map(val => val.stringValue).filter(Boolean);
        }
      }
      config.subCategories = subMap;
    }
    if (fields.banners?.arrayValue?.values) {
      config.banners = fields.banners.arrayValue.values.map(b => {
        const bf = b.mapValue?.fields || {};
        const bannerObj = {};
        for (const [k, v] of Object.entries(bf)) {
          bannerObj[k] = v.stringValue !== undefined ? v.stringValue : v.integerValue;
        }
        return bannerObj;
      });
    }
    if (fields.payment?.mapValue?.fields) {
      const pf = fields.payment.mapValue.fields;
      const paymentObj = {};
      for (const [k, v] of Object.entries(pf)) {
        paymentObj[k] = v.stringValue !== undefined ? v.stringValue : v.integerValue;
      }
      config.payment = paymentObj;
    }
    return config;
  } catch (e) {
    console.warn('REST config fetch error:', e);
    return null;
  }
}

export async function fetchCouponsViaRest() {
  try {
    const res = await fetch(`${FIRESTORE_BASE}/coupons`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];
    return data.documents.map(doc => {
      const id = doc.name.split('/').pop();
      const f = doc.fields || {};
      const c = { id, code: f.code?.stringValue || id };
      for (const [k, v] of Object.entries(f)) {
        if (v.stringValue !== undefined) c[k] = v.stringValue;
        else if (v.integerValue !== undefined) c[k] = Number(v.integerValue);
        else if (v.doubleValue !== undefined) c[k] = Number(v.doubleValue);
        else if (v.booleanValue !== undefined) c[k] = v.booleanValue;
      }
      c.minAmount = Number(c.minAmount || 0);
      c.value = Number(c.value || 0);
      c.active = c.active !== false;
      return c;
    });
  } catch (e) {
    console.warn('REST coupons fetch error:', e);
    return [];
  }
}

export async function fetchOrdersViaRest() {
  try {
    const res = await fetch(`${FIRESTORE_BASE}/orders?pageSize=100`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) return [];
    const orders = data.documents.map(doc => {
      const id = doc.name.split('/').pop();
      const f = doc.fields || {};
      const o = { id };
      for (const [k, v] of Object.entries(f)) {
        if (v.stringValue !== undefined) o[k] = v.stringValue;
        else if (v.integerValue !== undefined) o[k] = Number(v.integerValue);
        else if (v.doubleValue !== undefined) o[k] = Number(v.doubleValue);
        else if (v.booleanValue !== undefined) o[k] = v.booleanValue;
        else if (v.arrayValue !== undefined) {
          o[k] = (v.arrayValue.values || []).map(val => {
            if (val.mapValue?.fields) {
              const mf = val.mapValue.fields;
              const itemObj = {};
              for (const [ik, iv] of Object.entries(mf)) {
                if (iv.stringValue !== undefined) itemObj[ik] = iv.stringValue;
                else if (iv.integerValue !== undefined) itemObj[ik] = Number(iv.integerValue);
                else if (iv.doubleValue !== undefined) itemObj[ik] = Number(iv.doubleValue);
                else if (iv.booleanValue !== undefined) itemObj[ik] = iv.booleanValue;
              }
              return itemObj;
            }
            return val.stringValue !== undefined ? val.stringValue : val;
          });
        }
      }
      return o;
    });
    return orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  } catch (e) {
    console.warn('REST orders fetch error:', e);
    return [];
  }
}

export async function deleteOrderViaRest(orderId) {
  try {
    const res = await fetch(`${FIRESTORE_BASE}/orders/${encodeURIComponent(orderId)}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    console.warn('REST delete order error:', e);
    return false;
  }
}
