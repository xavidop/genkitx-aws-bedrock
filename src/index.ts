import { Genkit } from "genkit";
import { genkitPlugin } from "genkit/plugin";
import {
  BedrockRuntimeClient,
  BedrockRuntimeClientConfig,
} from "@aws-sdk/client-bedrock-runtime";

import {
  awsBedrockModel,
  amazonNovaProV1,
  amazonNovaLiteV1,
  amazonNovaMicroV1,
  amazonTitanTextG1PremierV1,
  amazonTitanTextG1ExpressV1,
  amazonTitanTextG1LiteV1,
  cohereCommandRV1,
  cohereCommandRPlusV1,
  cohereCommandLightV14,
  cohereCommandV14,
  mistralLarge2402V1,
  mistralSmall2402V1,
  mistral7BInstructV02,
  mistral8x7BInstructV01,
  anthropicClaude35HaikuV1,
  anthropicClaude37SonnetV1,
  anthropicClaude35SonnetV2,
  anthropicClaude3OpusV1,
  anthropicClaude3HaikuV1,
  anthropicClaude3SonnetV1,
  anthropicClaude21V1,
  anthropicClaude2V1,
  anthropicClaudeInstantV1,
  ai21Jamba15LargeV1,
  ai21Jamba15MiniV1,
  ai21JambaInstructV1,
  ai21Jurassic2MidV1,
  ai21Jurassic2UltraV1,
  metaLlama3370BInstruct,
  metaLlama3211BInstruct,
  metaLlama321BInstruct,
  metaLlama323BInstruct,
  metaLlama3290BInstruct,
  metaLlama3170BInstruct,
  metaLlama318BInstruct,
  metaLlama370BInstruct,
  metaLlama38BInstruct,
  SUPPORTED_AWS_BEDROCK_MODELS,
} from "./aws_bedrock_llms.js";
import {
  awsBedrockEmbedder,
  amazonTitanEmbedTextV2,
  amazonTitanEmbedMultimodalV2,
  amazonTitanEmbedTextG1V1,
  cohereEmbedEnglishV3,
  cohereEmbedMultilingualV3,
  SUPPORTED_EMBEDDING_MODELS,
} from "./aws_bedrock_embedders.js";

export {
  amazonNovaProV1,
  amazonNovaLiteV1,
  amazonNovaMicroV1,
  amazonTitanTextG1PremierV1,
  amazonTitanTextG1ExpressV1,
  amazonTitanTextG1LiteV1,
  cohereCommandRV1,
  cohereCommandRPlusV1,
  cohereCommandLightV14,
  cohereCommandV14,
  mistralLarge2402V1,
  mistralSmall2402V1,
  mistral7BInstructV02,
  mistral8x7BInstructV01,
  ai21Jamba15LargeV1,
  ai21Jamba15MiniV1,
  ai21JambaInstructV1,
  ai21Jurassic2MidV1,
  ai21Jurassic2UltraV1,
  metaLlama3370BInstruct,
  metaLlama3211BInstruct,
  metaLlama321BInstruct,
  metaLlama323BInstruct,
  metaLlama3290BInstruct,
  metaLlama3170BInstruct,
  metaLlama318BInstruct,
  metaLlama370BInstruct,
  metaLlama38BInstruct,
  anthropicClaude35HaikuV1,
  anthropicClaude37SonnetV1,
  anthropicClaude35SonnetV2,
  anthropicClaude3OpusV1,
  anthropicClaude3HaikuV1,
  anthropicClaude3SonnetV1,
  anthropicClaude21V1,
  anthropicClaude2V1,
  anthropicClaudeInstantV1,
};

export {
  amazonTitanEmbedTextV2,
  amazonTitanEmbedMultimodalV2,
  amazonTitanEmbedTextG1V1,
  cohereEmbedEnglishV3,
  cohereEmbedMultilingualV3,
};

export type PluginOptions = BedrockRuntimeClientConfig;

export function awsBedrock(options?: PluginOptions) {
  return genkitPlugin("aws-bedrock", async (ai: Genkit) => {
    const client = new BedrockRuntimeClient(options || {});

    const region =
      typeof options?.region === "string"
        ? options.region
        : typeof options?.region === "function"
          ? await options.region()
          : undefined;
    const inferenceRegion = region ? region.substring(0, 2) : "us";

    Object.keys(SUPPORTED_AWS_BEDROCK_MODELS(inferenceRegion)).forEach(
      (name) => {
        awsBedrockModel(name, client, ai, inferenceRegion);
      },
    );

    Object.keys(SUPPORTED_EMBEDDING_MODELS).forEach((name) =>
      awsBedrockEmbedder(name, ai, client),
    );
  });
}

export default awsBedrock;
