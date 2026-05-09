import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { boilerplateRouter } from "./routers/boilerplate";
import { aiRouter } from "./routers/ai";
import type { TrpcContext } from "./_core/context";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with 
  system: systemRouter,
  ai: aiRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }: { ctx: TrpcContext }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }: { ctx: TrpcContext }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  boilerplate: boilerplateRouter,
});

export type AppRouter = typeof appRouter;
