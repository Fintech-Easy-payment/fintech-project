const express = require("express");
const app = express();
const server = require('http').Server(app);
const appPort = process.env.PORT || 3000;
var mysql = require('mysql');
var request = require('request');
const path = require('path');
var jwt = require('jsonwebtoken');
var auth = require('./lib/auth');
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

var connection;

if (process.env.NODE_ENV == 'production'){
  var db_config = {
    host: 'us-cdbr-east-03.cleardb.com',
    post: 3306,
    user: 'bc44916151566b',
    password: '9c011805',
    database: 'heroku_2fef9e1d5161af5'
  }
  connection = mysql.createPool(db_config);
}

else{
  var db_config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fintech'
  }
  connection = mysql.createConnection(db_config);
}

if (process.env.NODE_ENV == 'production') {
  app.use(express.static(path.join(__dirname, '../back-end/public')));

  app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.post('/authTest', auth, function (req, res) {
  res.json(req.decoded);
})

app.post('/api/signup', (req, res) => {
  var name = req.body.name;
  var phone = req.body.phone;
  var email = req.body.email;
  var password = req.body.password;
  var access_token = req.body.access_token;
  var refresh_token = req.body.refresh_token;
  var user_seqnum = req.body.user_seqnum;
  console.log(name, phone, email, password, access_token, refresh_token, user_seqnum);
  var sql = "UPDATE user SET email=?, password=?, access_token=?, refresh_token=?, user_seqnum=? WHERE phone=?";
  connection.query(sql, [email, password, phone, access_token, refresh_token, user_seqnum], function (err, result) {
    if (err) {
      console.error(err);
      res.json(0); // 회원가입 실패
      throw err;
    }
    else {
      res.json(1) // 회원가입 성공
    }
  })
})

app.post('/api/signin', function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email, password)
  var sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [email], function (err, result) {
    if (err) {
      console.error(err);
      res.json(0);
      throw err;
    }
    else {
      console.log(result);
      if (result.length == 0) {
        res.json(3) // 이메일 없음
      }
      else {
        var dbPassword = result[0].password;
        if (dbPassword == password) {
          var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%"
          jwt.sign(
            {
              userId: result[0].user_id,
              userEmail: result[0].email
            },
            tokenKey,
            {
              expiresIn: '10d',
              issuer: 'fintech.admin',
              subject: 'user.login.info'
            },
            function (err, token) {
              console.log(token)
              res.json(token) // 로그인 성공 -> sessionStorage에 token 저장
            }
          )
        }
        else {
          res.json(2); // 패스워드 틀림
        }
      }
    }
  })
})

app.post('/account', auth, function (req, res) {
  var user_id = req.decoded.userId;

  var sql = "SELECT * FROM user WHERE user_id=?"
  connection.query(sql, [user_id], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    else {
      console.log(result);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/list",
        headers: {
          Authorization: 'Bearer ' + result[0].access_token
        },
        qs: {
          user_seq_no: result[0].user_seqnum,
          include_cancel_yn: 'Y',
          sort_order: 'D'
        }
      }
      request(option, function (err, response, body) {
        if (err) {
          console.error(err);
          throw err;
        }
        else {
          var requestResult = JSON.parse(body);
          console.log(requestResult);
          var res_list = requestResult.res_list;
          res.json(res_list);
          //var sql = "SELECT * FROM user_product up join product p on up.product_id = p.product_id WHERE user_id=?"
          // connection.query(sql, [user_id], function(err, result){
          //   if (err){
          //     console.error(err);
          //     throw err;
          //   }
          //   else {
          //     console.log(body.res_list);
          //     res.json({product: result[0].product_name, price: reusult[0].price});
          //   }
          // })
        }
      })
    }
  })
})

app.listen(appPort, function () {
  console.log(`********** EXPRESS SERVER is running on port ${appPort} **********`);
})