const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb');
const url = 'mongodb+srv://david:david1997@cluster0.50tcmuy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/view', function (req, res) {
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("URL");
        var list = db.collection('URL').find().toArray();
        list.then(function (data) {
                client.close();
                res.json(data);
            })
            .catch(function (err) {
                client.close();
                res.status(500).json({
                    message: "Failure"
                })
            })
    })
});

app.post('/create', function (req, res) {
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("URL");
        db.collection('URL').insertOne({ long: req.body.URL, short: shortURL() }, (err, result) => {
            if (err) throw err;
            client.close();
            res.json({
                message: "Link added"
            })
        })
    })
})

function shortURL() {
    var short = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLen = characters.length;
    for (var i = 0; i < 7; i++) {
        short += characters.charAt(
            Math.floor(Math.random() * charLen)
        );
    }
    return short;
}

const PORT = process.env.PORT || 8080;

app.listen(PORT,function(){
    console.log(`Server is running on port ${PORT}`);
});
