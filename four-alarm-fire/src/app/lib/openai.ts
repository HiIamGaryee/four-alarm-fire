// lib/openai.ts
export async function askOpenAI(prompt: string) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a senior credit-risk analyst AI." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });
  
    if (!res.ok) throw new Error("OpenAI error");
    const data = await res.json();
    return data.choices[0].message.content as string;
  }
