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
} from "genkit";

import {
  ModelResponseData,
  ModelAction,
  modelRef,
  //ToolDefinition,
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
} from "@aws-sdk/client-bedrock-runtime";

export const amazonNovaProV1 = modelRef({
  name: "aws-bedrock/amazon.nova-pro-v1:0",
  info: {
    versions: ["amazon.nova-pro-v1:0"],
    label: "Amazon - Nova Pro V1",
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

export const anthropicClaude35HaikuV1 = modelRef({
  name: "aws-bedrock/us.anthropic.claude-3-5-haiku-20241022-v1:0",
  info: {
    versions: ["us.anthropic.claude-3-5-haiku-20241022-v1:0"],
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

export const anthropicClaude35SonnetV1 = modelRef({
  name: "aws-bedrock/us.anthropic.claude-3-5-sonnet-20241022-v2:0",
  info: {
    versions: ["us.anthropic.claude-3-5-sonnet-20241022-v2:0"],
    label: "Anthropic - Claude 3.5 Haiku V1",
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

export const SUPPORTED_AWS_BEDROCK_MODELS: Record<string, any> = {
  "amazon.nova-pro-v1:0": amazonNovaProV1,
  "us.anthropic.claude-3-5-haiku-20241022-v1:0": anthropicClaude35HaikuV1,
  "us.anthropic.claude-3-5-sonnet-20241022-v2:0": anthropicClaude35SonnetV1,
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
      throw new Error(`role ${role} doesn't map to an AWS Bedorck role.`);
  }
}

// function toAwsBedrockTool(tool: ToolDefinition): ToolUseBlock {
//   return {
//     toolUseId: tool.name, // or any appropriate value for toolUseId
//     name: tool.name,
//     input: tool.inputSchema,
//   };
// }
const regex = /data:.*base64,/
const getDataPart = (dataUrl: string) => dataUrl.replace(regex,"");


export function toAwsBedrockTextAndMedia(
  part: Part,
  imageFormat: ImageFormat,
): ContentBlock {
  if (part.text) {
    return {
      text: part.text,
    };
  } else if (part.media) {
    const imageBuffer = new Uint8Array(Buffer.from(getDataPart(part.media.url), "base64"));

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
              input: JSON.stringify(part.toolRequest.input),
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
      // case "tool": {
      //   const toolResponseParts = msg.toolResponseParts();
      //   toolResponseParts.map((part) => {
      //     awsBedrockMsgs.push({
      //       role: role,
      //       tool_call_id: part.toolResponse.ref || "",
      //       content:
      //         typeof part.toolResponse.output === "string"
      //           ? part.toolResponse.output
      //           : JSON.stringify(part.toolResponse.output),
      //     });
      //   });
      //   break;
      // }
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
  return {
    toolRequest: {
      name: f.name,
      ref: toolCall.toolUseId,
      input: f.input ? JSON.parse(f.input as string) : f.input,
    },
  };
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
) {
  const model = SUPPORTED_AWS_BEDROCK_MODELS[modelName];
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
    awsBedrockSystemMessage?.push({
      text: "You write JSON objects based on the given instructions. Please generate only the JSON output. DO NOT provide any preamble.",
    });
  } else if (
    (textMode && model.info.supports?.output?.includes("text")) ||
    model.info.supports?.output?.includes("text")
  ) {
    awsBedrockSystemMessage?.push({
      text: "You write objects in plain text. DO NOT provide any preamble.",
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
    //toolConfig: request.tools?.map(toAwsBedrockTool),
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
): ModelAction<typeof GenerationCommonConfigSchema> {
  const modelId = `aws-bedrock/${name}`;
  const model = SUPPORTED_AWS_BEDROCK_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);

  return ai.defineModel(
    {
      name: modelId,
      ...model.info,
      configSchema: SUPPORTED_AWS_BEDROCK_MODELS[name].configSchema,
    },
    async (request, streamingCallback) => {
      let response: ConverseStreamCommandOutput | ConverseCommandOutput;
      const body = toAwsBedrockRequestBody(name, request);
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
