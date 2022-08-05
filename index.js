const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const dbinfo = fs.readFileSync('./database.json');
const conf = JSON.parse(dbinfo);

const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
});
app.use(express.json());
app.use(cors());

//인기 키워드 프로젝트
app.get('/topranking', async (req, res)=>{
    connection.query(
        "select * from projects where projectKeyword like '%인기%' order by projectAchieve desc limit 12",
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//마감임박 키워드 프로젝트
app.get('/imminent', async (req, res)=>{
    connection.query(
        "select * from projects where projectKeyword like '%마감임박%' order by projectEndDate asc limit 12",
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//테마 키워드 프로젝트
app.get('/theme', async (req, res)=>{
    connection.query(
        "select * from projects where projectKeyword like '%테마%' limit 10",
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//신규 키워드 프로젝트
app.get('/newproject', async (req, res)=>{
    connection.query(
        "select * from projects where projectKeyword like '%신규%' order by projectStartDate desc limit 10",
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//주목 키워드 프로젝트
app.get('/potenup', async (req, res)=>{
    connection.query(
        "select * from projects where projectKeyword like '%주목%' order by projectHits desc limit 9",
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//공개예점 키워드 프로젝트
app.get('/commingsoon', async (req, res)=>{
    connection.query(
        "select * from projects where projectKeyword like '%공개예정%' order by projectStartDate asc limit 9",
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//회원정보 불러오기(id 중복 확인)
app.get('/user/:userId', async (req, res)=>{
    const userId = req.params.userId;
    connection.query(
        `select * from members where userId='${userId}'`,
        (err, rows)=>{
            res.send(rows);
        }
    )
})
//회원가입 insert
app.post('/createuser', async (req, res)=>{
    let plainPass = req.body.userPw;
    let lockedPass = '';
    const {userId,userBirth,userGender,userPhone,userName,userEmail,userAddr1,userAddr2}= req.body;
    if(Boolean(plainPass) != false){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(plainPass, salt, function(err, hash) {
                lockedPass = hash;
                connection.query(
                    `insert into members(userId, userPw, userBirth, userGender, userPhone, userName, userEmail, userAddr1, userAddr2)
                    values ('${userId}', '${lockedPass}', '${userBirth}', '${userGender}', '${userPhone}', '${userName}', '${userEmail}', '${userAddr1}', '${userAddr2}')`,
                    (err,rows)=>{
                        if(err) console.log(err);
                    }
                )
            });
        });
    }
})
//로그인 match
app.post('/loginuser', async (req, res)=>{
    const { userId, userPw } = req.body;
    connection.query(
        `select * from members where userId='${userId}'`,
        (err, rows)=>{
            if(err) return console.log(err);
            if(rows != undefined){
                if(rows[0] == undefined){
                    res.send(undefined);
                }else{
                    bcrypt.compare(userPw, rows[0].userPw, function(err, result) {
                        if(result ==  true){
                            res.send(rows[0]);
                        }else{
                            res.send("password undefined");
                        }
                    });
                }
            }
        }
    )
})

//서버 돌리기
app.listen(port, ()=>{
    console.log('comet is now running');
})