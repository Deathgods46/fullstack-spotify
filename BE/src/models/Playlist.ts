import mongoose, { Schema, Document } from 'mongoose';

interface IPlaylist extends Document {
  name: string;
  user: mongoose.Schema.Types.ObjectId;
  songs: mongoose.Schema.Types.ObjectId[];
}

const PlaylistSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model<IPlaylist>('playlists', PlaylistSchema);
