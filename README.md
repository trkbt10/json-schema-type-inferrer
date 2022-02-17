# json-schema-type-inferrer

Infer the type from the JSON Schema.

## Usage

Install `npm install git+https://github.com/trkbt10/json-schema-type-inferrer.git`

```typescript
import type { InferJSONSchema } from "@trkbt10/json-schema-type-inferrer";

const objectSchema = {
  type: "object",
  properties: {
    item: {
      type: "string",
    },
  },
  required: ["item"],
} as const;
const object: InferJSONSchema<typeof objectSchema> = {
  item: "value",
};
```

## Examples

### String

```typescript
const stringSchema = {
  type: "string",
} as const;
const string: InferJSONSchema<typeof stringSchema> = "string"; // string
```

### Numeric

```typescript
const integerSchema = {
  type: "integer",
} as const;
const integer: InferJSONSchema<typeof integerSchema> = 1; // number

const numberSchema = {
  type: "number",
} as const;
const number: InferJSONSchema<typeof numberSchema> = 1; // number
```

### Array

```typescript
const arraySchema = {
  type: "array",
  items: {
    type: "string",
  },
} as const;
const array: InferJSONSchema<typeof arraySchema> = ["item"]; // string[]
```

#### Tuple

```typescript
const arraySchema = {
  type: "array",
  items: [
    {
      type: "string",
    },
    {
      type: "string",
    },
  ],
} as const;
const array: InferJSONSchema<typeof arraySchema> = ["item", "item2"]; // [string,string]
```

### Object

```typescript
const objectSchema = {
  type: "object",
  properties: {
    item: {
      type: "string",
    },
    nullable: {
      type: "number",
      nullable: true,
    },
  },
  required: ["item"],
} as const;
const object: InferJSONSchema<typeof objectSchema> = {
  item: "value",
}; // { item: string; nullable?: number | null }
```

#### AdditionalProperties

```typescript
const additionalProperties = {
  type: "object",
  properties: {
    item: {
      type: "string",
    },
  },
  additionalProperties: {
    type: "string",
  },
  required: ["item"],
} as const;

const object: InferJSONSchema<typeof additionalProperties> = {
  item: "value",
}; //  { item: string; } & {} & { [key: string]: string;  }
```
