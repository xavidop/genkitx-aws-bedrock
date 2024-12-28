/**
 * Copyright 2024 Xavier Portilla Edo
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

import {
  Message,
  GenerateRequest,
  GenerationCommonConfigSchema,
  MessageData,
  Part,
  Role,
  ToolRequestPart,
  Genkit,
  ModelReference,
} from "genkit";

import {
  ModelResponseData,
  ModelAction,
  modelRef,
  ToolDefinition,
} from "genkit/model";

import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
  Message as AwsMessge,
  ContentBlock,
  ConverseStreamCommandOutput,
  ConverseCommandOutput,
  ToolUseBlock,
  ConverseCommandInput,
  ConverseStreamCommandInput,
  SystemContentBlock,
  ContentBlockDelta,
  ImageFormat,
  StopReason,
  Tool,
} from "@aws-sdk/client-bedrock-runtime";

export const amazonNovaProV1 = modelRef({
  name: "aws-bedrock/amazon.nova-pro-v1:0",
  info: {
    versions: ["amazon.nova-pro-v1:0"],
    label: "Amazon - Nova Pro V1",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const amazonNovaLiteV1 = modelRef({
  name: "aws-bedrock/amazon.nova-lite-v1:0",
  info: {
    versions: ["amazon.nova-lite-v1:0"],
    label: "Amazon - Nova Lite V1",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const amazonNovaMicroV1 = modelRef({
  name: "aws-bedrock/amazon.nova-micro-v1:0",
  info: {
    versions: ["amazon.nova-micro-v1:0"],
    label: "Amazon - Nova Micro V1",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const amazonTitanTextG1PremierV1 = modelRef({
  name: "aws-bedrock/amazon.titan-text-premier-v1:0",
  info: {
    versions: ["amazon.titan-text-premier-v1:0"],
    label: "Amazon - Titan Text Premier G1 V1",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const amazonTitanTextG1ExpressV1 = modelRef({
  name: "aws-bedrock/amazon.titan-text-express-v1",
  info: {
    versions: ["amazon.titan-text-express-v1"],
    label: "Amazon - Titan Text Express G1 V1",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const amazonTitanTextG1LiteV1 = modelRef({
  name: "aws-bedrock/amazon.titan-text-lite-v1",
  info: {
    versions: ["amazon.titan-text-lite-v1"],
    label: "Amazon - Titan Text Lite G1 V1",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandRV1 = modelRef({
  name: "aws-bedrock/cohere.command-r-v1:0",
  info: {
    versions: ["cohere.command-r-v1:0"],
    label: "Cohere - Command R",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandRPlusV1 = modelRef({
  name: "aws-bedrock/cohere.command-r-plus-v1:0",
  info: {
    versions: ["cohere.command-r-plus-v1:0"],
    label: "Cohere - Command R+",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandLightV14 = modelRef({
  name: "aws-bedrock/cohere.command-light-text-v14",
  info: {
    versions: ["cohere.command-light-text-v14"],
    label: "Cohere - Command Light V14",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const cohereCommandV14 = modelRef({
  name: "aws-bedrock/cohere.command-text-v14",
  info: {
    versions: ["cohere.command-text-v14"],
    label: "Cohere - Command V14",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const anthropicClaude35HaikuV1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-3-5-haiku-20241022-v1:0`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-3-5-haiku-20241022-v1:0`],
      label: "Anthropic - Claude 3.5 Haiku V1",
      supports: {
        multiturn: true,
        tools: true,
        media: false,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude3HaikuV1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-3-haiku-20240307-v1:0`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-3-haiku-20240307-v1:0`],
      label: "Anthropic - Claude 3 Haiku V1",
      supports: {
        multiturn: true,
        tools: true,
        media: false,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude3OpusV1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-3-opus-20240229-v1:0`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-3-opus-20240229-v1:0`],
      label: "Anthropic - Claude 3 Opus V1",
      supports: {
        multiturn: true,
        tools: true,
        media: false,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude35SonnetV2 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-3-5-sonnet-20241022-v2:0`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-3-5-sonnet-20241022-v2:0`],
      label: "Anthropic - Claude 3.5 Sonnet V2",
      supports: {
        multiturn: true,
        tools: true,
        media: true,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude35SonnetV1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-3-5-sonnet-20240620-v1:0`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-3-5-sonnet-20240620-v1:0`],
      label: "Anthropic - Claude 3.5 Sonnet V1",
      supports: {
        multiturn: true,
        tools: true,
        media: true,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude3SonnetV1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-3-sonnet-20240229-v1:0`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-3-sonnet-20240229-v1:0`],
      label: "Anthropic - Claude 3 Sonnet V1",
      supports: {
        multiturn: true,
        tools: true,
        media: true,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude21V1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-v2:1`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-v2:1`],
      label: "Anthropic - Claude 2.1 V1",
      supports: {
        multiturn: true,
        tools: true,
        media: false,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaude2V1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-v2`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-v2`],
      label: "Anthropic - Claude 2 V1",
      supports: {
        multiturn: true,
        tools: true,
        media: false,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const anthropicClaudeInstantV1 = (
  infrenceRegion: string = "us",
): ModelReference<typeof GenerationCommonConfigSchema> => {
  return modelRef({
    name: `aws-bedrock/${infrenceRegion}.anthropic.claude-instant-v1`,
    info: {
      versions: [`${infrenceRegion}.anthropic.claude-instant-v1`],
      label: "Anthropic - Claude Instant V1",
      supports: {
        multiturn: true,
        tools: true,
        media: false,
        systemRole: true,
        output: ["text", "json"],
      },
    },
    configSchema: GenerationCommonConfigSchema,
  });
};

export const mistralLarge2402V1 = modelRef({
  name: "aws-bedrock/mistral.mistral-large-2402-v1:0",
  info: {
    versions: ["mistral.mistral-large-2402-v1:0"],
    label: "Mistral - Large (24.02)",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistralSmall2402V1 = modelRef({
  name: "aws-bedrock/mistral.mistral-small-2402-v1:0",
  info: {
    versions: ["mistral.mistral-small-2402-v1:0"],
    label: "Mistral - Small (24.02)",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistral7BInstructV02 = modelRef({
  name: "aws-bedrock/mistral.mistral-7b-instruct-v0:2",
  info: {
    versions: ["mistral.mistral-7b-instruct-v0:2"],
    label: "Mistral - 7B Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const mistral8x7BInstructV01 = modelRef({
  name: "aws-bedrock/mistral.mixtral-8x7b-instruct-v0:1",
  info: {
    versions: ["mistral.mixtral-8x7b-instruct-v0:1"],
    label: "Mistral - 8x7B Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21Jamba15LargeV1 = modelRef({
  name: "aws-bedrock/ai21.jamba-1-5-large-v1:0",
  info: {
    versions: ["ai21.jamba-1-5-large-v1:0"],
    label: "AI21 - Jambda 1.5 Large",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21Jamba15MiniV1 = modelRef({
  name: "aws-bedrock/ai21.jamba-1-5-mini-v1:0",
  info: {
    versions: ["ai21.jamba-1-5-mini-v1:0"],
    label: "AI21 - Jambda 1.5 Mini",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21JambaInstructV1 = modelRef({
  name: "aws-bedrock/ai21.jamba-instruct-v1:0",
  info: {
    versions: ["ai21.jamba-instruct-v1:0"],
    label: "AI21 - Jambda Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21Jurassic2MidV1 = modelRef({
  name: "aws-bedrock/ai21.j2-mid-v1",
  info: {
    versions: ["ai21.j2-mid-v1"],
    label: "AI21 - Jurassic-2 Mid",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const ai21Jurassic2UltraV1 = modelRef({
  name: "aws-bedrock/ai21.j2-ultra-v1",
  info: {
    versions: ["ai21.j2-ultra-v1"],
    label: "AI21 - Jurassic-2 Ultra",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3370BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-3-70b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-3-70b-instruct-v1:0"],
    label: "Meta - Llama 3.3 70b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3211BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-2-11b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-2-11b-instruct-v1:0"],
    label: "Meta - Llama 3.2 11b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama321BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-2-1b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-2-1b-instruct-v1:0"],
    label: "Meta - Llama 3.2 1b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama323BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-2-3b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-2-3b-instruct-v1:0"],
    label: "Meta - Llama 3.2 3b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3290BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-2-90b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-2-90b-instruct-v1:0"],
    label: "Meta - Llama 3.2 90b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: true,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama3170BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-1-70b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-1-70b-instruct-v1:0"],
    label: "Meta - Llama 3.1 70b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama318BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-1-8b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-1-8b-instruct-v1:0"],
    label: "Meta - Llama 3.1 8b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama370BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-70b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-70b-instruct-v1:0"],
    label: "Meta - Llama 3 70b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const metaLlama38BInstruct = modelRef({
  name: "aws-bedrock/meta.llama3-8b-instruct-v1:0",
  info: {
    versions: ["meta.llama3-8b-instruct-v1:0"],
    label: "Meta - Llama 3 8b Instruct",
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ["text", "json"],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});

export const SUPPORTED_AWS_BEDROCK_MODELS = (
  infrenceRegion: string = "us",
): Record<string, any> => {
  return {
    "amazon.nova-pro-v1:0": amazonNovaProV1,
    "amazon.nova-lite-v1:0": amazonNovaLiteV1,
    "amazon.nova-micro-v1:0": amazonNovaMicroV1,
    "amazon.titan-text-premier-v1:0": amazonTitanTextG1PremierV1,
    "amazon.titan-text-express-v1": amazonTitanTextG1ExpressV1,
    "amazon.titan-text-lite-v1": amazonTitanTextG1LiteV1,
    "cohere.command-r-v1:0": cohereCommandRV1,
    "cohere.command-r-plus-v1:0": cohereCommandRPlusV1,
    "cohere.command-light-text-v14": cohereCommandLightV14,
    "cohere.command-text-v14": cohereCommandV14,
    "mistral.mistral-large-2402-v1:0": mistralLarge2402V1,
    "mistral.mistral-small-2402-v1:0": mistralSmall2402V1,
    "mistral.mistral-7b-instruct-v0:2": mistral7BInstructV02,
    "mistral.mixtral-8x7b-instruct-v0:1": mistral8x7BInstructV01,
    "ai21.jamba-1-5-large-v1:0": ai21Jamba15LargeV1,
    "ai21.jamba-1-5-mini-v1:0": ai21Jamba15MiniV1,
    "ai21.jamba-instruct-v1:0": ai21JambaInstructV1,
    "ai21.j2-mid-v1": ai21Jurassic2MidV1,
    "ai21.j2-ultra-v1": ai21Jurassic2UltraV1,
    "meta.llama3-3-70b-instruct-v1:0": metaLlama3370BInstruct,
    "meta.llama3-2-11b-instruct-v1:0": metaLlama3211BInstruct,
    "meta.llama3-2-1b-instruct-v1:0": metaLlama321BInstruct,
    "meta.llama3-2-3b-instruct-v1:0": metaLlama323BInstruct,
    "meta.llama3-2-90b-instruct-v1:0": metaLlama3290BInstruct,
    "meta.llama3-1-70b-instruct-v1:0": metaLlama3170BInstruct,
    "meta.llama3-1-8b-instruct-v1:0": metaLlama318BInstruct,
    "meta.llama3-70b-instruct-v1:0": metaLlama370BInstruct,
    "meta.llama3-8b-instruct-v1:0": metaLlama38BInstruct,
    [`${infrenceRegion}.anthropic.claude-3-5-haiku-20241022-v1:0`]:
      anthropicClaude35HaikuV1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-3-5-sonnet-20241022-v2:0`]:
      anthropicClaude35SonnetV2(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-3-5-sonnet-20240620-v1:0`]:
      anthropicClaude35SonnetV1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-3-opus-20240229-v1:0`]:
      anthropicClaude3OpusV1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-3-haiku-20240307-v1:0`]:
      anthropicClaude3HaikuV1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-3-sonnet-20240229-v1:0`]:
      anthropicClaude3SonnetV1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-v2:1`]:
      anthropicClaude21V1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-v2`]:
      anthropicClaude2V1(infrenceRegion),
    [`${infrenceRegion}.anthropic.claude-instant-v1`]:
      anthropicClaudeInstantV1(infrenceRegion),
  };
};

function toAwsBedrockbRole(role: Role): string {
  switch (role) {
    case "user":
      return "user";
    case "model":
      return "assistant";
    case "system":
      return "system";
    case "tool":
      return "tool";
    default:
      throw new Error(`role ${role} doesn't map to an AWS Bedrock role.`);
  }
}

function toAwsBedrockTool(tool: ToolDefinition): Tool {
  return {
    toolSpec: {
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema ? { json: tool.inputSchema } : undefined,
    },
  };
}
const regex = /data:.*base64,/;
const getDataPart = (dataUrl: string) => dataUrl.replace(regex, "");

export function toAwsBedrockTextAndMedia(
  part: Part,
  imageFormat: ImageFormat,
): ContentBlock {
  if (part.text) {
    return {
      text: part.text,
    };
  } else if (part.media) {
    const imageBuffer = new Uint8Array(
      Buffer.from(getDataPart(part.media.url), "base64"),
    );

    return {
      image: {
        source: { bytes: imageBuffer },
        format: imageFormat,
      },
    };
  }
  throw Error(
    `Unsupported genkit part fields encountered for current message role: ${part}.`,
  );
}

export function getSystemMessage(
  messages: MessageData[],
): SystemContentBlock[] | null {
  for (const message of messages) {
    if (message.role === "system") {
      return [
        {
          text: message.content[0].text!,
        },
      ];
    }
  }
  return null;
}

export function toAwsBedrockMessages(
  messages: MessageData[],
  imageFormat: ImageFormat = "png",
): AwsMessge[] {
  const awsBedrockMsgs: AwsMessge[] = [];
  for (const message of messages) {
    const msg = new Message(message);
    const role = toAwsBedrockbRole(message.role);
    switch (role) {
      case "system": {
        break;
      }
      case "user": {
        const textAndMedia = msg.content.map((part) =>
          toAwsBedrockTextAndMedia(part, imageFormat),
        );
        if (textAndMedia.length > 1) {
          awsBedrockMsgs.push({
            role: role,
            content: textAndMedia,
          });
        } else {
          awsBedrockMsgs.push({
            role: role,
            content: [
              {
                text: msg.text,
              },
            ],
          });
        }
        break;
      }
      case "assistant": {
        // Request to call the tool

        const toolCalls: ToolUseBlock[] = msg.content
          .filter((part) => part.toolRequest)
          .map((part) => {
            if (!part.toolRequest) {
              throw Error(
                "Mapping genkit message to openai tool call content part but message.toolRequest not provided.",
              );
            }
            return {
              toolUseId: part.toolRequest.ref || "",
              name: part.toolRequest.name,
              input: part.toolRequest.input as any,
            };
          });
        if (toolCalls?.length > 0) {
          awsBedrockMsgs.push({
            role: role,
            content: toolCalls.map((toolCall) => ({ toolUse: toolCall })),
          });
        } else {
          awsBedrockMsgs.push({
            role: role,
            content: [
              {
                text: msg.text,
              },
            ],
          });
        }
        break;
      }
      case "tool": {
        // result of the tool
        const toolResponseParts = msg.toolResponseParts();

        toolResponseParts.map((part) => {
          const toolresult: AwsMessge = {
            role: "user",
            content: [
              {
                toolResult: {
                  toolUseId: part.toolResponse.ref,
                  content: [
                    {
                      json: {
                        result: part.toolResponse.output as {
                          [key: string]: any;
                        },
                      },
                    },
                  ],
                },
              },
            ],
          };
          awsBedrockMsgs.push(toolresult);
        });
        break;
      }
      default:
        throw new Error("unrecognized role");
    }
  }
  return awsBedrockMsgs;
}

const finishReasonMap: Record<
  NonNullable<string>,
  ModelResponseData["finishReason"]
> = {
  max_tokens: "length",
  end_turn: "stop",
  stop_sequence: "stop",
  tool_use: "stop",
  content_filtered: "blocked",
  guardrail_intervened: "blocked",
};

function fromAwsBedrockToolCall(toolCall: ToolUseBlock) {
  if (!("toolUseId" in toolCall)) {
    throw Error(
      `Unexpected AWS chunk choice. tool_calls was provided but one or more tool_calls is missing.`,
    );
  }
  const f = toolCall;
  return [
    {
      toolRequest: {
        name: f.name,
        ref: toolCall.toolUseId,
        input: f.input,
      },
    },
  ];
}

function fromAwsBedrockChoice(
  choice: ConverseCommandOutput,
  jsonMode = false,
): ModelResponseData {
  const toolRequestParts =
    choice.output?.message?.content && choice.output.message.content[0].toolUse
      ? fromAwsBedrockToolCall(choice.output.message.content[0].toolUse)
      : [];
  return {
    finishReason:
      "stopReason" in choice ? finishReasonMap[choice.stopReason!] : "other",
    message: {
      role: "model",
      content:
        Array.isArray(toolRequestParts) && toolRequestParts.length > 0
          ? (toolRequestParts as ToolRequestPart[])
          : [
              jsonMode
                ? {
                    data: choice.output?.message?.content?.[0]?.text
                      ? JSON.parse(
                          choice.output.message.content?.[0]?.text ?? "{}",
                        )
                      : {},
                  }
                : { text: choice.output?.message?.content?.[0]?.text || "" },
            ],
    },
    custom: {},
  };
}

function fromAwsBedrockChunkChoice(
  choice?: ContentBlockDelta,
  finishReasonInput?: string,
): ModelResponseData {
  return {
    finishReason: finishReasonInput
      ? finishReasonMap[finishReasonInput] || "other"
      : "unknown",
    message: {
      role: "model",
      content: [{ text: choice?.text ?? "" }],
    },
    custom: {},
  };
}

export function toAwsBedrockRequestBody(
  modelName: string,
  request: GenerateRequest<typeof GenerationCommonConfigSchema>,
  inferenceRegion: string,
) {
  const model = SUPPORTED_AWS_BEDROCK_MODELS(inferenceRegion)[modelName];
  if (!model) throw new Error(`Unsupported model: ${modelName}`);
  const awsBedrockMessages = toAwsBedrockMessages(request.messages);

  const awsBedrockSystemMessage = getSystemMessage(request.messages) || [];

  const jsonMode =
    request.output?.format === "json" ||
    request.output?.contentType === "application/json";

  const textMode =
    request.output?.format === "text" ||
    request.output?.contentType === "plain/text";

  const response_format = request.output?.format
    ? request.output?.format
    : request.output?.contentType;
  if (jsonMode && model.info.supports?.output?.includes("json")) {
    awsBedrockMessages?.push({
      content: [
        {
          text: "You write JSON objects based on the given instructions. Please generate only the JSON output. DO NOT provide any preamble.",
        },
      ],
      role: "user",
    });
  } else if (
    (textMode && model.info.supports?.output?.includes("text")) ||
    model.info.supports?.output?.includes("text")
  ) {
    awsBedrockMessages?.push({
      content: [
        {
          text: "You write objects in plain text. DO NOT provide any preamble.",
        },
      ],
      role: "user",
    });
  } else {
    throw new Error(
      `${response_format} format is not supported for GPT models currently`,
    );
  }
  const modelString = (request.config?.version ||
    model.version ||
    modelName) as string;
  const body: ConverseCommandInput | ConverseStreamCommandInput = {
    messages: awsBedrockMessages,
    system: awsBedrockSystemMessage as SystemContentBlock[] | undefined,
    toolConfig: request.tools
      ? { tools: request.tools.map(toAwsBedrockTool) }
      : undefined,
    modelId: modelString,
    inferenceConfig: {
      maxTokens: request.config?.maxOutputTokens,
      temperature: request.config?.temperature,
      topP: request.config?.topP,
      //n: request.candidates,
      stopSequences: request.config?.stopSequences,
    },
  };

  return body;
}

export function awsBedrockModel(
  name: string,
  client: BedrockRuntimeClient,
  ai: Genkit,
  inferenceRegion: string,
): ModelAction<typeof GenerationCommonConfigSchema> {
  const modelId = `aws-bedrock/${name}`;
  const model = SUPPORTED_AWS_BEDROCK_MODELS(inferenceRegion)[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return ai.defineModel(
    {
      name: modelId,
      ...model.info,
      configSchema:
        SUPPORTED_AWS_BEDROCK_MODELS(inferenceRegion)[name].configSchema,
    },
    async (request, streamingCallback) => {
      let response: ConverseStreamCommandOutput | ConverseCommandOutput;
      const body = toAwsBedrockRequestBody(name, request, inferenceRegion);
      if (streamingCallback) {
        const command = new ConverseStreamCommand(body);
        response = await client.send(command);

        for await (const event of response.stream!) {
          let finishReason: StopReason | undefined;
          if (event.messageStop) {
            finishReason = event.messageStop!.stopReason!;
            const c = fromAwsBedrockChunkChoice(undefined, finishReason);
            streamingCallback({
              index: 0,
              content: [{ ...c, custom: c.custom as Record<string, any> }],
            });
          }

          if (event.contentBlockDelta) {
            const delta = event.contentBlockDelta.delta as ContentBlockDelta;
            const c = fromAwsBedrockChunkChoice(delta, finishReason);
            streamingCallback({
              index: 0,
              content: [{ ...c, custom: c.custom as Record<string, any> }],
            });
          }
        }
      } else {
        const command = new ConverseCommand(body);
        response = await client.send(command);
      }
      return {
        message:
          "output" in response
            ? fromAwsBedrockChoice(response, request.output?.format === "json")
                .message
            : { role: "model", content: [] },
        usage: {
          inputTokens: "usage" in response ? response.usage?.inputTokens : 0,
          outputTokens: "usage" in response ? response.usage?.outputTokens : 0,
          totalTokens: "usage" in response ? response.usage?.totalTokens : 0,
        },
        custom: response,
      };
    },
  );
}
