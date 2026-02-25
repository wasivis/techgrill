import { db } from '@/db';
import { interviews } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import TechGrillUI from '@/components/TechGrillUI';

// Note the change in the type: params is now a Promise
export default async function InterviewPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Unwrap the params Promise
  const { id } = await params;

  // 2. Fetch from Neon using the unwrapped id
  const interview = await db.query.interviews.findFirst({
    where: eq(interviews.id, id)
  });

  if (!interview) {
    notFound();
  }

  return (
    <TechGrillUI 
      interviewId={interview.id} 
      initialTranscript={interview.transcript} 
      role={interview.roleTitle} 
    />
  );
}