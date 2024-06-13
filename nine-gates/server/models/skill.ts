import mongoose, { Schema, Document, Model } from 'mongoose';

interface ISkill extends Document {
  skillTitle: string;
  uri: string;
  description: string;
}

const skillSchema: Schema = new Schema({
  skillTitle: { type: String, required: false },
  uri: { type: String, required: true, unique: true },
  description: { type: String, required: true },
});

const Skill: Model<ISkill> = mongoose.model<ISkill>('Skill', skillSchema);

export default Skill;
