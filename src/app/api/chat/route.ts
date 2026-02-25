import { NextResponse } from "next/server";
import Groq from "groq-sdk"; // Use the native SDK
import { db } from "@/db";
import { interviews } from "@/db/schema";
import { eq } from "drizzle-orm";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  const { messages, currentCode, role, interviewId } = await req.json();

  const completion = await groq.chat.completions.create({
    // Llama 3.3 70B is excellent for technical interviews
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an elite, cynical Senior ${role} interviewer. 
STRICT OPERATING RULES:
1. NO SPOILERS: Never provide the corrected code or direct answers.
2. VAGUE CRITIQUE: Point out bugs or inefficiencies vaguely. Ask the candidate to identify and fix them.
3. EXTREME BREVITY: Keep responses under 3 sentences. No "fluff" or "good job" filler.
4. PRESSURE: Always end with a challenging follow-up question.
5. INDEPENDENCE: Your goal is to see if the candidate can solve problems under pressure.
6. EXIT SIGNAL: After 3-4 questions, if you have enough data, your FINAL response MUST be exactly: 
   "Thank you for your answers. I have enough information to make my decision. Please click 'Finish Interview' to see your evaluation."`,
      },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const aiMessage = completion.choices[0].message;
  const updatedTranscript = [...messages, aiMessage];

  // Save to Neon
  if (interviewId) {
    await db
      .update(interviews)
      .set({ transcript: updatedTranscript })
      .where(eq(interviews.id, interviewId));
  }

  return NextResponse.json({ message: aiMessage });
}
