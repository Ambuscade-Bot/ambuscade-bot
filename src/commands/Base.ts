import { ApplicationCommandType, AttachmentBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import { Command, ReplyType } from "../InteractionEssentials";
import { debug } from '../Log';
import Colors from "../Colors";
import { mapImage } from "../SpriteGeneration";

export const Base: Command = {
    name: "base",
    description: "Open base view",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction, botUser, discordUser) => {
        debug("Base command called");

        const embed = new EmbedBuilder()
            .setColor(Colors.BASE_EMBED)
            .setTitle("Your Base")
            .setDescription("This is your base")
            .setImage("attachment://base.png");

        const buffer = await mapImage();
        const attachment = new AttachmentBuilder(buffer, {
            name: "base.png",
        });

        return {
            replyType: ReplyType.Reply,
            embeds: [embed],
            files: [attachment],
            flags: [MessageFlags.Ephemeral],
        }
    },
};
