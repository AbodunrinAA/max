import axios from 'axios'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { GetMovies, GetMoviesById, InsertComment, GetComments, GetCharacterById, GetCharacters } from '../controllers/maxControllers'

const swaggerOptions = {
    swaggerDefinition: {
        info:{
            title: "WAX APIs",
            description: "This is a sample WAX APIs.",
            version: "1.0.0",
            contact: {
                name: "Abodunrin AbdulGafar",
        },
            servers:['http://localhost:4001']
    }
},
apis: ['./src/routes/maxRoutes.js']
};

const routes = (app) => {

    // Swagger
    const swaggerDoc = swaggerJsdoc(swaggerOptions);
    app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    /***
     * @swagger
     * /movies/{sortBy}:
     *  get:
     *      description: Get all movies
     *      parameters:
     *      - name: sortBy
     *        in: path
     *        description: sortBy optional
     *        required: false
     *        type: int
     *      responses:
     *          200:
     *              description: Success
     *
     */
    app.route('/movies/:sortBy?')
        .get((req, res, next) => {
            //middelware 
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request from: ${req.method}`)
            next();

        }, (req, res, next) =>{
            GetMovies(req, res)
    });

    /***
     * @swagger
     * /movie/{id}:
     *  get:
     *      description: Get movie
     *      parameters:
     *      - name: id
     *        in: path
     *        description: movie id
     *        required: false
     *        type: int
     *      responses:
     *          200:
     *              description: Success
     *
     */
    app.route('/movie/:id')
        .get((req, res) =>{
            GetMoviesById(req, res);
        })

    /***
     * @swagger
     * /comment:
     *  post:
     *      description: Insert Comment
     *      parameters:
     *      - name: comment
     *        description: comment on movie
     *        in: formData
     *        required: false
     *        type: String
     *      - name: movie_id
     *        description: movieId
     *        in: formData
     *        required: false
     *        type: int
     *      responses:
     *          201:
     *            description: Created
     *
     */
    app.route('/comment')
        .post((req, res) =>{
        InsertComment(req, res);
    });

    /***
     * @swagger
     * /get_comments:
     *  get:
     *      description: Get all comments
     *      responses:
     *          200:
     *              description: Success
     *
     */
    app.route('/get_comments')
        .get((req, res) =>{
            GetComments(res);
        });


    /***
     * @swagger
     * /characters/{sortBy}/{filterByGender}:
     *  get:
     *      description: Get all characters
     *      parameters:
     *      - name: sortBy
     *        in: path
     *        description: sortBy optional
     *        required: false
     *        type: string
     *      - name: filterByGender
     *        in: path
     *        description: filterByGender optional
     *        required: false
     *        type: string
     *      responses:
     *          200:
     *              description: Success
     *
     */
    app.route('/characters/:sortBy?/:filterByGender?')
        .get((req, res, next) => {
            //middelware
            console.log(`Request from: ${req.originalUrl}`)
            console.log(`Request from: ${req.method}`)
            next();

        }, (req, res, next) =>{
            GetCharacters(req, res)
        });

    /***
     * @swagger
     * /character/{id}:
     *  get:
     *      description: Get character
     *      parameters:
     *      - name: id
     *        in: path
     *        description: character id
     *        required: false
     *        type: int
     *      responses:
     *          200:
     *              description: Success
     *
     */
    app.route('/character/:id')
        .get((req, res) =>{
            GetCharacterById(req, res);
        })
    
}
export default routes;