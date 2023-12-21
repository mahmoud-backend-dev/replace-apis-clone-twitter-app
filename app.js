// Description: Main file of the application
import { socketConnection } from './utils/io.js';
import { createServer } from 'http';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);
import 'express-async-errors';
import 'dotenv/config.js';
import express, { json, urlencoded, static as static_ } from 'express';
const app = express();
const port = process.env.PORT || 1812;
const httpServer = createServer(app);
const io = socketConnection(httpServer)
import mountRoutes from './routes/index.js';


// Setting Security For App
import cors from 'cors';
import compression from 'compression';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';


import errorHandler from './middleware/error-handler.js';
import notFoundErr from './middleware/notFoundMiddleware.js';
import connectDB from './db/connectDB.js';


// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// Compress all responses
app.use(compression());



app.use(json());
app.use(urlencoded({ extended: true }));
app.use(static_(path.join(__dirname, 'uploads')));

// To remove data using these defaults, To apply data sanitization
// nosql mongo injection
app.use(mongoSanitize());


// Set 'trust proxy' to a more secure mode
app.set('trust proxy', 'loopback');

// Express middleware to protect against HTTP Parameter Pollution attacks
app.use(hpp())

// Static Folder
app.use(express.static('uploads'));


app.set('IO', io);
// Mounts Routes
mountRoutes(app);

app.use(errorHandler);
app.use(notFoundErr);

const start = async () => {
    try {
        await connectDB(process.env.URI);
        httpServer.listen(port, () => console.log(`Listen server on http://localhost:${port}`));
    } catch (error) {
        console.log(error);
    }
};

start();