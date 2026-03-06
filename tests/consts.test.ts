import { describe, expect, it } from "vitest";
import { SITE_DESCRIPTION, SITE_TITLE } from "../src/config/site";

describe("site metadata", () => {
  it("exposes non-empty title and description", () => {
    expect(typeof SITE_TITLE).toBe("string");
    expect(SITE_TITLE.trim().length).toBeGreaterThan(0);

    expect(typeof SITE_DESCRIPTION).toBe("string");
    expect(SITE_DESCRIPTION.trim().length).toBeGreaterThan(0);
  });
});
