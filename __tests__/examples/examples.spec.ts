import { InferJSONSchema } from "../../src/json-schema-type-inferrer";
import { schema } from "./calender";
import { schema as cardSchema } from "./card";
import { schema as geoSchema } from "./geophical";
describe("JSONSchemaDraft04", () => {
  type Calender = InferJSONSchema<typeof schema>;
  type Card = InferJSONSchema<typeof cardSchema>;
  type Geo = InferJSONSchema<typeof geoSchema>;

  it("Calender", () => {
    const calender: Calender = {
      dtstart: "2019-01-01T00:00:00+09:00",
      summary: "summary",
    };
  });
  it("Card", () => {
    const card: Card = {
      familyName: "familyName",
      givenName: "givenName",
    };
  });
  it("geo", () => {
    const geo: Geo = {
      latitude: -1,
      longitude: -1,
    };
  });
});
