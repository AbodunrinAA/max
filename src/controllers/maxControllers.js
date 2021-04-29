import axios from 'axios'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export const GetMovies = (req, res) => {
    axios.get('https://swapi.dev/api/films')
        .then(response => {
            let dataa = response.data.results.map(project);


            if (req.params.sortBy == "name") {
                res.status(200).send(dataa.sort(compare_by_name))
            } else {
                res.status(200).send(dataa)
            }

        })
        .catch(error => {
            res.status(500).send(error);
        });
}

function compare_by_name(x,y) {
    if (x.title < y.title)
        return -1;
    if (x.title > y.title)
        return 1;
    return 0;
}

function compare_by_namee(x,y) {
    if (x.name < y.name)
        return -1;
    if (x.name > y.name)
        return 1;
    return 0;
}

function compare_by_height(x,y) {
    if (x.height < y.height)
        return -1;
    if (x.height > y.height)
        return 1;
    return 0;
}

function project(projection) {
    let projectedObj = {}
    for(let key in projection) {
        if (key == 'title' || key == 'opening_crawl' || key == 'director' || key == 'release_date' || key == 'created'){
            projectedObj[key] = projection[key];
        }
        if(key == 'url'){
            projectedObj['id'] = projection[key].slice(-2, -1);


            let d = getComment(projection[key].slice(-2, -1), function (result){
                return result;
            });

            projectedObj['num_of_result'] = d;

        }

    }
    return projectedObj;
}

function getComment(id, callback){
    let count = 0;
    open({
        filename: './src/routes/max.db',
        driver: sqlite3.Database
    }).then((db) => {

        db.all(`SELECT * FROM comments WHERE movie_id = ?`, [id], (err, rows, fields) => {

            if (err) {
                throw err;
            }

        }).then(r => {
            return callback(r.length);
        });
    }).catch(error => {
        throw error;
    });
    return count;
}

export const GetMoviesById = (req, res) => {
    axios.get(`https://swapi.dev/api/films/${req.params.id}/`)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch(error => {
            res.status(500).send(error);
        });
}

export const InsertComment = (req, res) => {
    let body = req.body;
    let today = new Date();
    console.log(req.body);
    open({
        filename: './src/routes/max.db',
        driver: sqlite3.Database
    }).then((db) => {
        db.run(
            `INSERT INTO comments (comment, ip, date, movie_id) VALUES(?, ?, ?, ?)`, [body.comment, 0, today, body.movie_id]
            //'INSERT INTO comments (comment, ip, date, movie_id) VALUES("Riko", "0910212", "0910212", 1)'
        )
        db.close();
    }).catch(error => {
        res.status(500).send(error);
    });

    res.status(201).send("Comment created successfully")
}

export const GetComments = (res) =>{
    console.log('get comment');
    open({
        filename: './src/routes/max.db',
        driver: sqlite3.Database
    }).then((db) => {

        db.all(`SELECT * FROM comments`, [], (err, rows) => {

            res.status(200).send(rows);
            if (err) {
                throw err;
            }

        }).then(r => res.status(200).send(r));
        db.close();
    }).catch(error => {
        res.status(500).send(error);
    });
}

export const GetCharacters = (req, res) => {
    axios.get('https://swapi.dev/api/people/')
        .then(response => {
            let characters = response.data.results.map(toFeetMap)
            let filter = req.params.filterByGender;
            console.log(filter);
            console.log(req.params.sortBy);
            if(filter === '{filterByGender}') {
                if(req.params.sortBy == "name") {
                    res.status(200).send(characters.sort(compare_by_namee))
                } else if (req.params.sortBy == "height") {
                    res.status(200).send(characters.sort(compare_by_height))
                } else {
                    res.status(200).send(characters)
                }
            }else{
                let f = filter;
                let char = characters.filter(s => s.gender === f);
                if (req.params.sortBy == "name") {
                    res.status(200).send(char.sort(compare_by_namee))
                } else if (req.params.sortBy == "height") {
                    res.status(200).send(char.sort(compare_by_height))
                } else {
                    res.status(200).send(char)
                }
            }

        })
        .catch(error => {
            res.status(500).send(error);
        });
}

export const GetCharacterById = (req, res) => {
    axios.get(`https://swapi.dev/api/people/${req.params.id}/`)
        .then(response => {
            let r = response.data['height'];
            response.data['height'] = toFeet(r);
            res.status(200).send(response.data);
        })
        .catch(error => {
            res.status(500).send(error);
        });
}

function toFeet(n) {
    let realFeet = ((n*0.393700) / 12);
    let feet = Math.floor(realFeet);
    let inches = Math.round((realFeet - feet) * 12);
    return feet + "ft and " + inches + ' inches';
}

function toFeetMap(projection) {
    let projectedObj = {}
    for(let key in projection) {
        if (key == "height"){
            projectedObj[key] = toFeet(projection[key]);
        }else{
            projectedObj[key] = projection[key];
        }
    }
    return projectedObj;
}