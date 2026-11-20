/**
 * Utility functions for generating and validating 7-character MOJ Product Model Codes
 * Format: "MOJ" followed by 4 digits (e.g. "MOJ0001", "MOJ0042", "MOJ0105")
 */

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
 * Falls back deterministically if code is not explicitly set.
 */
export function getProductCode(product, fallbackIndex = null) {
  if (!product) return 'MOJ0000';

  if (isValidMojCode(product.productCode)) {
    return product.productCode.trim().toUpperCase();
  }

  if (isValidMojCode(product.modelCode)) {
    return product.modelCode.trim().toUpperCase();
  }

  if (fallbackIndex !== null && typeof fallbackIndex === 'number' && fallbackIndex >= 0) {
    return formatMojCode(fallbackIndex);
  }

  // Derive deterministically from timestamp/id if available
  const idStr = String(product.id || product.createdAt || '');
  const digits = idStr.replace(/\D/g, '');
  if (digits.length >= 4) {
    return `MOJ${digits.slice(-4)}`;
  }

  return 'MOJ0000';
}

/**
 * Calculates the next sequential MOJ product code based on existing products list.
 * Starts from MOJ0000 and increments up to MOJ9999.
 */
export function getNextProductCode(productsList = []) {
  let maxNum = -1;
  (productsList || []).forEach(p => {
    const raw = p?.productCode || p?.modelCode;
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
