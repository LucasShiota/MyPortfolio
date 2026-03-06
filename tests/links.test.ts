import { describe, expect, it } from "vitest";
import { LINKS } from "../src/config/links";

const EXTERNAL_KEYS = ["linkedin", "github", "steam", "substack", "itchio"] as const;
const PROJECT_KEYS = ["drgmod", "baraliot", "tf2"] as const;

describe("LINKS config", () => {
  it("keeps required external links as valid https URLs", () => {
    for (const key of EXTERNAL_KEYS) {
      const link = LINKS[key];
      const url = link.url;
      expect(typeof url).toBe("string");
      expect(url.length).toBeGreaterThan(0);

      const parsed = new URL(url);
      expect(parsed.protocol).toBe("https:");
    }
  });

  it("keeps required project links present and non-empty", () => {
    expect(LINKS.projects).toBeDefined();

    for (const key of PROJECT_KEYS) {
      const link = LINKS.projects[key];
      const url = link.url;
      expect(typeof url).toBe("string");
      expect(url.length).toBeGreaterThan(0);
    }
  });
});
