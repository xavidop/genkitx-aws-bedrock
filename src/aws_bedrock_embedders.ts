// /**
//  * Copyright 2024 The Fire Company
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
// /* eslint-disable  @typescript-eslint/no-explicit-any */

// import { embedderRef, Genkit } from "genkit";
// import ModelClient, {
//   GetEmbeddings200Response,
//   GetEmbeddingsParameters,
// } from "@azure-rest/ai-inference";
// import { z } from "zod";
// import { type PluginOptions } from "./index.js";
// import { AzureKeyCredential } from "@azure/core-auth";

// export const TextEmbeddingConfigSchema = z.object({
//   dimensions: z.number().optional(),
//   encodingFormat: z.union([z.literal("float"), z.literal("base64")]).optional(),
// });

// export type TextEmbeddingGeckoConfig = z.infer<
//   typeof TextEmbeddingConfigSchema
// >;

// export const TextEmbeddingInputSchema = z.string();

// export const openAITextEmbedding3Small = embedderRef({
//   name: "github/text-embedding-3-small",
//   configSchema: TextEmbeddingConfigSchema,
//   info: {
//     dimensions: 1536,
//     label: "OpenAI - Text-embedding-3-small",
//     supports: {
//       input: ["text"],
//     },
//   },
// });

// export const SUPPORTED_EMBEDDING_MODELS: Record<string, any> = {
//   "text-embedding-3-small": openAITextEmbedding3Small,
// };

// export function awsBedrockEmbedder(
//   name: string,
//   ai: Genkit,
//   options?: PluginOptions,
// ) {
//   const token = options?.githubToken || process.env.GITHUB_TOKEN;
//   let endpoint = options?.endpoint || process.env.GITHUB_ENDPOINT;
//   if (!token) {
//     throw new Error(
//       "Please pass in the TOKEN key or set the GITHUB_TOKEN environment variable",
//     );
//   }
//   if (!endpoint) {
//     endpoint = "https://models.inference.ai.azure.com";
//   }

//   const client = ModelClient(endpoint, new AzureKeyCredential(token));
//   const model = SUPPORTED_EMBEDDING_MODELS[name];

//   return ai.defineEmbedder(
//     {
//       info: model.info!,
//       configSchema: TextEmbeddingConfigSchema,
//       name: model.name,
//     },
//     async (input, options) => {
//       const body = {
//         body: {
//           model: name,
//           input: input.map((d) => d.text),
//           dimensions: options?.dimensions,
//           encoding_format: options?.encodingFormat,
//         },
//       } as GetEmbeddingsParameters;
//       const embeddings = (await client
//         .path("/embeddings")
//         .post(body)) as GetEmbeddings200Response;
//       return {
//         embeddings: embeddings.body.data.map((d) => ({
//           embedding: Array.isArray(d.embedding) ? d.embedding : [],
//         })),
//       };
//     },
//   );
// }
