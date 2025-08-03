
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LandingPageDocument = LandingPage & Document;

@Schema({ timestamps: true })
export class LandingPage {
  @Prop({ required: true })
  idea: string;

  @Prop({ type: Array, required: true })
  sections: Section[];
}

export type Section = {
  type: string; // e.g., "hero", "about", "contact"
  props: Record<string, any>; // dynamic content per section
};

export const LandingPageSchema = SchemaFactory.createForClass(LandingPage);
