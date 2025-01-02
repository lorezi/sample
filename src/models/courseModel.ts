
import mongoose, { Document, Schema, Model } from 'mongoose';


// 1. Define an interface representing a document in MongoDB.
export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
}

// 2. Create a Schema corresponding to the document interface.
const courseSchema: Schema<ICourse> = new Schema<ICourse>({
  title: {
    type: String,
    trim: true,
    required: [true, 'A course must have a title'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A course must have a description'],
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'Course must belong to a category!'],
    enum: {
      values: ['Science', 'Arts', 'Technology', 'Literature'],
      message: 'Category is either: Science, Arts, Technology,  Literature',
    },
  },
}, {
  timestamps: true, 
});

// 3. Create and export the Model.
const Course: Model<ICourse> = mongoose.model<ICourse>('Course', courseSchema);

export default Course;
