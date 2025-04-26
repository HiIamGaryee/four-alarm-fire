// src/app/api/ask-ai/route.ts
import { askOpenAI } from "@/app/lib/openai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  const { message, context } = await req.json();

  const ctx = JSON.stringify(context, null, 2);
  const needFull = /explain more on my report/i.test(message);

  const prompt = needFull
    ? `
You are a seasoned loan officer. Here is the client's credit-report JSON:

${ctx}

Fill the numbered template below. **Do NOT repeat these instructions, only supply the completed sections.**

1) Quick Summary – 2-3 lines (credit score, income RM, DTI %, utilization %)
2) Observations / Suggestions – exactly 3 calm, actionable tips to improve loan eligibility
3) Interesting Insights – one thoughtful pattern you notice
4) Closing Note – one short, reassuring sentence

Never use the dollar sign; replace it with “RM”.
`.trim()
    : `
You are a helpful finance assistant. The user already has this report:

${ctx}

Answer clearly and concisely.
Q: ${message}
A:
`.trim();

  try {
    let answer = await askOpenAI(prompt);

    // fallback cleanup: remove any line that still contains the words "Quick Summary – 2"
    answer = answer
      .replace(/\$/g, "RM")
      .split("\n")
      .filter((l) => !/Quick Summary – 2-3/i.test(l))
      .join("\n")
      .trim();

    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "OpenAI request failed" }, { status: 500 });
  }
}
