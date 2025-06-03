import { Document, Model, Schema, model } from 'mongoose';
import { MapCampDoc } from './mapCamp';

export interface MapDoc extends Document {
    mapCamps: MapCampDoc['_id'][];

    createdAt: Date;
    updatedAt: Date;
}

interface MapModel extends Model<MapDoc> { }

const mapSchema = new Schema<MapDoc, MapModel>({
    mapCamps: [{ type: Schema.Types.ObjectId, ref: 'MapCamps' }],
}, { timestamps: true });

const mapModel = model<MapDoc, MapModel>('Maps', mapSchema);

export default mapModel;
