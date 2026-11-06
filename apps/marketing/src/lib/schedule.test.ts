// Run with: pnpm test (node --experimental-strip-types --test)
import assert from "node:assert/strict";
import { test } from "node:test";

import { DEFAULT_MOMENTS, formatShortDate, MOMENTS, momentTime, sortMoments } from "./schedule.ts";

test("moments are ordered by date, not by the order they were ticked", () => {
  assert.deepEqual(
    sortMoments(["a30", "b1", "a1", "b7"]).map((moment) => moment.id),
    ["b7", "b1", "a1", "a30"],
  );
});

test("unknown ids are ignored", () => {
  assert.deepEqual(
    sortMoments(["nope", "b3"]).map((moment) => moment.id),
    ["b3"],
  );
});

test("demo dates match the copy: J-3 is 12 Oct, J+30 is 14 Nov", () => {
  const byId = Object.fromEntries(MOMENTS.map((moment) => [moment.id, moment]));
  assert.equal(formatShortDate("fr", momentTime(byId.b3!)), "12 oct.");
  assert.equal(formatShortDate("en", momentTime(byId.a30!)), "14 Nov");
});

test("every demo sending day is Monday to Saturday", () => {
  for (const moment of MOMENTS) {
    assert.notEqual(new Date(momentTime(moment)).getUTCDay(), 0, moment.id);
  }
});

test("defaults exist", () => {
  const ids = new Set(MOMENTS.map((moment) => moment.id));
  for (const id of DEFAULT_MOMENTS) assert.ok(ids.has(id), id);
});
