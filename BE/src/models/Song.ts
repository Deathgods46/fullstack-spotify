import mongoose, { Schema, Document } from 'mongoose';

interface ISong extends Document {
  title: string;
  artist: string;
  duration: number;
}

const SongSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<ISong>('songs', SongSchema);
