import bodyParser from 'body-parser';
import express from 'express'
import routes from './src/routes/maxRoutes'


const app = express();
const PORT = 4001;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


routes(app);


app.listen(PORT, ()=>
    console.log(`I am testing ${PORT}`)
);