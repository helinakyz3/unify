import { describe, it, expect } from "vitest";
import {
  calculateOverlap,
  findSharedActivities,
  sameLocation,
  calculateMatchScore,
  findBestMatch,
  SUPPORTED_ACTIVITIES,
} from "../lib/matching";

const alex = {
  id: 1,
  name: "Alex",
  freeFrom: "18:00",
  freeUntil: "20:00",
  location: "Greenwich Campus",
  activities: ["coffee", "walk"],
};

const helin = {
  id: 99,
  name: "Helin",
  freeFrom: "18:30",
  freeUntil: "20:00",
  location: "Greenwich Campus",
  activities: ["coffee", "food"],
};

describe("calculateOverlap", () => {
  it("returns the correct overlapping window (valid overlap)", () => {
    expect(calculateOverlap({ freeFrom: "18:00", freeUntil: "20:00" }, { freeFrom: "18:30", freeUntil: "19:30" })).toEqual({
      start: "18:30",
      end: "19:30",
      duration: 60,
    });
  });

  it("matches the README example (90 minutes)", () => {
    expect(calculateOverlap(alex, helin)).toEqual({ start: "18:30", end: "20:00", duration: 90 });
  });

  it("returns null when there is no overlap", () => {
    expect(
      calculateOverlap({ freeFrom: "18:00", freeUntil: "19:00" }, { freeFrom: "20:00", freeUntil: "21:00" })
    ).toBeNull();
  });

  it("returns null for an inverted range (from >= until)", () => {
    expect(calculateOverlap({ freeFrom: "20:00", freeUntil: "18:00" }, helin)).toBeNull();
  });

  it("returns null for an equal from/until (zero-length range)", () => {
    expect(calculateOverlap({ freeFrom: "18:00", freeUntil: "18:00" }, helin)).toBeNull();
  });

  it("returns null for malformed time strings", () => {
    expect(calculateOverlap({ freeFrom: "25:90", freeUntil: "20:00" }, helin)).toBeNull();
    expect(calculateOverlap({ freeFrom: "not-a-time", freeUntil: "20:00" }, helin)).toBeNull();
  });

  it("returns null for missing time fields", () => {
    expect(calculateOverlap({ freeUntil: "20:00" }, helin)).toBeNull();
    expect(calculateOverlap({}, helin)).toBeNull();
  });

  it("returns null for back-to-back (touching) windows", () => {
    expect(
      calculateOverlap({ freeFrom: "08:00", freeUntil: "10:00" }, { freeFrom: "10:00", freeUntil: "12:00" })
    ).toBeNull();
  });
});

describe("findSharedActivities", () => {
  it("returns only the activities present in both lists", () => {
    expect(findSharedActivities(alex, helin)).toEqual(["coffee"]);
  });

  it("returns an empty array when there is no shared activity", () => {
    expect(findSharedActivities({ activities: ["study"] }, { activities: ["walk"] })).toEqual([]);
  });

  it("ignores activity ids outside the supported list", () => {
    const a = { activities: ["coffee", "skydiving"] };
    const b = { activities: ["skydiving", "coffee"] };
    expect(findSharedActivities(a, b)).toEqual(["coffee"]);
    expect(SUPPORTED_ACTIVITIES).not.toContain("skydiving");
  });

  it("safely handles missing or malformed activity arrays", () => {
    expect(findSharedActivities({}, helin)).toEqual([]);
    expect(findSharedActivities({ activities: "coffee" }, helin)).toEqual([]);
    expect(findSharedActivities(null, undefined)).toEqual([]);
  });
});

describe("sameLocation", () => {
  it("detects matching campuses", () => {
    expect(sameLocation(alex, helin)).toBe(true);
  });

  it("detects different campuses", () => {
    expect(sameLocation(alex, { location: "Library" })).toBe(false);
  });

  it("safely handles missing locations", () => {
    expect(sameLocation({}, helin)).toBe(false);
    expect(sameLocation(null, undefined)).toBe(false);
  });
});

