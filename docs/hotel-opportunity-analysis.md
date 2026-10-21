# Hotel Opportunity Analysis

The `/wellness/map` Hotel Opportunity layer is a preliminary screening tool. It compares mapped venue activity across H3 resolution 9 cells, which are the closest standard H3 cells to roughly 500 metres across in this location. It is not a recommendation to acquire land or develop a hotel.

## Method

The adapter in `src/utils/hotelOpportunityAnalysis.js` converts existing map records to a small internal format with an ID, name, category, latitude, longitude, and optional room count. Cafes contribute to the restaurant signal. Gym and CrossFit records contribute to gym activity; yoga and Pilates records contribute to wellness activity.

Candidate cells are limited to H3 cells containing at least one valid mapped venue. This conservative boundary avoids presenting offshore or otherwise unmapped cells as development candidates when no coastline, parcel, or land-use geometry is available. Each candidate still measures surrounding activity across the full 1.5-kilometre analysis radius.

For every candidate cell, venues up to 1.5 kilometres from the cell centre receive these weights:

- 0-500 metres: 1.0
- 500 metres-1 kilometre: 0.7
- 1-1.5 kilometres: 0.35
- Beyond 1.5 kilometres: excluded

Restaurant, bar, gym/wellness, accommodation, diversity, and total-activity metrics are normalised to 0-100 using configurable caps. Visitor demand peaks at moderate mapped accommodation density and falls as density approaches the saturation threshold. Accommodation gap combines nearby restaurant, bar, and wellness support with the inverse of accommodation competition.

The overall score uses the weights in `src/config/hotelOpportunityConfig.js`:

- Restaurants: 25%
- Gyms/wellness: 15%
- Bars: 8%
- Amenity diversity: 12%
- Visitor demand: 20%
- Accommodation gap: 20%

Classification thresholds, colours, distance bands, normalisation caps, and H3 settings are all configurable in the same file.

## Data Limitations

- The source is a snapshot of Google-listed places, not a complete business or accommodation census.
- The current accommodation category combines villas, hotels, resorts, hostels, guest houses, and similar stays. The UI labels this clearly as `Villas / stays` and treats it as an accommodation-supply proxy.
- Room counts are not currently available. Each accommodation listing therefore contributes one supply unit. If `roomCount` is later added to source records, weighted supply and competition automatically use rooms instead.
- Results can be affected by missing places, duplicate classifications, closed businesses, edge effects near the mapped-area boundary, and Google category accuracy.
- The analysis does not include occupancy, seasonality, land availability, parcel size, asking price, beach access, road access, railway effects, flood/drainage risk, wetlands, terrain, noise, utilities, or planning restrictions.
- Scores are relative screening signals only. Every candidate area requires commercial, legal, planning, environmental, infrastructure, and on-site due diligence.

## Extension Points

`HOTEL_OPPORTUNITY_CONFIG.positiveScoringFactors` and `riskPenalties` accept future factor definitions with a `calculate(context)` function and optional weight. The analysis context supplies the cell centre, counts, weighted metrics, and nearby venue records.

Potential positive factors include beach/surf access, road accessibility, utilities, and verified demand. Potential penalties include railway/noise exposure, flood risk, wetlands, steep terrain, planning restrictions, and high land cost. Existing hotels should eventually be separated from villas and weighted by verified room inventory.

## Validation

Run focused scoring tests with:

```sh
npm run test:hotel-opportunity
```

Refresh the generated Places snapshot separately with `node scripts/generate-ahangama-map-places.mjs` when Google Places quota is available.