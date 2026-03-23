import { z } from "zod";

import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  RESEND_API_KEY: z.string().min(1),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

export default tryParseEnv(EnvSchema);
