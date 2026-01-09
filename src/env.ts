import { createEnv } from "@t3-oss/env-core";
import * as z from "zod/v4";

export const env = createEnv({
  server: {
    BOT_TOKEN: z.string(),
    DEV_SERVER_ID: z.optional(z.coerce.number()),
  },

  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
  skipValidation: Bun.env.CI === "1",
});
