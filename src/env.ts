import { createEnv } from "@t3-oss/env-core";
import * as z from "zod/v4";

export const env = createEnv({
  server: {
    BOT_TOKEN: z.string(),
    DEV_SERVER_ID: z.optional(z.coerce.number()),
    PORT: z.optional(z.coerce.number()).prefault(3000),
    IS_DEV: z
      .optional(z.string().transform((s) => s !== "false" && s !== "0"))
      .prefault("0"),
    WEB_PASSWORD: z.optional(z.string()),
  },

  runtimeEnv: Bun.env,
  emptyStringAsUndefined: true,
  skipValidation: Bun.env.CI === "1",
});
