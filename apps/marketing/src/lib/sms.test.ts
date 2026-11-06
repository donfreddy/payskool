// Run with: pnpm test (node --experimental-strip-types --test)
import assert from "node:assert/strict";
import { test } from "node:test";

import {
  countSms,
  displaySms,
  fallbackPairs,
  fillTemplate,
  gsmFallback,
  roomLeft,
  toSmsText,
} from "./sms.ts";

test("empty text costs nothing", () => {
  assert.deepEqual(countSms(""), { encoding: "GSM-7", length: 0, segments: 0, offending: [] });
});

test("160 GSM characters fit one SMS, 161 need two", () => {
  assert.equal(countSms("a".repeat(160)).segments, 1);
  assert.equal(countSms("a".repeat(161)).segments, 2);
  assert.equal(countSms("a".repeat(306)).segments, 2);
  assert.equal(countSms("a".repeat(307)).segments, 3);
});

test("French accents of the GSM alphabet stay in GSM-7", () => {
  const count = countSms("Échéance réglée à la caisse, où ça ?".replace("ç", "c"));
  assert.equal(count.encoding, "GSM-7");
});

test("one character outside GSM-7 switches to UCS-2", () => {
  const count = countSms(`Reçu ${"a".repeat(70)}`);
  assert.equal(count.encoding, "UCS-2");
  assert.deepEqual(count.offending, ["ç"]);
  assert.equal(count.segments, 2);
});

test("UCS-2 limits are 70, then 67 per part", () => {
  assert.equal(countSms(`ê${"a".repeat(69)}`).segments, 1);
  assert.equal(countSms(`ê${"a".repeat(70)}`).segments, 2);
  assert.equal(countSms(`ê${"a".repeat(133)}`).segments, 2);
  assert.equal(countSms(`ê${"a".repeat(134)}`).segments, 3);
});

test("extended characters count twice", () => {
  const count = countSms("€".repeat(80));
  assert.equal(count.encoding, "GSM-7");
  assert.equal(count.length, 160);
  assert.equal(count.segments, 1);
  assert.equal(countSms("€".repeat(81)).segments, 2);
});

test("offending characters are listed once, in order", () => {
  assert.deepEqual(countSms("être, être, ôter, ça").offending, ["ê", "ô", "ç"]);
});

test("silent typography is replaced by GSM equivalents", () => {
  // Built from code points: these characters are invisible or look like ASCII.
  const [nnbsp, nbsp, rsquo, ldquo, rdquo, hellip, ndash] = [
    0x202f, 0x00a0, 0x2019, 0x201c, 0x201d, 0x2026, 0x2013,
  ].map((code) => String.fromCharCode(code));
  const text = toSmsText(`40${nnbsp}000${nbsp}FCFA ${rsquo} ${ldquo}ok${rdquo} ${hellip} ${ndash}`);
  assert.equal(text, `40 000 FCFA ' "ok" ... -`);
  assert.equal(countSms(text).encoding, "GSM-7");
});

test("templates fill known tokens and keep unknown ones", () => {
  assert.equal(
    fillTemplate("Bonjour {parent}, {eleve} doit {montant}. {inconnu}", {
      parent: "Mme Etoga",
      eleve: "Yann",
      montant: "40 000 FCFA",
    }),
    "Bonjour Mme Etoga, Yann doit 40 000 FCFA. {inconnu}",
  );
});

test("display text keeps amounts and French punctuation together", () => {
  const nbsp = String.fromCharCode(0xa0);
  assert.equal(
    displaySms("Reste : 35 000 FCFA, 1 250 000 FCFA !"),
    `Reste${nbsp}: 35${nbsp}000${nbsp}FCFA, 1${nbsp}250${nbsp}000${nbsp}FCFA${nbsp}!`,
  );
  assert.equal(displaySms("tranche 2 de Yann"), "tranche 2 de Yann");
});

test("an escape pair is never split across parts", () => {
  // 152 plain characters then a euro sign: 154 septets, but the euro cannot
  // straddle the 153 boundary, so part 1 holds 152 and part 2 holds the euro.
  const count = countSms(`${"a".repeat(152)}€${"a".repeat(152)}`);
  assert.equal(count.length, 306);
  assert.equal(count.segments, 3);
});

test("a surrogate pair is never split across UCS-2 parts", () => {
  // ê + 65 letters = 66 units, then an emoji (2 units) cannot fit in part 1.
  const count = countSms(`ê${"a".repeat(65)}🏫${"a".repeat(66)}`);
  assert.equal(count.length, 134);
  assert.equal(count.segments, 3);
});

test("emoji count as two UTF-16 units", () => {
  assert.equal(countSms("🏫".repeat(35)).segments, 1);
  assert.equal(countSms("🏫".repeat(36)).segments, 2);
});

test("room left before the next part", () => {
  assert.equal(roomLeft(countSms("a".repeat(134))), 26);
  assert.equal(roomLeft(countSms("a".repeat(200))), 106);
  assert.equal(roomLeft(countSms(`ê${"a".repeat(9)}`)), 60);
});

test("French fallbacks bring a message back to GSM-7", () => {
  const text = gsmFallback("Reçu : vous êtes prié, ô Maître, cœur à l'école");
  assert.equal(text, "Recu : vous etes prié, o Maitre, coeur à l'école");
  assert.equal(countSms(text).encoding, "GSM-7");
});

test("fallback pairs only list characters that have one", () => {
  assert.deepEqual(fallbackPairs(["ç", "🏫", "ê"]), [
    ["ç", "c"],
    ["ê", "e"],
  ]);
});
