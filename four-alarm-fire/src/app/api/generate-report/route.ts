// app/api/generate-report/route.ts
import { askOpenAI } from "@/app/lib/openai";
import { NextResponse } from "next/server";

export const runtime = "edge";
  
export async function POST(req: Request) {
  const statement = await req.json();

  /* build prompt */
  const prompt = `
You will receive a JSON object called "statement".
1. Analyse income, spending, debts, utilization.
2. Follow these rules:
   • debtToIncome > 0.6  ⇒ riskPercent = 80
   • debtToIncome > 0.3  ⇒ riskPercent = 50
   • else                ⇒ riskPercent = 20
3. Reply **ONLY** with valid JSON containing:
{
  creditScore: number,       // 300-850
  incomeData: number,        // monthly income
  debtToIncome: number,      // 0-1
  utilizationRate: number,   // 0-1
  eligibility: string,       // short feedback
  spending: number[12],      // passthrough
  rentTimeline: number[12],  // passthrough
  riskPercent: number        // 20/50/80
}

statement:
\`\`\`json
${JSON.stringify(statement, null, 2)}
\`\`\`
`;
  try {
    const raw = await askOpenAI(prompt);
    /* crude extraction – expect pure JSON */
    const clean = raw.trim().replace(/^```json|```$/g, "");
    const report = JSON.parse(clean);
    return NextResponse.json(report);
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
