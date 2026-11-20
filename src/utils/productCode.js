import fallbackProducts from '../data/fallbackProducts.json';

const fallbackCodeMap = new Map((fallbackProducts || []).map(p => [String(p.id), p.productCode]));

export function formatMojCode(num) {
  const parsed = parseInt(num, 10);
  const clean = isNaN(parsed) ? 0 : Math.max(0, Math.min(9999, parsed));
  return `MOJ${String(clean).padStart(4, '0')}`;
}

export function isValidMojCode(code) {
  return typeof code === 'string' && /^MOJ\d{4}$/i.test(code.trim());
}

/**
 * Returns a guaranteed valid 7-character MOJ product code.
 * Falls back deterministically in exact catalog order starting from MOJ0000.
 */
export function getProductCode(product, fallbackIndex = null) {
  if (!product) return 'MOJ0000';

  if (isValidMojCode(product.productCode)) {
    return product.productCode.trim().toUpperCase();
  }

  if (isValidMojCode(product.modelCode)) {
    return product.modelCode.trim().toUpperCase();
  }

  // Look up mapped ID in catalog sequence (MOJ0000 - MOJ0102)
  const idStr = String(product.id || '');
  if (idStr && fallbackCodeMap.has(idStr)) {
    const code = fallbackCodeMap.get(idStr);
    if (isValidMojCode(code)) return code;
  }

  if (fallbackIndex !== null && typeof fallbackIndex === 'number' && fallbackIndex >= 0) {
    return formatMojCode(fallbackIndex);
  }

  return 'MOJ0000';
}

/**
 * Calculates the next sequential MOJ product code based on existing products list.
 * Starts from MOJ0000 and increments up to MOJ9999.
 */
export function getNextProductCode(productsList = []) {
  let maxNum = -1;
  const combined = [...(fallbackProducts || []), ...(productsList || [])];
  combined.forEach(p => {
    const raw = p?.productCode || p?.modelCode || (p?.id ? fallbackCodeMap.get(String(p.id)) : null);
    if (isValidMojCode(raw)) {
      const match = raw.trim().match(/^MOJ(\d{4})$/i);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxNum) {
          maxNum = val;
        }
      }
    }
  });

  return formatMojCode(maxNum + 1);
}
