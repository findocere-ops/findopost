import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import { GenerationRequest, GenerationResult } from '../app/lib/types';
import { buildPrompt, SYSTEM_PROMPT } from '../app/lib/prompts/index';
import { evaluateContent } from '../app/lib/evaluator';

dotenv.config();

const client = new Anthropic({
  apiKey: process.env.MINIMAX_API_KEY || "",
  baseURL: "https://api.minimax.io/anthropic",
});

export async function generateBotContent(request: GenerationRequest): Promise<GenerationResult> {
  const prompt = buildPrompt(request);

  if (!process.env.MINIMAX_API_KEY) {
    throw new Error("MINIMAX_API_KEY not found in environment variables");
  }

  try {
    const msg = await client.messages.create({
      model: "minimax/m2.7", // Adjust to the exact model string Minimax expects if different
      max_tokens: 2000,
      temperature: 0.7,
      system: SYSTEM_PROMPT,
      messages: [ // We need to instruct it specifically to use JSON
        { role: "user", content: prompt + "\n\nRespond ONLY with the raw JSON object. Do not wrap in markdown ```json blocks." }
      ]
    });

    let content = "";
    if (msg.content[0].type === "text") {
       content = msg.content[0].text;
    }

    // Minimax sometimes wraps in markdown block despite instructions
    content = content.replace(/^```json\n/, "").replace(/^```\n/, "").replace(/\n```$/, "").trim();

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      console.error("Original content:", content);
      throw new Error("Failed to parse LLM Response into JSON format.");
    }

    const evaluationScores = evaluateContent(parsed.finalPost, request.mode === 'thread');

    return {
      ...parsed,
      evaluationScores,
      warnings: []
    } as GenerationResult;

  } catch (error: any) {
    console.error("Generation error:", error);
    throw new Error(`Generation failed: ${error.message}`);
  }
}
