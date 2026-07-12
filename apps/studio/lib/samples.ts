export interface Sample {
  key: string
  name: string
  content: string
}

const fruits = {
  fruits: [
    {
      name: "Apple",
      color: "#FF0000",
      details: { type: "Pome", season: "Fall" },
      nutrients: { calories: 52, fiber: "2.4g", vitaminC: "4.6mg" },
    },
    {
      name: "Banana",
      color: "#FFFF00",
      details: { type: "Berry", season: "Year-round" },
      nutrients: { calories: 89, fiber: "2.6g", potassium: "358mg" },
    },
  ],
}

const apiResponse = {
  status: 200,
  ok: true,
  meta: { requestId: "req_8f2c", page: 1, perPage: 20, total: 2 },
  data: [
    {
      id: 101,
      title: "Design system tokens",
      author: { name: "Ada Lovelace", handle: "@ada" },
      tags: ["design", "tokens"],
      published: true,
    },
    {
      id: 102,
      title: "Graph layout algorithms",
      author: { name: "Alan Turing", handle: "@alan" },
      tags: ["graphs", "layout", "d3"],
      published: false,
    },
  ],
}

const config = {
  app: "nodeflow",
  version: "1.4.0",
  theme: { primary: "teal", radius: "large", mode: "auto" },
  features: { export: true, sharing: false, collaborators: 3 },
  limits: { maxNodes: 5000, maxFileSizeKb: 512 },
}

export const SAMPLES: Sample[] = [
  { key: "fruits", name: "Fruits catalog", content: JSON.stringify(fruits, null, 2) },
  { key: "api", name: "API response", content: JSON.stringify(apiResponse, null, 2) },
  { key: "config", name: "App config", content: JSON.stringify(config, null, 2) },
]

export const DEFAULT_JSON = SAMPLES[0].content
