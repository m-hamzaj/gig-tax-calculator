/**
 * Builds a minimal, valid .ics (iCalendar) file as a plain string -- pure
 * and framework-free so it's testable without a browser/DOM, and so the
 * "Add to calendar" button in QuarterlyDeadlines.tsx only needs to wrap
 * this string in a Blob client-side. No server round trip, no data
 * stored anywhere -- consistent with this project's stateless principle.
 */

interface DeadlineEvent {
  label: string;
  /** ISO date string, YYYY-MM-DD. */
  dueDate: string;
}

function toIcsDate(iso: string): string {
  return iso.replaceAll("-", "");
}

function addOneDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function buildQuarterlyDeadlinesIcs(events: DeadlineEvent[], taxYear: number): string {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gig Tax Estimator//Quarterly Deadlines//EN"];

  events.forEach((event, i) => {
    lines.push(
      "BEGIN:VEVENT",
      `UID:gig-tax-estimator-${taxYear}-q${i + 1}@gig-tax-calculator`,
      `DTSTART;VALUE=DATE:${toIcsDate(event.dueDate)}`,
      `DTEND;VALUE=DATE:${toIcsDate(addOneDay(event.dueDate))}`,
      `SUMMARY:${event.label} ${taxYear} estimated tax due`,
      "DESCRIPTION:Estimated self-employment/1099 quarterly tax payment due to the IRS.",
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  // iCalendar requires CRLF line endings.
  return lines.join("\r\n");
}
