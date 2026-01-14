import { bearer as bearerAuth } from "@elysiajs/bearer";
import { openapi } from "@elysiajs/openapi";
import { staticPlugin } from "@elysiajs/static";
import { Elysia, status } from "elysia";
import * as z from "zod/v4";
import { client as bot } from "../bot";
import { env } from "../env";

const MessageRequest = z.object({
  channelId: z.string(),
  message: z.string(),
  replyToId: z.optional(z.string()),
});

export const app = new Elysia()
  .onError(({ error }) => {
    console.error(error);
    return new Response("whoops, something went wrong");
  })
  .use(
    openapi({
      documentation: {
        info: {
          title: "detective bot api docs",
          version: "1.0.0",
          description:
            "warning! this is mainly for internal use so the api may change at any time without warning",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "",
            },
          },
        },
      },
    })
  )
  .state("client", bot)
  .use(bearerAuth())
  .use(
    env.IS_DEV
      ? await staticPlugin({
          prefix: "/",
        })
      : staticPlugin({
          prefix: "/",
        })
  )
  .get("/", "nothing to see here")
  .get("/status", ({ store: { client } }) => {
    return {
      clientReady: client.isReady(),
    };
  })
  .post(
    "/message",
    async ({ body, bearer, store: { client } }) => {
      if (!bearer) return status(401, "Unauthorized");
      if (!env.WEB_PASSWORD) return status(401, "Unauthorized");

      if (bearer !== env.WEB_PASSWORD) return status(403, "Forbidden");

      const channel = await client.channels.fetch(body.channelId);
      if (!channel || !channel.isSendable())
        return status(400, "invalid channel");

      const replyToMessage = body.replyToId
        ? await channel.messages.fetch(body.replyToId)
        : undefined;

      if (replyToMessage) {
        replyToMessage.reply(body.message);
      } else {
        channel.send(body.message);
      }

      return "success";
    },
    {
      body: MessageRequest,
    }
  );

export type API = typeof app;

app.listen(3000);
console.log(
  `web server running on ${app.server?.hostname}:${app.server?.port}`
);
