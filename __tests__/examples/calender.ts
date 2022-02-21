export const schema = {
  $id: "https://example.com/calendar.schema.json",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  description: "A representation of an event",
  type: "object",
  required: ["dtstart", "summary"],
  properties: {
    dtstart: {
      type: "string",
      description: "Event starting time",
    },
    dtend: {
      type: "string",
      description: "Event ending time",
    },
    summary: {
      type: "string",
    },
    location: {
      type: "string",
    },
    url: {
      type: "string",
    },
    duration: {
      type: "string",
      description: "Event duration",
    },
    rdate: {
      type: "string",
      description: "Recurrence date",
    },
    rrule: {
      type: "string",
      description: "Recurrence rule",
    },
    category: {
      type: "string",
    },
    description: {
      type: "string",
    },
    geo: {
      $ref: "https://example.com/geographical-location.schema.json",
    },
  },
} as const;
