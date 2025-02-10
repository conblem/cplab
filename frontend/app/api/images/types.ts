import { z } from "zod";

export const postRequest = z.object({
  url: z.string().url(),
});

export const postResponse = z.object({
  id: z.string().uuid(),
});

export const getResponse = z.object({
  url: z.string().url(),
});

export const patchRequest = z.object({
  url: z.string().uuid(),
});
