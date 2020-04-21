var express=require('express');
var router = express.Router();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
// var mysql = require('mysql');
var path = require('path');
var config=require(path.join(__dirname,"../../config"));


var mysql  = require('mysql');

var connection = mysql.createConnection(config);
// EMAIL 구현
var crypto = require('crypto');


connection.connect()



//serializeUser
//사용자 정보 session 저장.
passport.serializeUser((user,done)=>{
  //세션에 현재 접근하고 있는 사용자 정보가 저장된다.
  console.log('serializeUser',user.id);

  done(null,user.id);//user.authId이용해서 세션 store안에 정보 생성

})

//deserialize
//로그인되어있을 경우 계속 deserialize 실행딘다.
//sessionid 이용해서 사용자 profile 찾고, 사용자 정보 확인한다.
//여기서는 session id를 user 테이블의 id로 설정.
passport.deserializeUser((id,done)=>{
  //id는 위 함수의 done 두번쨰 인자로 온다.
  //그래서 세션에 저장된 정보가 회원부에 존재하는지 학인한다.
  console.log('deserializeUser',id);

  var query = connection.query(`select * from users where id=?`,[id],(err,rows)=>{
    if(err) console.error(err);

    if(rows.length)
    {
			console.log('deserialized ok');

      console.log('id:',rows[0].id,'name:',rows[0].name);
      return done(null,{'id':rows[0].id,'name':rows[0].name});
    }


})


})


//FACEBOOK STRATEGY 등록한다. 밑의 done이후 serialize 실행
passport.use(new FacebookStrategy({
  clientID: '2407340896256615',
  clientSecret: `18925210941d51e91a5230df85a6baa4`,
  //타사인증은 보안적으로 위험한 일이다. 그래서 그 과정에서 여러 방법으로 상호간의 검증이 필요하다.
  callbackURL: "/auth/facebook/callback",
  profileFields:['id','email','gender','link','locale','name','timezone','updated_time','verified',
'displayName']
  },
  function(accessToken, refreshToken, profile, done)
  {
    //profile기반으로 사용자 찾아보고 사용자 있다면 done함수의 두번쨰 인자로 사용자 객체를 전달한다.
    //없다면 사용자 생성하고 그 정보를 객체로 담아서 보내라.

    console.log("profile infromation:");//id(facebook상에서의 사용자 id), displayName, gender
    console.log(profile);

    console.log('!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(profile.email);


    //인증을 통해 들어온 사용자
    var authId=profile.id;


    //이미 존재하는지 확인.
    var query = connection.query(`select * from users where snsId=?`,[authId],(err,rows)=>{
      if(err) throw err;

      if(rows.length)
      {

        // //Json 응답
        // var response = "{'response':'already existed'}";
        // res.send(JSON.parse(response));

        //세션에 담길 정보 저장
        console.log(rows);
        user = {"id":rows[0].id,"name":rows[0].name};


        return done(null,user);
      }

      else {
        //존재하지 않으면 새로 입력.
        var authId = profile.id;
        var name = profile.displayName;


        var query=connection.query(`insert into users(snsId,name) values(?,?)`,[authId,name],(err,rows)=>{

          var query = connection.query(`select id from users where snsId=?`,[authId],(err,rows)=>{


              authI=rows[0].id;

              //email인증을 위한 verufy_key 생성
              // var key_one=crypto.randomBytes(256).toString('hex').substr(100, 5);
              // var key_two=crypto.randomBytes(256).toString('base64').substr(50, 5);
              // var key_for_verify=key_one+key_two;
              var key_for_verify=Math.floor(Math.random()*10000000)+1;

              var query=connection.query(`update users set key_for_verify=? where snsId=?`,[key_for_verify,authId],(err,rows)=>{
                if(err) console.error(err);
              });

              user = {"id":authI,"name":name};

              done(null,user);
          })

          if(err) console.error(err);

          // //Json 응답
          // var response = "{'response':'success'}";
          // res.send(JSON.parse(response));



        })
      }
    })
  }
))





router.get(
  '/',
  passport.authenticate(
    'facebook'
    //{scope:'read_stream'}//쓴글
    //{scope:'email'}//프로필의 email
    //scope에다가 사용자 정보 갖고싶은거 추가로 쓴다
  )
);
//두번쨰 .facebook으로 갔다가 사용자가 확인하고 facebook이 callback으로 다시 웹으로 사용자 보낼때 사용자 정보가 넘어온다.


router.get('/callback',
  passport.authenticate('facebook',{
    successRedirect:'/welcome',
    failureRedirect:'/'
  }),(req,res)=>{
    console.log('    console.log(res.json(req.user));')
    console.log(res.json(req.user));

    res.json(req.user);
  }
);
  module.exports = router;
