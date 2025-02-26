import express from 'express';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import routes from './routes.js';
import { auth } from './middlewares/authMiddleware.js';
import { tempData } from './middlewares/tempDataMiddleware.js';

const app = express(); 


try {
    //TODO Change DB name
    const uri = 'mongodb://localhost:27017/powerOfNature'
    await mongoose.connect(uri);
    
    console.log('DB Connected');
    
} catch (err) {
    console.error('Cannot connect to DB');
    console.log(err.message);
}


app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },   
      helpers: {
        setTitle(title) {
            this.pageTitle = title;
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', './src/views'); 



app.use(express.static('src/public/styles')); // test: http://localhost:3000/styles/404.css
app.use(express.static('src/public/images'));
app.use(express.urlencoded({extended: false})); 
app.use(cookieParser());
app.use(expressSession({
    secret: 'hfhghofgfdiogjflhfdihd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true }
}));
app.use(auth);
app.use(tempData);
app.use(routes); 


app.listen(3000, () => console.log('Server is listening on http://localhost:3000...'));