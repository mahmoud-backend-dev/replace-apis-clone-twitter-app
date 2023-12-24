import authRoute from './auth.route.js';
import postRoute from './post.route.js';
import commentRoute from './comment.route.js';
import chatRoute from './chat.route.js';
import repostRoute from './repost.route.js';

export default (app) => {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/posts', postRoute);
  app.use('/api/v1/comments', commentRoute);
  app.use('/api/v1/chats', chatRoute);
  app.use('/api/v1/reposts', repostRoute);
};