const test = require("node:test");
const assert = require("node:assert/strict");
const { relevanceScore } = require("../image-sources");

function ok(device, candidate) {
  assert.equal(relevanceScore(device, candidate).ok, true, `expected "${candidate}" to match "${device}"`);
}
function notOk(device, candidate) {
  assert.equal(relevanceScore(device, candidate).ok, false, `expected "${candidate}" NOT to match "${device}"`);
}

// Each block below pins a false-positive bug class fixed in this matcher
// (see DEVICE_IMAGE_PIPELINE.md / the 2026-06-19 pipeline handoff). Re-running
// into one of these after a future tweak means that bug class regressed.

test("model numbers are boundary-checked, not substring-matched", () => {
  notOk("Fujifilm X100V", "Fujifilm X100VI");
  notOk("GoPro Hero 11 Black", "GoPro HERO13 Black");
  ok("Fujifilm X100V", "Fujifilm X100V");
  ok("GoPro Hero 11 Black", "GoPro HERO11 Black");
});

test("roman numerals discriminate models exactly (not generic filler)", () => {
  notOk("Canon EOS R6 Mark II", "Canon EOS R6 Mark III");
  notOk("Nikon Z6 III", "Nikon Z6 II");
  ok("Canon EOS R6 Mark II", "Canon EOS R6 Mark II");
  ok("Nikon Z6 II", "Nikon Z6 II");
});

test("+/Plus denotes a distinct SKU, checked symmetrically", () => {
  notOk("Samsung Galaxy Tab S10 FE+", "Samsung Galaxy Tab S10 FE");
  notOk("Samsung Galaxy Tab S10 FE", "Samsung Galaxy Tab S10 FE+");
  ok("Samsung Galaxy Tab S10 FE+", "Samsung Galaxy Tab S10 FE+");
  // a space-separated "+" (e.g. "Camera + Backpack") is a separator, not a SKU suffix
  ok("Sony Camera", "Sony Camera + Backpack");
});

test("all salient tokens must be present, not just a majority", () => {
  notOk("HP Chromebook 14", "HP Pavilion Plus 14 Laptop");
  ok("HP Chromebook 14", "HP Chromebook 14 Laptop");
});

test("product-line words (mini/pro/max/se/plus) are NOT generic filler", () => {
  notOk("DJI Mini 3 Pro", "DJI Action 3");
  notOk("DJI Mini 3 Pro", "DJI Mini 3");
  ok("DJI Mini 3 Pro", "DJI Mini 3 Pro");
});

test("accessory-only candidates are rejected when the device isn't an accessory", () => {
  notOk("Canon EOS R6", "Canon EOS R6 Lens Kit");
  notOk("Canon EOS R6", "Canon EOS R6 Battery Charger");
  ok("Canon EOS R6", "Canon EOS R6 Body");
});
