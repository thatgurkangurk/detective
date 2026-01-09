import {
  Colors,
  EmbedBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import type { Command } from "../lib/command";
import type { Module } from "../lib/modules";

const purgeCommand = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("purge messages")
    .setContexts([InteractionContextType.Guild])
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("the amount of messages to purge")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  execute: async (interaction, { logger }) => {
    await interaction.deferReply({
      flags: "Ephemeral",
    });
    const amountToDelete = interaction.options.getInteger("amount", true);

    const embed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle("done")
      .setDescription(`successfully deleted ${amountToDelete} messages`)
      .setTimestamp();

    if (!interaction.inGuild()) {
      await interaction.reply({
        content: "this command can only be used in servers",
        ephemeral: true,
      });
      return;
    }

    const channel = await interaction.guild?.channels.fetch(
      interaction.channelId
    );

    if (!channel || !channel.isTextBased()) {
      logger.warn("Invalid or missing channel");
      await interaction.reply({
        content: "this channel cannot be purged.",
        ephemeral: true,
      });
      return;
    }

    const messages = await channel.messages.fetch({ limit: amountToDelete });
    await channel.bulkDelete(messages, true);

    await interaction.editReply({
      embeds: [embed],
    });
  },
} satisfies Command;

export const moderationModule = {
  onLoad: (_client, util) => {
    util.loadCommand(purgeCommand);
  },
} satisfies Module;
