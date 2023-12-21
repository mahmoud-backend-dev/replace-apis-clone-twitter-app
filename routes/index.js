import authRoute from './auth.route.js';
import postRoute from './post.route.js';
import commentRoute from './comment.route.js';

export default (app) => {
  app.use('/api/v1/auth', authRoute);
  app.use('/api/v1/posts', postRoute);
  app.use('/api/v1/comments', commentRoute);
};