import { describe, it, expect } from "vitest";
import { findActivityPeers, getPulseStats, formSmallGroup, MIN_GROUP_SIZE, MAX_GROUP_SIZE } from "../lib/social";

const you = { id: 0, name: "You", location: "Greenwich Campus", activities: ["coffee"] };

const students = [
  { id: 1, name: "Alex", location: "Greenwich Campus", activities: ["coffee", "walk"] },
  { id: 2, name: "Maya", location: "Greenwich Campus", activities: ["coffee", "food"] },
  { id: 3, name: "Jordan", location: "Library", activities: ["study"] },
  { id: 4, name: "Priya", location: "Greenwich Campus", activities: ["coffee"] },
  { id: 5, name: "Sam", location: "Greenwich Campus", activities: ["walk"] },
];

describe("findActivityPeers", () => {
  it("returns students at the same location interested in the activity", () => {
    const peers = findActivityPeers(you, students, "coffee");
    expect(peers.map((p) => p.id)).toEqual([1, 2, 4]);
  });

  it("excludes the current user even if they appear in the pool", () => {
    const peers = findActivityPeers(you, [...students, you], "coffee");
    expect(peers.some((p) => p.id === you.id)).toBe(false);
  });

  it("excludes students at a different location", () => {
    const peers = findActivityPeers(you, students, "study");
    expect(peers).toEqual([]);
  });

  it("rejects an unsupported/forged activity id", () => {
    expect(findActivityPeers(you, students, "skydiving")).toEqual([]);
  });

  it("never throws on malformed candidates", () => {
    const malformed = [null, undefined, { name: "no id or location" }, ...students];
    expect(() => findActivityPeers(you, malformed, "coffee")).not.toThrow();
    expect(findActivityPeers(you, malformed, "coffee").map((p) => p.id)).toEqual([1, 2, 4]);
  });

  it("returns [] for missing currentUser or non-array candidates", () => {
    expect(findActivityPeers(null, students, "coffee")).toEqual([]);
    expect(findActivityPeers(you, null, "coffee")).toEqual([]);
  });
});

describe("getPulseStats", () => {
  it("counts interested students per activity at a location", () => {
    const stats = getPulseStats(students, "Greenwich Campus");
    expect(stats).toEqual(
      expect.arrayContaining([
        { activityId: "coffee", count: 3 },
        { activityId: "walk", count: 2 },
      ])
    );
  });

  it("omits activities with zero interest", () => {
    const stats = getPulseStats(students, "Greenwich Campus");
    expect(stats.find((s) => s.activityId === "explore")).toBeUndefined();
  });

  it("is scoped to the given location only", () => {
    const stats = getPulseStats(students, "Library");
    expect(stats).toEqual([{ activityId: "study", count: 1 }]);
  });

  it("never throws on malformed students and returns [] for bad input", () => {
    expect(getPulseStats(null, "Greenwich Campus")).toEqual([]);
    expect(getPulseStats(students, null)).toEqual([]);
    expect(() => getPulseStats([null, { bad: true }, ...students], "Greenwich Campus")).not.toThrow();
  });

  it("is deterministic across repeated calls", () => {
    expect(getPulseStats(students, "Greenwich Campus")).toEqual(getPulseStats(students, "Greenwich Campus"));
  });
});

describe("formSmallGroup", () => {
  it("forms a group including the current user plus interested peers", () => {
    const group = formSmallGroup(you, students, "coffee");
    expect(group.members.map((m) => m.id)).toEqual([0, 1, 2, 4]);
    expect(group.activityId).toBe("coffee");
    expect(group.location).toBe("Greenwich Campus");
  });

  it("caps group size at MAX_GROUP_SIZE", () => {
    const group = formSmallGroup(you, students, "coffee");
    expect(group.members.length).toBeLessThanOrEqual(MAX_GROUP_SIZE);
  });

  it("returns null when fewer than MIN_GROUP_SIZE people are available", () => {
    const lonely = [{ id: 9, name: "Noah", location: "Greenwich Campus", activities: ["explore"] }];
    expect(formSmallGroup(you, lonely, "coffee")).toBeNull();
  });

  it("returns null for an unsupported activity id", () => {
    expect(formSmallGroup(you, students, "skydiving")).toBeNull();
  });

  it("is deterministic — same input always produces the same group", () => {
    expect(formSmallGroup(you, students, "coffee")).toEqual(formSmallGroup(you, students, "coffee"));
  });

  it("never throws on malformed candidate pools", () => {
    expect(() => formSmallGroup(you, [null, undefined, ...students], "coffee")).not.toThrow();
  });
});

describe("constants", () => {
  it("defines a sensible group size range", () => {
    expect(MIN_GROUP_SIZE).toBe(2);
    expect(MAX_GROUP_SIZE).toBe(4);
  });
});
