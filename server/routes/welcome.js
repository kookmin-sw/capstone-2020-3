var express=require('express');
var router = express.Router();

//추가정보입력

router.get('/',(req,res)=>{



  //passport 를 이용해서 user정보 access

  console.log(req.user);




  query =`

        <h1>Email인증</h1>
        <form action = '/auth/email' method ="post">
        <input type = "text" name="email">
        <input type = "text" name="univ">
       <input type ="submit">
         </form>
         <br>

         <h1>Email인증번호받고 확인요청</h1>
         <form action = '/auth/email/email_verified' method ="post">
         <input type = "text" name="key">
        <input type ="submit">
          </form>


         <h1>페이스북 본인인증</h1>
         <a href="/auth/facebook"> facebook_logi </a>
         <br>


         <h1>핸드폰 본인인증</h1>
          <form action = '/auth/phone_Auth' method ="post">
          <input type = "text" name="phoneNumber">
            <input type ="submit">
            </form>
          <br>


          <h1>핸드폰 본인인증 문자입력</h1>
         <form action = '/auth/phone_Auth/verify_ans' method ="post">
         <input type = "text" name="phoneNumber">
         <input type = "text" name="qur_ans">
             <input type ="submit">
                </form>
        `

  res.send(query);

});

module.exports=router;
