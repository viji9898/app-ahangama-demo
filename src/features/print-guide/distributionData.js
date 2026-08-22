export const DISTRIBUTION_TARGETS = Object.freeze({
  annualCirculation: 20000,
  minimumDistributionPoints: 200,
  accommodationRooms: 1500,
  restaurantsAndCafes: 75,
  retailWellnessAndSurf: 50,
  reserveCopies: 1500,
  digitalReaders: 50000,
  circulationMonths: 12,
});

export const DISTRIBUTION_CHANNELS = Object.freeze([
  { channel: "Hotels", partners: 25, unitsLabel: "750 rooms", rooms: 750, copies: 5000, audience: 35000, status: "target" },
  { channel: "Boutique hotels", partners: 30, unitsLabel: "300 rooms", rooms: 300, copies: 3000, audience: 15000, status: "target" },
  { channel: "Villas / Airbnbs", partners: 50, unitsLabel: "150 rooms", rooms: 150, copies: 2500, audience: 10000, status: "target" },
  { channel: "Restaurants & cafes", partners: 60, unitsLabel: "-", rooms: 0, copies: 4000, audience: 20000, status: "target" },
  { channel: "Surf schools / beach clubs", partners: 15, unitsLabel: "-", rooms: 0, copies: 1000, audience: 5000, status: "target" },
  { channel: "Wellness / gyms / spas", partners: 15, unitsLabel: "-", rooms: 0, copies: 1000, audience: 5000, status: "target" },
  { channel: "Shops", partners: 20, unitsLabel: "-", rooms: 0, copies: 750, audience: 3000, status: "target" },
  { channel: "Coworking", partners: 5, unitsLabel: "-", rooms: 0, copies: 500, audience: 3000, status: "target" },
  { channel: "Drivers / transfers", partners: 20, unitsLabel: "-", rooms: 0, copies: 750, audience: 4000, status: "target" },
]);

export const ACCOMMODATION_DISTRIBUTION = Object.freeze([
  { property: "Palm Hotel", rooms: 12, occupancy: 70, averageStay: 3, copies: 350, status: "target" },
  { property: "Radisson Collection Resort & Spa, Galle", rooms: 106, occupancy: 65, averageStay: 3, copies: 1000, status: "target" },
  { property: "Lighthouse", rooms: 10, occupancy: 72, averageStay: 3, copies: 300, status: "target" },
  { property: "Mosvold Villa", rooms: 17, occupancy: 68, averageStay: 3.2, copies: 400, status: "target" },
  { property: "Kurulu Bay", rooms: 14, occupancy: 65, averageStay: 3.5, copies: 325, status: "target" },
  { property: "SĀMA", rooms: 8, occupancy: 72, averageStay: 3, copies: 250, status: "target" },
  { property: "Harding Boutique Hotel", rooms: 6, occupancy: 75, averageStay: 3, copies: 225, status: "target" },
  { property: "The Nuga House", rooms: 8, occupancy: 70, averageStay: 3.5, copies: 225, status: "target" },
  { property: "Merchant House", rooms: 14, occupancy: 68, averageStay: 3, copies: 350, status: "target" },
  { property: "Trebartha East", rooms: 4, occupancy: 65, averageStay: 4, copies: 150, status: "target" },
  { property: "The Find", rooms: 6, occupancy: 70, averageStay: 3.5, copies: 175, status: "target" },
]);

export function calculateAnnualGuests(rooms, occupancy, averageStay) {
  return Math.round((rooms * (occupancy / 100) * 365 * 2) / averageStay);
}

export function getAccommodationDistributionRecords() {
  return ACCOMMODATION_DISTRIBUTION.map((record) => ({
    ...record,
    annualGuests: calculateAnnualGuests(
      record.rooms,
      record.occupancy,
      record.averageStay,
    ),
  }));
}

export function calculateDistributionMetrics() {
  const records = getAccommodationDistributionRecords();
  const sumChannels = (field, status) =>
    DISTRIBUTION_CHANNELS.filter((channel) => !status || channel.status === status)
      .reduce((total, channel) => total + channel[field], 0);
  const sumRecords = (field, status) =>
    records.filter((record) => !status || record.status === status)
      .reduce((total, record) => total + record[field], 0);
  const annualCopiesAllocated = sumChannels("copies");

  return {
    annualCirculation: annualCopiesAllocated + DISTRIBUTION_TARGETS.reserveCopies,
    distributionPoints: sumChannels("partners"),
    roomsReached: sumChannels("rooms"),
    annualCopiesAllocated,
    estimatedAnnualGuests: sumChannels("audience"),
    reserveCopies: DISTRIBUTION_TARGETS.reserveCopies,
    digitalReaders: DISTRIBUTION_TARGETS.digitalReaders,
    mappedRooms: sumRecords("rooms"),
    mappedAnnualGuests: sumRecords("annualGuests"),
    mappedCopies: sumRecords("copies"),
    confirmedDistributionPoints: sumChannels("partners", "confirmed"),
    confirmedRooms: sumRecords("rooms", "confirmed"),
    confirmedCopies: sumChannels("copies", "confirmed"),
    discussionDistributionPoints: sumChannels("partners", "discussion"),
    discussionCopies: sumChannels("copies", "discussion"),
  };
}
