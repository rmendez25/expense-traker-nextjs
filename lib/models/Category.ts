import mongoose, { Document, Schema } from 'mongoose';

export interface ICategoryDocument extends Document {
  name: string;
  type: 'income' | 'expense';
  isDefault: boolean;
  color: string;
  icon?: string;
  user?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: [true, 'Category type is required'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: [true, 'Category color is required'],
      match: [/^#([0-9A-Fa-f]{6})$/, 'Color must be a valid hex code'],
    },
    icon: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

categorySchema.index({ user: 1, name: 1 });
categorySchema.index({ isDefault: 1 });

export default mongoose.models.Category || mongoose.model<ICategoryDocument>('Category', categorySchema);
