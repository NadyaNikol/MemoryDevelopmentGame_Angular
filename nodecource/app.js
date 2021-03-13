    const MongoClient = require("mongodb").MongoClient;
    // create a MongoClient object and pass it a connection string
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });


    const express = require("express");
    const app = express();
    // create a parser for json data
    const jsonParser = express.json();
    // customization CORS
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
        next(); // pass the request processing to the method app.post("/postuser"...
    });
    // route handler localhost:3000/postuser
    app.post("/postuser", jsonParser, function(request, response) {
        // if no data is passed, return an error
        if (!request.body) return response.sendStatus(400);
        // getting data
        let target = request.body.target;

        let isUsers = target === 'users' ? true : target === 'statistics' ? false : null;
        let userlogin = request.body.ulogin;

        let userpassword = '';
        let useremail = '';
        let usernumberOfMoves = '';
        if (isUsers) {
            userpassword = request.body.upassword;
            useremail = request.body.uemail;
        } else if (!isUsers) {
            usernumberOfMoves = request.body.unumberOfMoves;
        }

        // sending data back to the client
        // response.json({"name": username, "age": userage});


        // adding data
        mongoClient.connect(function(err, client) {

            const db = client.db("gamebraindb");
            const collection = db.collection(target);

            if (err) {
                response.json("error");
            }

            if (isUsers) {
                collection.findOne({ login: userlogin }, function(err, results) {

                    console.log(results + " - results");
                    if (results != null) {
                        response.json("login busy");
                       
                    } else {
                        let user = { login: userlogin, password: userpassword, email: useremail };
                        collection.insertOne(user, function(err, result) {


                            if (err) {
                                console.log("secerr " + err);
                                response.json("error");
                              
                            }
                            console.log("success");
                            response.json("success");
                        });
                    }
                });
            }

            if (!isUsers) {

                let stat = { login: userlogin, numberOfMoves: usernumberOfMoves };
                collection.insertOne(stat, function(err, result) {

                    if (!err) {
                        
                        collection.find().toArray(function(err, results) {

                            if (!err) {
                                response.json(results);
                            }


                        });
                    }

                });
            }

        });

    }).listen(3000, "127.0.0.1", () => console.log("Сервер начал прослушивание запросов на порту 3000"));
