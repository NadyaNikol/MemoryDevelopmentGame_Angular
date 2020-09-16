    const MongoClient = require("mongodb").MongoClient;
    // создаем объект MongoClient и передаем ему строку подключения
    const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });


    const express = require("express");
    const app = express();
    // создаем парсер для данных в формате json
    const jsonParser = express.json();
    // настройка CORS
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS");
        next(); // передаем обработку запроса методу app.post("/postuser"...
    });
    // обработчик по маршруту localhost:3000/postuser
    app.post("/postuser", jsonParser, function(request, response) {
        // если не переданы данные, возвращаем ошибку
        if (!request.body) return response.sendStatus(400);
        // получаем данные
        let target = request.body.target;

        let isUsers = target === 'users' ? true : target === 'statistics' ? false : null;
        let userlogin = request.body.ulogin;

        // console.log("isUsers = " + isUsers);

        let userpassword = '';
        let useremail = '';
        let usernumberOfMoves = '';
        if (isUsers) {
            userpassword = request.body.upassword;
            useremail = request.body.uemail;
        } else if (!isUsers) {
            usernumberOfMoves = request.body.unumberOfMoves;
            // console.log("n = "+usernumberOfMoves);
        }


        // console.log("login " + userlogin);

        // отправка данных обратно клиенту
        // response.json({"name": username, "age": userage});



        // добавление данных
        mongoClient.connect(function(err, client) {

            const db = client.db("gamebraindb");
            // const collection = db.collection("users");
            const collection = db.collection(target);

            // let user = {name: "Tom", age: 23};

            // console.log("login " + userlogin);

            // let user = { login: userlogin, password: userpassword, email: useremail };
            // collection.insertOne(user, function(err, result) {

            // if (err) {
            //     return console.log(err);
            // }
            // console.log(result.ops);
            // client.close();


            if (err) {
                //client.close();
                // console.log("error " + err);
                response.json("error");
                // return;
            }

            if (isUsers) {
                collection.findOne({ login: userlogin }, function(err, results) {
                    // console.log("results " + results);

                    console.log(results + " - results");
                    if (results != null) {
                        response.json("login busy");
                        // console.log("!undefined");
                        // // client.close();
                        // isFined = 1;
                        // return results;
                    } else {
                        let user = { login: userlogin, password: userpassword, email: useremail };
                        collection.insertOne(user, function(err, result) {


                            if (err) {
                                console.log("secerr " + err);
                                response.json("error");
                                //   client.close();
                                // return;

                            }
                            console.log("success");
                            //client.close();
                            response.json("success");
                            // client.close();
                            // return;

                        });
                    }
                });
            }

            if (!isUsers) {

                // console.log(usernumberOfMoves);
                let stat = { login: userlogin, numberOfMoves: usernumberOfMoves };
                collection.insertOne(stat, function(err, result) {

                    if (!err) {
                        // console.log("secerr " + err);
                        // response.json("error");
                        //   client.close();
                        // return;


                        // console.log("success");
                        //client.close();
                        // response.json("success");
                        // client.close();
                        // return;


                        collection.find().toArray(function(err, results) {

                            if (!err) {
                                response.json(results);
                                // console.log(response.json(results));
                            }


                        });
                    }

                });
            }

        });


        // const existingRecords = await Tenders.find({ tenderId: { $in: allIds } }, 'tenderId');

        // console.log("s = " + s);


        // if (s==="undefined") {
        //console.log("res " + res);
        // let user = { login: userlogin, password: userpassword, email: useremail };
        // collection.insertOne(user, function(err, result) {


        //     if (err) {
        //         console.log("secerr " + err);
        //         response.json("error");
        //         //   client.close();
        //         return;

        //     }
        //     console.log("success");
        //     //client.close();
        //     response.json("success");
        //     // client.close();
        //     return;

        // });
        // }


        //}

        //  collection.find().toArray(function(err, results){

        // console.log(results);
        // client.close();
        // });



        // client.close();


        // });


    }).listen(3000, "127.0.0.1", () => console.log("Сервер начал прослушивание запросов на порту 3000"));


    // // app.listen(3000);



    // const MongoClient = require("mongodb").MongoClient;
    // //     // создаем объект MongoClient и передаем ему строку подключения
    //     const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true, useUnifiedTopology: true });

    //     // добавление данных
    //     mongoClient.connect(function(err, client) {

    //         const db = client.db("gamebraindb");
    //         const collection = db.collection("users");
    //          //let user = {name: "Tom", age: 23};

    //         //  console.log("login " + userlogin);

    //         // let user = { login: userlogin, password: userpassword, email: useremail };
    //         // collection.insertOne(user, function(err, result) {

    //         //     if (err) {
    //         //         return console.log(err);
    //         //     }
    //         //     console.log(result.ops);
    //         //     client.close();
    //         if(err) return console.log(err);

    //     collection.find().toArray(function(err, results){

    //         console.log(results);
    //         client.close();
    //         });
    //     });






    // // получение данных
    // // mongoClient.connect(function(err, client){

    // //     const db = client.db("usersdb");
    // //     const collection = db.collection("users");

    // //     if(err) return console.log(err);

    // //     collection.find().toArray(function(err, results){

    // //         console.log(results);
    // //         client.close();
    // //     });

    // // collection.find({name: "Tom"}).toArray(function(err, results){

    // //        console.log(results);
    // //        client.close();
    // });