import express, { response } from 'express';
import routes from './src/routes/routes';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import methodOverride from 'method-override';
import config from 'config';
import {callback} from './src/controllers/controllers';

const cookieParser = require("cookie-parser");

const app = express();
const port = 80;

//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
    console.error("FATAL ERROR: myprivatekey is not defined.");
    process.exit(1);
  }

// override with POST having 
app.use(methodOverride('_method'));
app.use( function( req, res, next ) {
    if ( req.query._method == 'DELETE' ) {
        req.method = 'DELETE';
        req.url = req.path;
    }       
    next(); 
});

//cookie-parser
app.use(cookieParser());

//view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(path.join(__dirname, './static')));

//mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/SmitchDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.get('/', (req, res) => {
    res.render('index', {text : 'Login Page'});
});

app.get('/UserSignup', (req, res) => {
    res.render('signup');
});

app.listen( port, () => {
    console.log(`Server listening on port ${port}`);
});
