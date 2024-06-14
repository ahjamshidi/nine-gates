import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  title: string;
  uri: string;
  skillType?: string;
  description?: string;
}

const skillSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  uri: { type: String, required: true, unique: true },
  skillType: String,
  description: String,
});

const Skill = mongoose.model<ISkill>('Skill', skillSchema);
export default Skill;
