import { Schema, model } from "mongoose";

const repostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: [true, "Post is required"],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  sharing: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  text: {
    type: String,
  },
}, { timestamps: true });

repostSchema.pre(/^find/, function (next) {
  this.select("-__v -updatedAt -createdAt");
  next();
});

export default model("Repost", repostSchema);