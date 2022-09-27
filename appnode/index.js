const express = require('express')
const app = express()
const port = 3000

// -- MySQL CONNECTION
function getMySqlConnection() {
    const config = {
        host: 'db',
        user: 'root',
        password: 'root',
        database: 'nodedb'
    };

    const mysql = require('mysql');
    return mysql.createConnection(config);
}

// -- DATABASE
const connection = getMySqlConnection();
const sql_create_table_people = `create table people(id int not null auto_increment, name varchar(255), primary key(id));`
connection.query(sql_create_table_people, function (err, result) {
    console.log("Database tables - Ok");
});
connection.query("delete from people");
const sql_insert_people_01 = `INSERT INTO people(name) values('Floor Jansen')`;
connection.query(sql_insert_people_01);
const sql_insert_people_02 = `INSERT INTO people(name) values('James Hetfield')`;
connection.query(sql_insert_people_02);
const sql_insert_people_03 = `INSERT INTO people(name) values('Serj Tankian')`;
connection.query(sql_insert_people_03);
connection.end();

// -- SELECT PEOPLE
let peopleToHtmlList = (results) => {   
    var htmlPeople = '';
    Object.keys(results).forEach(
        function(key) {
            var row = results[key];
            htmlPeople += "<li>" + row.name + "</li>";
        }
    );
    return htmlPeople;
};

let selectPeople = async (peopleBinderCallBack) => {
    const myQuery = "SELECT name FROM people";
    let results = await new Promise((resolve, reject) => {
        const connection = getMySqlConnection();
        connection.query(myQuery, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results);
            }
        })
        connection.end();
    });

    return peopleBinderCallBack(results);
};

//-- LOGS
let logInfo = (message) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    console.log(today.toISOString() + ' [INFO]: ' + message);
} 

// -- ENDPOINT
app.get('/', async (req, res) => {
    logInfo('Finding all people...');
    let peopleList = await selectPeople(peopleToHtmlList);
    let body = '<h1>Full Cycle Rocks!</h1>'
        .concat('<p>- Lista de nomes cadastrada no banco de dados.</p>')
        .concat(peopleList);
    res.send(body);
});


// -- START
app.listen(port, () => {
    console.log('Rodando na porta ' + port)
});
