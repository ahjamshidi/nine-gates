import mongoose, { Document, Schema } from 'mongoose';
import { ISkill } from './skill';

export interface IOccupation extends Document {
  title: string;
  uri: string;
  description?: string;
  preferredLabel?: string;
  alternativeLabel?: string[];
  code?: string;
  essentialSkills: ISkill['_id'][];
  optionalSkills: ISkill['_id'][];
}

const occupationSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true },
  uri: { type: String, required: true, unique: true },
  description: String,
  preferredLabel: String,
  alternativeLabel: [String],
  code: String,
  essentialSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  optionalSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
});

const Occupation = mongoose.model<IOccupation>('Occupation', occupationSchema);
export default Occupation;
