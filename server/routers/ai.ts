import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";

export const aiRouter = router({
  generateResponse: publicProcedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt cannot be empty"),
    }))
    .mutation(async ({ input }) => {
      // Simulate AI response for now
      // In a real application, you would integrate with an actual AI model here
      const aiResponse = `AI response to: "${input.prompt}"`;
      return { response: aiResponse };
    }),
});
