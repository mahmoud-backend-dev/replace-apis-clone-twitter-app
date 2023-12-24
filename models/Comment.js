import { model, Schema } from "mongoose";

const CommentSchema = new Schema({
  text: {
    type: String,
    required: [true, 'text is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'user is required'],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  repost: {
    type: Schema.Types.ObjectId,
    ref: 'Repost',
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }]
}, { timestamps: true });

CommentSchema.pre(/^find/, function (next) {
  this.select('-__v -updatedAt -createdAt');
  next();
});

export default model('Comment', CommentSchema);