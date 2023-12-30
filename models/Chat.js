import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  room: {
    type: String
  },
}, { timestamps: true });

export default model('Chat', chatSchema);