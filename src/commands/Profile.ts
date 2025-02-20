import { ApplicationCommandOptionType, ApplicationCommandType, MessageFlags } from "discord.js";
import { Command } from "../InteractionEssentials";
import { debug } from "../Log";
import { FeatureNotImplementedFailure } from "../Failure";
import { createNewGameProfile } from "src/models/gameProfile";

export const Profile: Command = {
    name: "profile",
    description: "Profile management",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "view",
            description: "View your profiles",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "select",
            description: "Select your active profile",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "create",
            description: "Create a new profile",
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "delete",
            description: "Delete a profile",
        },
    ],
    run: async (client, interaction, botUser, discordUser) => {
        debug("Template command called");
        return new FeatureNotImplementedFailure();
    },
    subcommands: {
        view: {
            run: async (client, interaction, botUser, discordUser) => {

            }
        },
        select: {
            run: async (client, interaction, botUser, discordUser) => {

            }
        },
        create: {
            run: async (client, interaction, botUser, discordUser) => {
                createNewGameProfile(discordUser);
                return {
                    content: "Profile created",
                    flags: [MessageFlags.Ephemeral]
                }
            }
        },
        delete: {
            run: async (client, interaction, botUser, discordUser) => {

            }
        },
    },
};
