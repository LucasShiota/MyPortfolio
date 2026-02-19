import { describe, expect, it } from "vitest";
import { LINKS } from "../src/config/links";

const EXTERNAL_KEYS = ["linkedin", "github", "steam", "substack", "itchio"] as const;
const PROJECT_KEYS = ["drgmod", "baraliot", "tf2"] as const;

describe("LINKS config", () => {
  it("keeps required external links as valid https URLs", () => {
    for (const key of EXTERNAL_KEYS) {
      const value = LINKS[key];
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);

      const parsed = new URL(value);
      expect(parsed.protocol).toBe("https:");
    }
  });

  it("keeps required project links present and non-empty", () => {
    expect(LINKS.projects).toBeDefined();

    for (const key of PROJECT_KEYS) {
      const value = LINKS.projects[key];
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });
});
