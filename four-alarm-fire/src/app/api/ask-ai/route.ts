import { NextResponse } from "next/server";
import { askOpenAI } from "@/app/lib/openai";
import banks from "@/app/data/bankSet.json"; // ← static import, works in Edge

export const runtime = "edge";

type Bank = {
  bankName: string;
  flatRateInterest: number;
  minimumMonthlyIncome: number;
};

export async function POST(req: Request) {
  const { message, context } = await req.json();
  const msg = (message as string).trim();
  const ctxJson = JSON.stringify(context, null, 2);

  /* -------------- 1. BEST HOUSING LOAN ---------------- */
  if (/best housing loan for me/i.test(msg)) {
    const income = context?.incomeData || context?.customer?.incomeMonthly || 0;

    // filter + sort
    const suitable = (banks as Bank[])
      .filter((b) => income >= b.minimumMonthlyIncome)
      .sort((a, b) => a.flatRateInterest - b.flatRateInterest)
      .slice(0, 3);

    if (suitable.length === 0) {
      return NextResponse.json({
        answer:
          "Sadly, with your current income level I can’t find a matching housing-loan offer right now. Consider boosting your monthly income or adding a co-applicant.",
      });
    }

    const answer =
      suitable
        .map(
          (b, i) =>
            `${i + 1}.  ${b.bankName}  – flat-rate interest  ${b.flatRateInterest}% , minimum income  RM${b.minimumMonthlyIncome.toLocaleString()} `,
        )
        .join("\n") +
      "\n\nTip: Compare effective interest (EIR) and fees as well, but these three are the sharpest rates you currently qualify for.";

    return NextResponse.json({ answer });
  }

  /* -------------- 2. EXPLAIN MORE ---------------------- */
  const wantRecap = /explain more on my report/i.test(msg);
  const prompt = wantRecap
    ? `
You are a seasoned loan officer. Client’s report JSON:

${ctxJson}

Return ONLY the filled template, no extra text.

1) Quick Summary – 2-3 lines (credit score, income RM, DTI %, utilization %)
2) Observations / Suggestions – exactly 3 calm, actionable tips to improve loan eligibility
3) Interesting Insights – one thoughtful pattern you notice
4) Closing Note – one short, reassuring sentence

Use “RM” instead of $, sound professional yet encouraging.
`.trim()
    : `
You are a helpful finance assistant. The user already has this report:

${ctxJson}

Answer clearly and concisely.
Q: ${msg}
A:
`.trim();

  /* -------------- 3. FALLBACK TO OPENAI --------------- */
  try {
    let answer = await askOpenAI(prompt);
    answer = answer.replace(/\$/g, "RM");
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json(
      { error: "OpenAI request failed" },
      { status: 500 },
    );
  }
}
