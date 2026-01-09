import { ActivityType, SlashCommandBuilder } from "discord.js";
import type { Command } from "../lib/command";
import type { Module } from "../lib/modules";

const command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("ping the bot"),
  execute: async (interaction) => {
    await interaction.reply("pong");
  },
} satisfies Command;

export const baseModule = {
  onLoad: (client, util) => {
    client.once("clientReady", (readyClient) => {
      client.logger.success("ready!");
      readyClient.user.setActivity({
        type: ActivityType.Watching,
        name: "watching over you all",
      });
    });

    util.loadCommand(command);
  },
} satisfies Module;
