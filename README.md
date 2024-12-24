![Firebase Genkit + AWS Bedrock](https://github.com/xavidop/genkitx-aws-bedrock/blob/main/assets/genkit-aws-bedrock.png?raw=true)

<h1 align="center">
   Firebase Genkit <> AWS Bedrock Plugin
</h1>

<h4 align="center">AWS Bedrock Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="GitHub version" src="https://img.shields.io/github/v/release/xavidop/genkitx-aws-bedrock">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-aws-bedrock">
   <img alt="GitHub License" src="https://img.shields.io/github/license/xavidop/genkitx-aws-bedrock">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/xavidop/genkitx-aws-bedrock?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/xavidop/genkitx-aws-bedrock?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/xavidop/genkitx-aws-bedrock">
</div>

</br>

**`genkitx-aws-bedrock`** is a community plugin for using AWS Bedrock APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Xavier Portilla Edo**](https://github.com/xavidop).

This Genkit plugin allows to use AWS Bedrock through their official APIs.

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-aws-bedrock`
- `pnpm add genkitx-aws-bedrock`

### Versions

if you are using Genkit version `<v0.9.0`, please use the plugin version `v1.9.0`. If you are using Genkit `>=v0.9.0`, please use the plugin version `>=v1.10.0`.

## Usage

### Configuration

To use the plugin, you need to configure it with your GitHub Token key. You can do this by calling the `genkit` function:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-aws-bedrock";

const ai = genkit({
  plugins: [
    github({
      githubToken: '<my-github-token>',
    }),
    model: openAIGpt4o,
  ]
});
```

You can also intialize the plugin in this way if you have set the `GITHUB_TOKEN` environment variable:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-aws-bedrock";

const ai = genkit({
  plugins: [
    github({
      githubToken: '<my-github-token>',
    }),
    model: openAIGpt4o,
  ]
});
```

### Basic examples

The simplest way to call the text generation model is by using the helper function `generate`:

```typescript
import { genkit, z } from 'genkit';
import {github, openAIGpt4o} from "genkitx-aws-bedrock";

// Basic usage of an LLM
const response = await ai.generate({
  prompt: 'Tell me a joke.',
});

console.log(await response.text);
```

### Within a flow

```typescript
// ...configure Genkit (as shown above)...

export const myFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await ai.generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
    });

    return llmResponse.text;
  }
);
```

### Tool use

```typescript
// ...configure Genkit (as shown above)...

const specialToolInputSchema = z.object({ meal: z.enum(["breakfast", "lunch", "dinner"]) });
const specialTool = ai.defineTool(
  {
    name: "specialTool",
    description: "Retrieves today's special for the given meal",
    inputSchema: specialToolInputSchema,
    outputSchema: z.string(),
  },
  async ({ meal }): Promise<string> => {
    // Retrieve up-to-date information and return it. Here, we just return a
    // fixed value.
    return "Baked beans on toast";
  }
);

const result = ai.generate({
  tools: [specialTool],
  prompt: "What's for breakfast?",
});

console.log(result.then((res) => res.text));
```

For more detailed examples and the explanation of other functionalities, refer to the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started).

## Supported models

This plugin supports all currently available **Chat/Completion** and **Embeddings** models from AWS Bedrock. This plugin supports image input and multimodal models.

## API Reference

You can find the full API reference in the [API Reference Documentation](https://xavidop.github.io/genkitx-aws-bedrock/)

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/xavidop/genkitx-aws-bedrock/blob/main/CONTRIBUTING.md).

## Need support?

> [!NOTE]  
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [GitHub Discussions](https://github.com/xavidop/genkitx-aws-bedrock/discussions).

## Credits

This plugin is proudly maintained by Xavier Portilla Edo [**Xavier Portilla Edo**](https://github.com/xavidop).

I got the inspiration, structure and patterns to create this plugin from the [Genkit Community Plugins](https://github.com/TheFireCo/genkit-plugins) repository built by the [Fire Compnay](https://github.com/TheFireCo) as well as the [ollama plugin](https://firebase.google.com/docs/genkit/plugins/ollama).

## License

This project is licensed under the [Apache 2.0 License](https://github.com/xavidop/genkitx-aws-bedrock/blob/main/LICENSE).

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202%2E0-lightgrey.svg)](https://github.com/xavidop/genkitx-aws-bedrock/blob/main/LICENSE)
