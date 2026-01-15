import { bearer as bearerAuth } from "@elysiajs/bearer";
import { openapi } from "@elysiajs/openapi";
import { ActivityType } from "discord.js";
import { Elysia, status } from "elysia";
import * as z from "zod/v4";
import { client as bot } from "../bot";
import { env } from "../env";
import detectiveIndex from "../routes/detective/index.html";

const MessageRequest = z.object({
  channelId: z.string(),
  message: z.string(),
  replyToId: z.optional(z.string()),
});

export const app = new Elysia()
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
  .get("/", "nothing to see here")
  .get("/detective", detectiveIndex)
  .get("/status", ({ store: { client } }) => {
    return {
      clientReady: client.isReady(),
    };
  })
  .macro("auth", () => ({
    beforeHandle({ bearer }) {
      if (!bearer) return status(401, "Unauthorized");
      if (!env.WEB_PASSWORD) return status(401, "Unauthorized");

      if (bearer !== env.WEB_PASSWORD) return status(403, "Forbidden");
    },
  }))
  .post(
    "/client/message",
    async ({ body, store: { client } }) => {
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
      auth: true,
    }
  )
  .post(
    "/client/status",
    async ({ body, store: { client } }) => {
      client.user?.setActivity({
        name: body.name,
        type: body.type,
      });

      return "success";
    },
    {
      auth: true,
      body: z.object({
        type: z.enum(ActivityType),
        name: z.string(),
      }),
    }
  );

export type API = typeof app;

app.listen(3000);
console.log(
  `web server running on ${app.server?.hostname}:${app.server?.port}`
);
