// this mode is stateful, but we don't really care as we only run it once anyway
import { COL_ID } from './bode2.js';

const ids = new Map();

export default function removeDuplicates(row) {
  const id = row[COL_ID].trim();
  if (ids.has(id)) return undefined;
  ids.set(id, 1);
  return row;
}
