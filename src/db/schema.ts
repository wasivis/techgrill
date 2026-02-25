import { pgTable, uuid, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const interviews = pgTable('interviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  roleTitle: text('role_title').notNull(),
  difficulty: text('difficulty').notNull(),
  // transcript will store the conversation history
  transcript: jsonb('transcript').$type<{role: string, content: string}[]>().default([]),
  finalScore: integer('final_score'),
  feedback: text('feedback'),
});