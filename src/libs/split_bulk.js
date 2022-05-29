export function splitBulk(str) {
  const parsers = [parseKgBulk, parseLBulk, parseBatchedProduct];
  for (const parse of parsers) {
    const res = parse(str);
    if (res) return res;
  }
  return undefined;
}

/**
 * Everything expressed in kg will be split into smaller batches, e.g. 12kg -> 24x500g, but 3kg -> 12x250g
 * In case there are two kg values like 10kg/20kg we just ignore the second one
 */
function parseKgBulk(str) {
  const bulkSize = getKgBulkSize(str);
  if (bulkSize) {
    let unitStr = '';
    let unit = 0;
    if (bulkSize < 0.05) throw new Error('<50g');
    else if (bulkSize >= 0.05 && bulkSize < 1.3) {
      unitStr = '50g';
      unit = 0.05;
    } else if (bulkSize >= 1.3 && bulkSize < 2.75) {
      unitStr = '100g';
      unit = 0.1;
    } else if (bulkSize >= 2.75 && bulkSize < 6) {
      unitStr = '250g';
      unit = 0.25;
    } else if (bulkSize >= 6 && bulkSize < 15) {
      unitStr = '500g';
      unit = 0.5;
    } else if (bulkSize >= 15 && bulkSize < 100) {
      unitStr = '1kg';
      unit = 1;
    } else throw new Error('>100kg');
    const amount = Math.floor((bulkSize * 1000) / (unit * 1000));
    return {
      unit,
      unitStr,
      amount,
    };
  }
  return undefined;
}

function getKgBulkSize(str) {
  str = str.trim();
  {
    // e.g. 12kg
    const matches = /^\d+,?\d*kg$/.exec(str);
    if (matches) {
      const bulkSizeStr = str.substring(0, str.indexOf('kg'));
      return parseFloat(bulkSizeStr.replace(',', '.'));
    }
  }
  {
    // e.g. 10kg/20kg or 10kg,20kg
    const matches = /^\d+,?\d*kg[\/,]\d+,?\d*kg$/.exec(str);
    if (matches) {
      const bulkSizeStr = str.substring(0, str.indexOf('kg'));
      return parseFloat(bulkSizeStr.replace(',', '.'));
    }
  }
  return undefined;
}

function parseLBulk(str) {
  const bulkSize = getLBulkSize(str);
  if (bulkSize) {
    let unitStr = '';
    let unit = 0;
    if (bulkSize < 1) throw new Error('<1L');
    else if (bulkSize >= 1 && bulkSize < 6) {
      unitStr = '500ml';
      unit = 0.5;
    } else if (bulkSize >= 6 && bulkSize < 100) {
      unitStr = '1L';
      unit = 1.0;
    } else throw new Error('>100L');
    const amount = Math.floor((bulkSize * 1000) / (unit * 1000));
    return {
      unit,
      unitStr,
      amount,
    };
  }
  return undefined;
}

function getLBulkSize(str) {
  str = str.trim();
  // e.g. 10L
  const matches = /^\d+L$/.exec(str);
  if (matches) {
    const bulkSizeStr = str.substring(0, str.indexOf('L'));
    return parseFloat(bulkSizeStr);
  }
}

/**
 * Products that are already shipped in batches are kept as they are
 */
function parseBatchedProduct(str) {
  str = str.trim();
  // e.g. '6/250g' or '6/250ml' or '6/8stk'
  let matches = /^(\d+)\/(\d+(?:g|ml|stk))$/.exec(str);
  if (!matches)
    // e.g. '6x250g' or '6x250ml' or '6x8stk'
    matches = /^(\d+)x(\d+(?:g|ml|stk))$/.exec(str);
  if (!matches) matches = /^(1) (Dose)$/.exec(str);
  if (!matches) matches = /^(1)(Kt.)$/.exec(str);
  if (matches) {
    const unitStr = matches[2].trim();
    const amount = parseInt(matches[1].trim());
    return {
      unit: 1,
      unitStr,
      amount,
    };
  }
  return undefined;
}
