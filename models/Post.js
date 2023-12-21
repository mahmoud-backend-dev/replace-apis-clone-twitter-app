import { Schema, model } from "mongoose";

const postSchema = new Schema({
  text: {
    type: String,
    required: [true, 'text required'],
  },
  image: String,
  video: String,
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  sharing: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
}, { timestamps: true });

postSchema.pre(/^find/, function (next) {
  this.select('-__v -createdAt -updatedAt');
  next();
})

export default model('Post', postSchema);