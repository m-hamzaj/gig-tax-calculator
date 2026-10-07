import { describe, expect, it } from "vitest";
import { buildQuarterlyDeadlinesIcs } from "../build-ics";

describe("buildQuarterlyDeadlinesIcs", () => {
  it("produces a valid-shaped VCALENDAR with one VEVENT per due date", () => {
    const ics = buildQuarterlyDeadlinesIcs(
      [
        { label: "Q1", dueDate: "2026-04-15" },
        { label: "Q2", dueDate: "2026-06-15" },
      ],
      2026
    );

    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics.endsWith("END:VCALENDAR")).toBe(true);
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics).toContain("DTSTART;VALUE=DATE:20260415");
    // DTEND is the day after DTSTART, per the iCalendar all-day-event convention.
    expect(ics).toContain("DTEND;VALUE=DATE:20260416");
    expect(ics).toContain("SUMMARY:Q1 2026 estimated tax due");
  });

  it("rolls the end-date day over correctly across a month/year boundary", () => {
    const ics = buildQuarterlyDeadlinesIcs([{ label: "Q4", dueDate: "2026-12-31" }], 2026);
    expect(ics).toContain("DTSTART;VALUE=DATE:20261231");
    expect(ics).toContain("DTEND;VALUE=DATE:20270101");
  });
});
