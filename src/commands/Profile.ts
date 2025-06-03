import { ApplicationCommandOptionType, ApplicationCommandType, MessageFlags } from "discord.js";
import { Command, ReplyType } from "../InteractionEssentials";
import { debug } from "../Log";
import { FeatureNotImplementedFailure, ProfileNotFoundFailure } from "../Failure";
import { createNewGameProfile, selectGameProfile } from "src/models/gameProfile";

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
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Name of the profile",
                    required: true,
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "create",
            description: "Create a new profile",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Name of the profile",
                    required: true,
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "delete",
            description: "Delete a profile",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "name",
                    description: "Name of the profile",
                    required: true,
                }
            ]
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
                const profileName = interaction.options.getString("name", true);
                try {
                    await selectGameProfile(discordUser, profileName);
                    return {
                        replyType: ReplyType.Reply,
                        content: "Profile selected",
                        flags: [MessageFlags.Ephemeral]
                    }
                } catch (e) {
                    return new ProfileNotFoundFailure(e);
                }
            }
        },
        create: {
            run: async (client, interaction, botUser, discordUser) => {
                const profileName = interaction.options.getString("name", true);
                await createNewGameProfile(discordUser, profileName);
                return {
                    replyType: ReplyType.Reply,
                    content: "Profile created",
                    flags: [MessageFlags.Ephemeral]
                }
            }
        },
        delete: {
            run: async (client, interaction, botUser, discordUser) => {
                const profileName = interaction.options.getString("name", true);
                await deleteGameProfile(discordUser, profileName);
            }
        },
    },
};
