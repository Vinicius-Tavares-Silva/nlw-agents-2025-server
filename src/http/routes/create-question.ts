import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { db } from '../../db/connections.ts';
import { schema } from '../../db/schema/index.ts';
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts';
import { and, eq, sql } from 'drizzle-orm';

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post('/rooms/:roomId/questions', {
    schema: {
      params: z.object({
        roomId: z.string(),
      }),
      body: z.object({
        question: z.string().min(1),
      }),
    }
  },
  async (request, reply) => {
    const { roomId } = request.params;
    const { question } = request.body;

    const embeddings = await generateEmbeddings(question);

    const embeddingsAsString = `[${embeddings.join(',')}]`;

    const chuncks = await db.select(
      {
        id: schema.audioChunks.id,
        transcription: schema.audioChunks.transcription,
        similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`
      }
    )
      .from(schema.audioChunks)
      .where(
        and(
          eq(schema.audioChunks.roomId, roomId),
          sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7` // Adjust the threshold as needed
        )
      )
      .orderBy(sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`) // Order by similarity
      .limit(3);

    let answer: string | null = null;

    if (chuncks.length > 0) {
      const transcriptions = chuncks.map(chunk => chunk.transcription);

      answer = await generateAnswer(question, transcriptions);
    }

    const result = await db.insert(schema.questions).values({
      roomId,
      question,
      answer,
    }).returning();

    const insertedQuestion = result[0];

    if (!insertedQuestion) {
      throw new Error('Failed to create question');
    }

    return reply.status(201).send({
      questionId: insertedQuestion.id,
      answer,
    });
  });
}
