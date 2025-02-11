import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const SendEmailsSchema = z.object({
  data: z
    .object({
      data: z.array(
        z.object({
          id: z.string(),
        }),
      ),
    })
    .nullable(),
  error: z
    .object({
      message: z.string(),
      name: z.string(),
    })
    .nullable(),
});

export const contract = c.router({
  sendEmails: {
    method: "GET",
    path: "/api/rest/send-emails",
    responses: {
      200: SendEmailsSchema,
      500: SendEmailsSchema,
    },
    headers: z.object({
      authorization: z.string().startsWith("Bearer"),
    }),
  },
  presignImage: {
    method: "GET",
    path: "/api/rest/presign-image",
    responses: {
      401: z.null(),
      200: z.object({
        url: z.string().url(),
      }),
    },
  },
  insertImage: {
    method: "POST",
    path: "/api/rest/insert-image",
    responses: {
      401: z.null(),
      200: z.object({
        id: z.string().uuid(),
      }),
    },
    body: z.object({ url: z.string().url() }),
  },
  cleanupImage: {
    method: "POST",
    path: "/api/rest/cleanup-image",
    responses: {
      200: z.string().nullable(),
    },
    headers: z.object({
      ["upstash-signature"]: z.string(),
    }),
    body: z.object({
      url: z.string().uuid(),
    }),
  },
});
