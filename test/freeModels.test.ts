import { test } from "node:test";
import assert from "node:assert/strict";
import { pickFreeModels } from "../src/lib/freeModels.ts";

const free = { prompt: "0", completion: "0" };

test("keeps only free text chat models, capped", () => {
  const ids = pickFreeModels([
    { id: "openrouter/free", pricing: free },
    { id: "a/one:free", pricing: free, architecture: { output_modalities: ["text"] } },
    { id: "a/paid", pricing: { prompt: "0.1", completion: "0.2" } },
    { id: "a/was-free:free", pricing: { prompt: "0.1", completion: "0" } },
    { id: "a/image:free", pricing: free, architecture: { output_modalities: ["image"] } },
    { id: "nvidia/content-safety:free", pricing: free },
    { id: "a/two:free", pricing: free },
    { id: "a/three:free", pricing: free },
    { id: "a/four:free", pricing: free },
    { id: "a/five:free", pricing: free },
  ]);
  assert.deepEqual(ids, ["a/one:free", "a/two:free", "a/three:free", "a/four:free"]);
});
