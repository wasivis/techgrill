'use server';

import { db } from '@/db';
import { interviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Starts a new interview session and persists it to Neon
 */
export async function startInterview(formData: FormData) {
  const role = formData.get('role') as string;
  const level = formData.get('level') as string;

  // 1. Ask Groq to generate a unique, aggressive opening question
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an elite Senior ${role} interviewer. 
        Write a brief, 2-sentence opening for an interview for a ${level} position.
        The first sentence should be a cold greeting. 
        The second sentence must be a challenging technical question to start the grill.
        Do not use fluff.`
      }
    ],
    temperature: 0.9, // Higher temperature = more variety
  });

  const openingLine = response.choices[0].message.content || "Let's begin. Explain your experience with high-scale systems.";

  // 2. Insert into Neon with the dynamic opening
  const [newInterview] = await db.insert(interviews).values({
    roleTitle: role,
    difficulty: level,
    transcript: [
      { 
        role: 'assistant', 
        content: openingLine
      }
    ]
  }).returning();

  redirect(`/interview/${newInterview.id}`);
}

/**
 * Uses Groq to analyze the final transcript and code
 */
export async function finishInterview(id: string, transcript: any[], currentCode: string) {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { 
          role: 'system', 
          content: `You are a Principal Engineer and Hiring Manager. 
          Analyze the following technical interview transcript and the final code provided. 
          Provide a final grade (0-100), a 'Hire' or 'No Hire' recommendation, and 3 specific bullet points on technical strengths and weaknesses.
          Be critical and professional.` 
        },
        ...transcript,
        { 
          role: 'user', 
          content: `This is the final state of my code: \n\n${currentCode}\n\nPlease give me my final evaluation.` 
        }
      ],
      temperature: 0.5,
    });

    const feedback = completion.choices[0].message.content || "Evaluation could not be generated.";
    
    // Update the record in Neon with the final feedback
    await db.update(interviews)
      .set({ 
        feedback: feedback,
        // Optional: you could use regex to extract a numerical score from the AI text
        finalScore: 0 
      })
      .where(eq(interviews.id, id));

    revalidatePath(`/interview/${id}`);
    return feedback;

  } catch (error) {
    console.error("Groq Finish Error:", error);
    return "There was an error processing your final evaluation. Please try again.";
  }
}