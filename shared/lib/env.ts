import { z } from "zod";

import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

export default tryParseEnv(EnvSchema);
