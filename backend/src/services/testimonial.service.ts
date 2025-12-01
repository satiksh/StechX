import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllTestimonials = async () => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { testimonials };
};
