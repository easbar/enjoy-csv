import { splitBulk } from '../../libs/split_bulk.js';

// column names
export const COL_ID = 'Bestellnummer';
const COL_NAME = 'Name';
const COL_NOTE = 'Notiz';
const COL_UNIT = 'Einheit';
const COL_PRICE = 'Nettopreis';
const COL_BULK_SIZE = 'Gebindegröße';

// this makes this mode stateful, but we don't really care as we only run it once anyway
const ids = new Map();

export default function bode2(row) {
  // remove duplicates
  const id = row[COL_ID].trim();
  if (ids.has(id)) return undefined;
  ids.set(id, 1);

  // append original size to name column, because foodsoft does not allow duplicate names
  const bodeSize = row[COL_BULK_SIZE].trim();
  row[COL_NAME] = `${row[COL_NAME].trim()}, ${bodeSize}`;

  // check for too long names (foodsoft won't allow them)
  if (row[COL_NAME].length > 60)
    throw new Error(
      `Foodsoft won't accept names longer than 60 characters, name: ${
        row[COL_NAME]
      }, row: ${JSON.stringify(row, null, 2)}`
    );

  // prepend original size and price per unit to note column
  const pricePerUnit = row[COL_PRICE].trim();
  const note = row[COL_NOTE].trim();
  row[COL_NOTE] = `${bodeSize}, ${pricePerUnit}/Einheit`;
  if (note.length > 0) row[COL_NOTE] += `, ${note}`;

  // split original size into units and set unit price
  const bulk = splitBulk(row[COL_BULK_SIZE]);
  if (bulk) {
    row[COL_UNIT] = bulk.unitStr;
    row[COL_BULK_SIZE] = bulk.amount;
    // we get 3% off for ordering online
    const discount = 0.97;
    row[COL_PRICE] = parseFloat(
      (
        parseFloat(row[COL_PRICE].trim().split(' €')[0]) *
        discount *
        bulk.unit
      ).toFixed(2)
    );
    return row;
  }
  throw new Error(
    `Unknown bulk size: ${row[COL_BULK_SIZE]}, row: ${JSON.stringify(
      row,
      null,
      2
    )}`
  );
}
