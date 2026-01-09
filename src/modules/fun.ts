import { SlashCommandBuilder } from "discord.js";
import * as z from "zod/v4";
import type { Command } from "../lib/command";
import type { Module } from "../lib/modules";

const dadJokeResponse = z.object({
  id: z.string(),
  joke: z.string(),
  status: z.number(),
});

const dadJokeCommand = {
  data: new SlashCommandBuilder()
    .setName("dad-joke")
    .setDescription("gives a (not) very funny dad joke"),
  execute: async (interaction, utils) => {
    await interaction.deferReply();

    const res = await fetch("https://icanhazdadjoke.com/", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      utils.logger.error("request failed", res.statusText);

      await interaction.editReply({
        content: "something went wrong",
      });
    }

    const json = await res.json();

    const { success, data, error } = dadJokeResponse.safeParse(json);

    if (!success) {
      utils.logger.error(error);

      await interaction.editReply({
        content: "something went wrong",
      });
    }

    await interaction.editReply(`here's one: ${data?.joke}`);
  },
} satisfies Command;

export const funModule = {
  onLoad: (_client, util) => {
    util.loadCommand(dadJokeCommand);
  },
} satisfies Module;
