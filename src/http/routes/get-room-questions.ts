import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod/v4';
import { db } from '../../db/connections.ts';
import { schema } from '../../db/schema/index.ts';

export const getRoomsQuestions: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      }
    },
    async (request) => {
      const { roomId } = request.params;

      if (!roomId) {
        throw new Error('Room ID is required');
      }

      const results = await db
      .select({
        id: schema.questions.id,
        question: schema.questions.question,
        answer: schema.questions.answer,
        createdAt: schema.questions.createdAt,
      })
      .from(schema.questions)
      .where(eq(schema.questions.roomId, roomId))
      .orderBy(desc(schema.questions.createdAt));

      return results;
    })
}
