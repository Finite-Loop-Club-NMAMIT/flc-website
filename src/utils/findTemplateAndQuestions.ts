import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';

export async function findTemplateAndCheckQuestions(templateId: string) {
  const template = await db.feedbackTemplate.findUnique({
    where: { id: templateId },
    include: { Questions: true }, // Include related Questions
  });

  if (!template) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'FeedbackTemplate not found',
    });
  }

  if (template.Questions.length === 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'FeedbackTemplate cannot be published without questions',
    });
  }

  return template;
}
