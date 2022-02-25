import type {
  InferJSONSchemaType,
  InferJSONSchemaVersionDraft2020_12,
} from "./json-schema-2020-12";
import type { InferJSONSchemaVersionDraft04 } from "./json-schema-draft-04";
import type { InferJSONSchemaVersionDraft06 } from "./json-schema-draft-06";
import type { InferJSONSchemaVersionDraft07 } from "./json-schema-draft-07";
import type { Mutable } from "./utilities";

export {
  InferJSONSchemaVersionDraft2020_12,
  InferJSONSchemaVersionDraft04,
  InferJSONSchemaVersionDraft06,
  InferJSONSchemaVersionDraft07,
};
export type ResolveJSONSchemaInferrerBy$Schema<T, R> =
  InferJSONSchemaVersionDraft2020_12<
    T,
    R,
    InferJSONSchemaVersionDraft07<
      T,
      R,
      InferJSONSchemaVersionDraft04<T, R, InferJSONSchemaType<T, R, never>>
    >
  >;

export type InferJSONSchema<T, R = {}> = ResolveJSONSchemaInferrerBy$Schema<
  Mutable<T>,
  Mutable<R>
>;
