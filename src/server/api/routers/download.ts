import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  downloadFile: publicProcedure.mutation(({}) => {
    const buffer = Buffer.from("Excalidraw reigns supreme !", "utf-8");
    return {
      success: true,
      buffer,
    };
  }),
});
