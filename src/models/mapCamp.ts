import { Document, Model, Schema, model } from 'mongoose';
import { DiscordUserDoc } from './discordUser';

export interface MapCampDoc extends Document {
    user: DiscordUserDoc['_id'];
    position: [number, number];
}

interface MapCampModel extends Model<MapCampDoc> { }

const mapCampSchema = new Schema<MapCampDoc, MapCampModel>({
    user: { type: Schema.Types.ObjectId, ref: 'DiscordUsers', required: true },
    position: { type: [Number], required: true },
});

const mapCampModel = model<MapCampDoc, MapCampModel>('MapCamps', mapCampSchema);

export default mapCampModel;
