import { describe, it, expect } from "vitest";
import { escapeHtml } from "../../../src/shared/utils/escapeHtml.js";

describe("escapeHtml()", () => {
  it("should keep normal text unchanged", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
  });

  it("should escape ampersands", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
  });

  it("should escape angle brackets", () => {
    expect(escapeHtml("<div>Hello</div>")).toBe("&lt;div&gt;Hello&lt;/div&gt;");
  });

  it("should escape double quotes", () => {
    expect(escapeHtml('He said "Hello"')).toBe('He said &quot;Hello&quot;');
  });

  it("should escape single quotes", () => {
    expect(escapeHtml("It's Dipendu")).toBe("It&#039;s Dipendu");
  });

  it("should escape mixed HTML-sensitive characters together", () => {
    const input = '<div class="test">Tom & Jerry\'s</div>';
    const expected = "&lt;div class=&quot;test&quot;&gt;Tom &amp; Jerry&#039;s&lt;/div&gt;";
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should return an empty string for falsey inputs", () => {
    expect(escapeHtml("")).toBe("");
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });
});