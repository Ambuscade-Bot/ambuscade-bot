import { Document, Model, Schema, model } from 'mongoose';
import discordUserModel, { DiscordUserDoc } from './discordUser';

export interface GameProfileDoc extends Document {
    discordUser: DiscordUserDoc['_id'];
    name: string;

    createdAt: Date;
    updatedAt: Date;
}

interface GameProfileModel extends Model<GameProfileDoc> { }

const gameProfileSchema = new Schema<GameProfileDoc, GameProfileModel>({
    discordUser: { type: Schema.Types.ObjectId, ref: 'DiscordUsers', required: true },
    name: { type: String, required: true },
}, { timestamps: true });

const gameProfileModel = model<GameProfileDoc, GameProfileModel>('GameProfiles', gameProfileSchema);

export async function getProfileCount(discordUser: DiscordUserDoc): Promise<number> {
    return gameProfileModel.countDocuments({ discordUser });
}

export async function createNewGameProfile(discordUser: DiscordUserDoc, name: string): Promise<GameProfileDoc> {
    return gameProfileModel.create({ discordUser, name });
}

export async function selectGameProfile(discordUser: DiscordUserDoc, profileName: string): Promise<void> {
    const selectedGameProfile = await gameProfileModel.findOne({ discordUser, name: profileName });
    if (!selectedGameProfile) {
        throw new Error(`Profile ${profileName} not found`);
    }
    await discordUserModel.updateOne({ _id: discordUser._id }, { selectedGameProfile }).exec();
}

export async function deleteGameProfile(discordUser: DiscordUserDoc, profileName: string): Promise<GameProfileDoc | undefined> {
    const doc = await gameProfileModel.deleteOne({ discordUser, name: profileName }).exec();
    if (!doc) return undefined;
    return doc;
}

export default gameProfileModel;
