import { ApplicationCommandType, AttachmentBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import { Command, ReplyType } from "../InteractionEssentials";
import { debug } from "../Log";
import Colors from "../Colors";
import sharp from "sharp";

export const Base: Command = {
    name: "base",
    description: "Open base view",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction, botUser) => {
        debug("Base command called");

        const embed = new EmbedBuilder()
            .setColor(Colors.BASE_EMBED)
            .setTitle("Your Base")
            .setDescription("This is your base")
            .setImage("attachment://base.png");

        const buffer = await generateBaseImage();
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

const BASE_CANVAS_SIZE = 96;
async function generateBaseImage(): Promise<Buffer> {
    return sharp({
        create: {
            width: BASE_CANVAS_SIZE,
            height: BASE_CANVAS_SIZE,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
    }).composite([
        {
            input: "data/sprites/crates.png",
            left: 26 - 4,
            top: 14 - 4,
        },
        {
            input: "data/sprites/tent2.png",
            left: 56 - 1,
            top: 29 - 4,
        },
        {
            input: "data/sprites/tent.png",
            left: 9 - 1,
            top: 27 - 4,
        },
        {
            input: "data/sprites/campfire-on.png",
            left: 35 - 5,
            top: 45 - 0,
        },
        {
            input: "data/sprites/firewood.png",
            left: 17 - 5,
            top: 61 - 5,
        },
        {
            input: "data/sprites/barrel.png",
            left: 61 - 9,
            top: 59 - 8,
        },
    ]).png().toBuffer();

    // return sharp(unscaled).resize({
    //     width: BASE_CANVAS_SIZE * SCALE_FACTOR,
    //     height: BASE_CANVAS_SIZE * SCALE_FACTOR,
    //     kernel: sharp.kernel.nearest,
    //     fit: "fill",
    // }).toBuffer();
}
