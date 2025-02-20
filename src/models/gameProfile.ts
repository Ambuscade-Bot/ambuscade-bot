import { Document, Model, Schema, model } from 'mongoose';
import { DiscordUserDoc, getOrCreateDiscordUser } from './discordUser';

export interface GameProfileDoc extends Document {
    discordUser: DiscordUserDoc['_id'];

    createdAt: Date;
    updatedAt: Date;
}

interface GameProfileModel extends Model<GameProfileDoc> { }

const gameProfileSchema = new Schema<GameProfileDoc, GameProfileModel>({
    discordUser: { type: Schema.Types.ObjectId, ref: 'DiscordUsers', required: true },
}, { timestamps: true });

const gameProfileModel = model<GameProfileDoc, GameProfileModel>('GameProfiles', gameProfileSchema);

export async function getProfileCount(discordUser: DiscordUserDoc): Promise<number> {
    return gameProfileModel.countDocuments({ discordUser });
}

export async function createNewGameProfile(discordUser: DiscordUserDoc): Promise<GameProfileDoc> {
    return gameProfileModel.create({ discordUser });
}

export default gameProfileModel;
