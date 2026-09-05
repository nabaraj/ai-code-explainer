import { OutputMode } from "@/app/types/type";
import Groq from "groq-sdk";
import Share from "@/app/models/Share";
import crypto from "crypto";
import dbConnect from "@/app/lib/mongodb";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
type RequestBody = {
  codeContent: string;
  mode: OutputMode;
};

// export async function GET() {
//   await dbConnect();
//   const shared = await Share.find({});
//   return Response.json({ shared });
// }

const FAST_MODE_PROMPT = `Explain the code simply.

If input is not valid code, return ONLY:
"This does not look like valid code. Please paste proper code."

Rules:
- Max 100 words, bullet points only
- Mention main function
- Use backticks for names
- No code blocks or sections

Edge:
- 2–3, prefix "Edge:", based on code

Q:
- 3 questions, prefix "Q:"
- Based on code, not generic
`;

const DETAILED_MODE_PROMPT = `Explain the code in simple markdown.

If input is not valid code, return ONLY:
"This does not look like valid code. Please paste proper code."

Rules:
- Short summary
- Show only key parts with // comments
- Use backticks for names
- Max 200 words

Format:

## Summary

## Key Points

## Edge Cases (3, based on code)

## Interview Questions
1. Logic
2. Performance
3. Edge case

Questions must be code-specific, not generic.
`;

export async function POST(request: Request) {
  const body = await request.json();
  const { codeContent, mode } = body as RequestBody;
  await dbConnect();
  const hash = crypto
    .createHash("sha256")
    .update(codeContent + mode)
    .digest("hex");

  const existing = await Share.findOne({ hash });
  if (existing) {
    return new Response(existing.explainedCode, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  const prompt = mode === "detailed" ? DETAILED_MODE_PROMPT : FAST_MODE_PROMPT;
  if (mode !== "fast" && mode !== "detailed") {
    throw new Error("Invalid mode");
  }

  // await dbConnect();
  // const shared = await Share.find({});
  // // return Response.json({ shared });
  // console.log({ shared });

  const stream = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: codeContent,
      },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(text));
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
