import { describe, it, expect } from "vitest";
import { avatarColor, initials } from "../lib/avatar";

describe("avatarColor", () => {
  it("is deterministic for the same seed", () => {
    expect(avatarColor("alex")).toBe(avatarColor("alex"));
    expect(avatarColor(1)).toBe(avatarColor(1));
  });

  it("returns a bg-* Tailwind class", () => {
    expect(avatarColor("alex")).toMatch(/^bg-/);
  });

  it("never throws on missing/malformed seeds", () => {
    expect(() => avatarColor(undefined)).not.toThrow();
    expect(() => avatarColor(null)).not.toThrow();
  });
});

describe("initials", () => {
  it("builds initials from first and last name", () => {
    expect(initials("Alex Smith")).toBe("AS");
  });

  it("falls back to a single initial for a one-word name", () => {
    expect(initials("Alex")).toBe("A");
  });

  it("returns a placeholder for missing/empty/malformed names", () => {
    expect(initials("")).toBe("?");
    expect(initials("   ")).toBe("?");
    expect(initials(undefined)).toBe("?");
    expect(initials(42)).toBe("?");
  });

  it("is deterministic across repeated calls", () => {
    expect(initials("Maya Chen")).toBe(initials("Maya Chen"));
  });
});
