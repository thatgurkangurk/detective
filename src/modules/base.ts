import { ActivityType } from "discord.js";
import type { Module } from "../lib/modules";

export const baseModule = {
  onLoad: (client) => {
    client.once("clientReady", (readyClient) => {
      client.logger.success("ready!");
      readyClient.user.setActivity({
        type: ActivityType.Watching,
        name: "watching over you all",
      });
    });
  },
} satisfies Module;
