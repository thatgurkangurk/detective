import * as z from "zod/v4";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
  server: {
    BOT_TOKEN: z.string(),
  },

  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
  skipValidation: Bun.env.CI === "1",
});
