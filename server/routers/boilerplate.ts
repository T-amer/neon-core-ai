import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { generateBoilerplate, createBoilerplatePackage } from "../boilerplateGenerator";
import { getDb } from "../db";
import { boilerplates } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const boilerplateRouter = router({
  /**
   * Generate a new boilerplate based on business niche
   * Requires authentication and stores result in database
   */
  generate: protectedProcedure
    .input(
      z.object({
        niche: z.string().min(2).max(100),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Generate the boilerplate using LLM
        const boilerplate = await generateBoilerplate({
          niche: input.niche,
          userId: ctx.user.id,
        });

        // Store in database
        const db = await getDb();
        if (!db) {
          throw new Error("Database connection failed");
        }

        const result = await db.insert(boilerplates).values({
          userId: ctx.user.id,
          niche: boilerplate.niche,
          projectName: boilerplate.projectName,
          description: boilerplate.description,
          directoryStructure: boilerplate.directoryStructure,
          filesJson: JSON.stringify(boilerplate.files),
          createdAt: new Date(),
        });

        // Get the inserted ID
        const insertedId = (result as any).insertId;

        return {
          success: true,
          id: insertedId,
          projectName: boilerplate.projectName,
          niche: boilerplate.niche,
          description: boilerplate.description,
        };
      } catch (error) {
        console.error("Boilerplate generation failed:", error);
        throw new Error(
          `Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Get user's generation history
   */
  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        return [];
      }

      const results = await db
        .select()
        .from(boilerplates)
        .where(eq(boilerplates.userId, ctx.user.id));

      return results.map((bp) => ({
        id: bp.id,
        projectName: bp.projectName,
        niche: bp.niche,
        description: bp.description,
        createdAt: bp.createdAt,
      }));
    } catch (error) {
      console.error("Failed to fetch boilerplate history:", error);
      return [];
    }
  }),

  /**
   * Get a specific boilerplate by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database connection failed");
        }

        const result = await db
          .select()
          .from(boilerplates)
          .where(eq(boilerplates.id, input.id))
          .limit(1);

        if (!result.length) {
          throw new Error("Boilerplate not found");
        }

        const bp = result[0];

        // Verify ownership
        if (bp.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        return {
          id: bp.id,
          projectName: bp.projectName,
          niche: bp.niche,
          description: bp.description,
          directoryStructure: bp.directoryStructure,
          files: JSON.parse(bp.filesJson || "{}"),
          createdAt: bp.createdAt,
        };
      } catch (error) {
        console.error("Failed to fetch boilerplate:", error);
        throw new Error(
          `Failed to fetch boilerplate: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Download boilerplate as JSON package
   */
  download: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database connection failed");
        }

        const result = await db
          .select()
          .from(boilerplates)
          .where(eq(boilerplates.id, input.id))
          .limit(1);

        if (!result.length) {
          throw new Error("Boilerplate not found");
        }

        const bp = result[0];

        // Verify ownership
        if (bp.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        const boilerplateData = {
          projectName: bp.projectName,
          niche: bp.niche,
          description: bp.description || "",
          directoryStructure: bp.directoryStructure || "",
          files: JSON.parse(bp.filesJson || "{}"),
        };

        const packageContent = createBoilerplatePackage(boilerplateData as any);

        return {
          filename: `${bp.projectName}-boilerplate.json`,
          content: packageContent,
        };
      } catch (error) {
        console.error("Failed to download boilerplate:", error);
        throw new Error(
          `Download failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),

  /**
   * Delete a boilerplate
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new Error("Database connection failed");
        }

        // First verify ownership
        const result = await db
          .select()
          .from(boilerplates)
          .where(eq(boilerplates.id, input.id))
          .limit(1);

        if (!result.length) {
          throw new Error("Boilerplate not found");
        }

        const bp = result[0];
        if (bp.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        // Delete the boilerplate
        await db.delete(boilerplates).where(eq(boilerplates.id, input.id));

        return { success: true };
      } catch (error) {
        console.error("Failed to delete boilerplate:", error);
        throw new Error(
          `Delete failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }),
});
