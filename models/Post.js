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

postSchema.post('aggregate', async function (doc, next) {
  await Promise.all(doc.map(async (post) => {
    await Promise.all(post.comments.map(async (comment) => {
      comment.user = await model('User').findById(comment.user).select('firstName lastName image');
    }))
    await Promise.all(post.reposts.map(async (repost) => {
      repost.user = await model('User').findById(repost.user).select('firstName lastName image');
    }))
  }))
})

export default model('Post', postSchema);