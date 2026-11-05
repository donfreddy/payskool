// Run with: pnpm test (node --experimental-strip-types --test)
import assert from "node:assert/strict";
import { test } from "node:test";

import { normalizeReceiptNumber } from "./receipt.ts";

test("canonical number is kept", () => {
  assert.equal(normalizeReceiptNumber("REC-8957"), "REC-8957");
});

test("case, spaces and missing dash are tolerated", () => {
  for (const input of ["rec-8957", " rec 8957 ", "REC8957", "Rec - 8957"]) {
    assert.equal(normalizeReceiptNumber(input), "REC-8957", input);
  }
});

test("digits alone are accepted", () => {
  assert.equal(normalizeReceiptNumber("8957"), "REC-8957");
});

test("unicode dashes, non-breaking spaces and trailing dots are tolerated", () => {
  for (const input of ["REC–8957", "REC‑8957", "REC 8957", "REC-8957.", "REC - 8957"]) {
    assert.equal(normalizeReceiptNumber(input), "REC-8957", JSON.stringify(input));
  }
});

test("a N° prefix is tolerated", () => {
  for (const input of ["N° 8957", "n°REC-8957", "No 8957"]) {
    assert.equal(normalizeReceiptNumber(input), "REC-8957", input);
  }
});

test("leading zeros are dropped", () => {
  assert.equal(normalizeReceiptNumber("REC-08957"), "REC-8957");
  assert.equal(normalizeReceiptNumber("000"), "REC-0");
});

test("empty or blank input gives null", () => {
  for (const input of ["", "   ", "\t\n", "REC", "REC-", "N°"]) {
    assert.equal(normalizeReceiptNumber(input), null, JSON.stringify(input));
  }
});

test("letters mixed with digits are not a receipt number", () => {
  for (const input of ["REC-89A57", "ABC-8957", "8957REC", "REC-8957-2"]) {
    assert.equal(normalizeReceiptNumber(input), null, input);
  }
});

test("very long input is rejected rather than echoed back", () => {
  assert.equal(normalizeReceiptNumber("9".repeat(40)), null);
  assert.equal(normalizeReceiptNumber("x".repeat(10_000)), null);
});
