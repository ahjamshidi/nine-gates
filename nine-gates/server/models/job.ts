import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  jobTitle: string;
  firstUri: string;
  essentialSkills: string[];
  essentialSkillsUris: string[];
}

const jobSchema: Schema = new Schema({
  jobTitle: { type: String, required: true },
  firstUri: { type: String, required: true },
  essentialSkills: { type: [String], required: true },
  essentialSkillsUris: { type: [String], required: true },
});

const Job = mongoose.model<IJob>('Job', jobSchema);

export default Job;
