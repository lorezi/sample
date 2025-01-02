
import mongoose, { Document, Schema, Model } from 'mongoose';


// 1. Define an interface representing a document in MongoDB.
export interface ITransaction extends Document {
  title: string;
  description: string;
  category: string;
}

// 2. Create a Schema corresponding to the document interface.
const transactionSchema: Schema<ITransaction> = new Schema<ITransaction>({
  title: {
    type: String,
    trim: true,
    required: [true, 'A Transaction must have a title'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A Transaction must have a description'],
  },
  category: {
    type: String,
    trim: true,
    required: [true, 'Transaction must belong to a category!'],
  },
}, {
  timestamps: true, 
});

// 3. Create and export the Model.
const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
