import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateAccommodationGapScore,
  classifyHotelOpportunity,
  getDistanceWeight,
  normalizeMetric,
} from "../src/utils/hotelOpportunityAnalysis.js";

test("distance weighting follows the configured bands", () => {
  assert.equal(getDistanceWeight(0), 1);
  assert.equal(getDistanceWeight(500), 1);
  assert.equal(getDistanceWeight(501), 0.7);
  assert.equal(getDistanceWeight(1000), 0.7);
  assert.equal(getDistanceWeight(1001), 0.35);
  assert.equal(getDistanceWeight(1500), 0.35);
  assert.equal(getDistanceWeight(1501), 0);
});

test("normalisation clamps metrics to a 0-100 scale", () => {
  assert.equal(normalizeMetric(0, 10), 0);
  assert.equal(normalizeMetric(5, 10), 50);
  assert.equal(normalizeMetric(15, 10), 100);
  assert.equal(normalizeMetric(Number.NaN, 10), 0);
});

test("accommodation gap rewards amenities with limited accommodation supply", () => {
  const limitedSupply = calculateAccommodationGapScore({
    restaurants: 14,
    bars: 5,
    gyms: 5,
    villas: 2,
  });
  const saturatedSupply = calculateAccommodationGapScore({
    restaurants: 14,
    bars: 5,
    gyms: 5,
    villas: 15,
  });
  assert.ok(limitedSupply > saturatedSupply);
  assert.ok(limitedSupply > 50);
});

test("classification thresholds produce all five levels", () => {
  assert.equal(classifyHotelOpportunity(80), "very-strong");
  assert.equal(classifyHotelOpportunity(65), "promising");
  assert.equal(classifyHotelOpportunity(50), "conditional");
  assert.equal(classifyHotelOpportunity(35), "weak");
  assert.equal(classifyHotelOpportunity(34.9), "unsuitable");
});
