/**
 * Copyright 2024 The Fire Company
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */

import { embedderRef, Genkit } from "genkit";

import { z } from "zod";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
  InvokeModelCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

export const TextEmbeddingConfigSchema = z.object({
  dimensions: z.number().optional(),
});

export type TextEmbeddingGeckoConfig = z.infer<
  typeof TextEmbeddingConfigSchema
>;

export const TextEmbeddingInputSchema = z.string();

export const amazonTitanEmbedTextV2 = embedderRef({
  name: "aws-bedrock/amazon.titan-embed-text-v2:0",
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 512,
    label: "Amazon - titan-embed-text-v2:0",
    supports: {
      input: ["text"],
    },
  },
});

export const SUPPORTED_EMBEDDING_MODELS: Record<string, any> = {
  "amazon.titan-embed-text-v2:0": amazonTitanEmbedTextV2,
};

export function awsBedrockEmbedder(
  name: string,
  ai: Genkit,
  client: BedrockRuntimeClient,
) {
  const model = SUPPORTED_EMBEDDING_MODELS[name];

  return ai.defineEmbedder(
    {
      info: model.info!,
      configSchema: TextEmbeddingConfigSchema,
      name: model.name,
    },
    async (input, options) => {
      const body: InvokeModelCommandInput = {
        modelId: name,
        contentType: "application/json",
        body: JSON.stringify({
          inputText: input.map((d) => d.text).join(","),
          dimensions: options?.dimensions,
        }),
      };

      const command = new InvokeModelCommand(body);

      const response = (await client.send(command)) as InvokeModelCommandOutput;
      const embeddings = new TextDecoder().decode(response.body)
        ? JSON.parse(new TextDecoder().decode(response.body))
        : [];
      return {
        embeddings: [
          {
            embedding: embeddings.embedding as number[],
          },
        ],
      };
    },
  );
}