describe("calculateMatchScore", () => {
  it("scores a perfect match as 100", () => {
    expect(
      calculateMatchScore({ overlap: { duration: 90 }, sharedActivities: ["coffee"], isSameLocation: true })
    ).toBe(100);
  });

  it("scores no overlap / no activity / different location as 0", () => {
    expect(calculateMatchScore({ overlap: null, sharedActivities: [], isSameLocation: false })).toBe(0);
  });

  it("never exceeds 100 even for very long overlaps", () => {
    expect(
      calculateMatchScore({ overlap: { duration: 600 }, sharedActivities: ["coffee", "walk"], isSameLocation: true })
    ).toBe(100);
  });

  it("handles missing/malformed inputs without throwing", () => {
    expect(calculateMatchScore({})).toBe(0);
  });
});

describe("findBestMatch", () => {
  const pool = [
    alex,
    { id: 2, name: "Jordan", freeFrom: "19:00", freeUntil: "21:00", location: "Library", activities: ["study"] },
    { id: 3, name: "Sam", freeFrom: "18:00", freeUntil: "20:00", location: "Greenwich Campus", activities: ["walk"] },
  ];

  it("picks Alex for the Helin/Alex scenario and reports 90 minutes at 100 points", () => {
    const match = findBestMatch(helin, pool);
    expect(match).not.toBeNull();
    expect(match.student.name).toBe("Alex");
    expect(match.overlap.duration).toBe(90);
    expect(match.sharedActivities).toContain("coffee");
    expect(match.score).toBe(100);
  });

  it("rejects a candidate with a shared activity but no time overlap", () => {
    const noOverlapPool = [{ id: 5, freeFrom: "01:00", freeUntil: "02:00", location: "Greenwich Campus", activities: ["coffee"] }];
    expect(findBestMatch(helin, noOverlapPool)).toBeNull();
  });

  it("rejects a candidate with time overlap but no shared activity", () => {
    expect(findBestMatch(helin, [{ id: 2, freeFrom: "18:00", freeUntil: "21:00", location: "Greenwich Campus", activities: ["study"] }])).toBeNull();
  });

  it("requires the same campus — rejects an otherwise perfect match on a different campus", () => {
    const otherCampus = [{ id: 6, freeFrom: "18:00", freeUntil: "21:00", location: "Library", activities: ["coffee"] }];
    expect(findBestMatch(helin, otherCampus)).toBeNull();
  });

  it("ignores the current user even if present in the candidate pool", () => {
    const match = findBestMatch(alex, pool);
    expect(match.student.id).not.toBe(alex.id);
  });

  it("never matches a user against themselves even without other candidates", () => {
    expect(findBestMatch(alex, [alex])).toBeNull();
  });

  it("skips malformed candidates (null, missing id) without crashing", () => {
    const messyPool = [null, { name: "no id" }, undefined, alex];
    const match = findBestMatch(helin, messyPool);
    expect(match.student.name).toBe("Alex");
  });

  it("returns null when candidates isn't a usable array", () => {
    expect(findBestMatch(helin, null)).toBeNull();
    expect(findBestMatch(helin, undefined)).toBeNull();
  });

  it("returns null when nobody is compatible at all", () => {
    const lonelyUser = { id: 42, freeFrom: "03:00", freeUntil: "04:00", location: "Main Entrance", activities: ["explore"] };
    expect(findBestMatch(lonelyUser, pool)).toBeNull();
  });

  it("breaks ties deterministically by longer overlap duration", () => {
    const tiedPool = [
      { id: 10, name: "Shorter", freeFrom: "18:30", freeUntil: "19:30", location: "Greenwich Campus", activities: ["coffee"] },
      { id: 11, name: "Longer", freeFrom: "18:30", freeUntil: "20:00", location: "Greenwich Campus", activities: ["coffee"] },
    ];
    const match = findBestMatch(helin, tiedPool);
    expect(match.student.name).toBe("Longer");
  });

  it("is deterministic across repeated calls with the same input", () => {
    const first = findBestMatch(helin, pool);
    const second = findBestMatch(helin, pool);
    expect(first).toEqual(second);
  });
});
