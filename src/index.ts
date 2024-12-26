import { Genkit } from "genkit";
import { genkitPlugin } from "genkit/plugin";
import {
  BedrockRuntimeClient,
  BedrockRuntimeClientConfig,
} from "@aws-sdk/client-bedrock-runtime";

import {
  awsBedrockModel,
  amazonNovaProV1,
  SUPPORTED_AWS_BEDROCK_MODELS,
} from "./aws_bedrock_llms.js";
import {
  awsBedrockEmbedder,
  amazonTitanEmbedTextV2,
  SUPPORTED_EMBEDDING_MODELS,
} from "./aws_bedrock_embedders.js";

export { amazonNovaProV1 };

export { amazonTitanEmbedTextV2 };

export type PluginOptions = BedrockRuntimeClientConfig;

export function awsBedrock(options?: PluginOptions) {
  return genkitPlugin("aws-bedrock", async (ai: Genkit) => {
    const client = new BedrockRuntimeClient(options || {});

    Object.keys(SUPPORTED_AWS_BEDROCK_MODELS).forEach((name) => {
      awsBedrockModel(name, client, ai);
    });

    Object.keys(SUPPORTED_EMBEDDING_MODELS).forEach((name) =>
      awsBedrockEmbedder(name, ai, client),
    );
  });
}

export default awsBedrock;
