import type { InferJSONSchemaVersionDraft04 } from "./json-schema-draft-04";
import type { Mutable } from "./utilities";
import type {
  InferJSONSchemaVersionDraft2020_12,
  InferJSONSchemaType,
} from "./json-schema-2020-12";
import type { InferJSONSchemaVersionDraft06 } from "./json-schema-draft-06";

export {
  InferJSONSchemaVersionDraft2020_12,
  InferJSONSchemaVersionDraft04,
  InferJSONSchemaVersionDraft06,
};
export type InferJSONSchema<T> = InferJSONSchemaVersionDraft2020_12<
  T,
  InferJSONSchemaVersionDraft04<T, InferJSONSchemaType<Mutable<T>, Mutable<T>>>
>;
