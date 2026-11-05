// Run with: pnpm test (node --experimental-strip-types --test)
import assert from "node:assert/strict";
import { test } from "node:test";

import { cleanField, MAX_FIELD_LENGTH, pilotRequestMessage } from "./pilot-request.ts";

const labels = { school: "École :", city: "Ville :", students: "Élèves :" };

test("non-strings become empty", () => {
  assert.equal(cleanField(null), "");
  assert.equal(cleanField(undefined), "");
  assert.equal(cleanField(new Blob(["x"])), "");
});

test("whitespace runs and line breaks collapse to one space", () => {
  assert.equal(cleanField("  Collège\r\n  Les   Pins\t"), "Collège Les Pins");
});

test("long values are cut to the limit", () => {
  assert.equal(cleanField("a".repeat(500)).length, MAX_FIELD_LENGTH);
});

test("an emoji at the limit is never split into a lone surrogate", () => {
  const value = cleanField(`${"a".repeat(MAX_FIELD_LENGTH - 1)}🏫🏫`);
  assert.equal(Array.from(value).length, MAX_FIELD_LENGTH);
  assert.ok(value.endsWith("🏫"));
  assert.doesNotThrow(() => encodeURIComponent(value));
});

test("a cut that ends on a space leaves no trailing space", () => {
  assert.equal(
    cleanField(`${"a".repeat(MAX_FIELD_LENGTH - 1)} b`),
    "a".repeat(MAX_FIELD_LENGTH - 1),
  );
});

test("message lists filled fields only, in a fixed order", () => {
  const message = pilotRequestMessage("Bonjour", labels, { students: "450", school: "Les Pins" });
  assert.equal(message, "Bonjour\nÉcole : Les Pins\nÉlèves : 450");
});

test("message with no fields is the intro alone", () => {
  assert.equal(pilotRequestMessage("Bonjour", labels, { school: "  " }), "Bonjour");
});

test("a field cannot inject an extra line once cleaned", () => {
  const school = cleanField("Les Pins\nVille : Fausse");
  assert.equal(pilotRequestMessage("Bonjour", labels, { school }).split("\n").length, 2);
});
