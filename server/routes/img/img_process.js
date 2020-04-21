var express=require('express');
var router = express.Router();
var multer = require('multer');
var mysql = require('mysql');
var config=require('../../config');
var bodyParser = require('body-parser');
var path = require('path');
var mime = require("mime");

// DATABASE SETTING
var connection = mysql.createConnection(config);
connection.connect()


var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + path.extname(file.originalname));
    }
  }),
});


/*
form-data 형식
key img1, img2, img3에 대해서 각각 이미지파일  받는다.
*/
//req.file로 업로드한 이미지가 저장된다.
//또한 dest속성에 지정해둔 경로에 이미지가 저자에된다.
//lomits 속성을 통해서 5MB로 파일 사이즈 제한 가능하다.
//이미지가 아닌 데이터는 req.body에 저장된다.
//const upload = multer({ dest: 'uploads/', limits: { fileSize: 5 * 1024 * 1024 } });





//POST저장
router.post('/up',  upload.fields([{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }]), (req, res) => {


  console.log(req.files);

  //세개 다 있을 때
  if(req.files.img2 !=null && req.files.img3!=null && req.files.img1!=null)
  {
    img1_path=req.files.img1[0]['path'];
    img2_path=req.files.img2[0]['path'];
    img3_path=req.files.img3[0]['path'];

    list=[];
    list[0]=img1_path;
    list[1]=img2_path;
    list[2]=img2_path;
    console.log(list);

  }
  //첫 번 쨰만 있을 때
  else if(req.files.img1 !=null && req.files.img2==null && req.files.img3==null)
  {
    img1_path=req.files.img1[0]['path'];

    list=[];
    list[0]=img1_path;
    console.log(list);
  }
  //첫 번째 두번쨰만 있을 때
  else if(req.files.img1 !=null  && req.files.img2!=null && req.files.img3==null)
  {
    img1_path=req.files.img1[0]['path'];
    img2_path=req.files.img2[0]['path'];

    list=[];
    list[0]=img1_path;
    list[1]=img2_path;
    console.log(list);
  }
  //아우것도 없을 때
  else if(req.files.img2 ==null && req.files.img3==null && req.files.img1==null)
  {
    list=[];
    console.log(list);
  }

});


//post수정. postid, postimg
router.post('/modify_post_img',  upload.fields([{ name: 'img_num' }, { name: 'img' },{name:'postid'}]), (req, res) => {

  postid=req.body.postid;
  postid=parseInt(postid);
  img_num=req.body.img_num;
  img_num=`img_url`+img_num;
  img_path=req.files.img[0]['path'];

  // console.log(postid);
  // console.log(img_num);
  // console.log(img_path);

  var query = connection.query(`update posts set ${img_num} = '${img_path}' where id = ${img_num}`, (err,rows)=>{

    if(err) console.log(err);
    else console.log(rows);
  })
})








//사용자 이미지 등록
router.post('/user_img_up',upload.fields([{name:'img'}]),(req,res)=>{

  id_=req.user.id;
  img_path=req.files.img[0]['path'];

  var query = connection.query(`update users set img_url = '${img_path}' where id=${id_}`,(err,rows)=>{
    if(err) res.json({"image_upload":"fail"});
    else{
      res.json({"image_upload":"success"});
    }
  })

})





module.exports = router;



























/*
전체 FLOW
--> ANDROID에서 MULTIPART를 이용해 FILE을 보내고 SERVER에서는 저장됐다 안됐다 확인하면 된다.

Reference: https://www.learn2crack.com/2014/08/android-upload-image-node-js-server.html


// router.post('/up',  upload.fields([{ name: 'postId' },{ name: 'img1' }, { name: 'img2' }, { name: 'img3' }]), (req, res) => {
//   postid=req.body.postId;
//
//
//
//   console.log(req.files);
//   res.end();
// });









*/

/*
//input={postId:xxxx, post_img_num:1|2|3}
router.post('/post_upload',function(req,res)=>{

  console.log(req.files.image.originalFilename);
  console.log(req.files.image.path);

  postId=req.body.postId;
  post_img_num=req.body.post_img;



  fs.readFile(req.file.image.path, function (err, data){

    var dirname = "";
    var newPath = dirname + "/uploads/" + Date.now() +	req.file.image.originalFilename;


    fs.writeFile(newPath, data, function (err) {

      //post_id에 해당하는 url저장.
      //Number(post_img_num)
      var query = connection.query(`update posts set img_url?=? where id=?`,[post_img_num,newPath,postId],(err,rows)=>{
        if(err) console.error(err);

      })
      if(err) {
        res.json({'response':'Error'});
      }
      else {
        res.json({'response':'Saved'});

      }

    })
  });
});


//해당 해당 file이 저장된 경로를 찾고, 해당 이미지를 브라우저에 보여준다. !!Project랑 상관없음.
//Resizing같은거 android에서 진행.
router.get('/:postid', function (req, res){


		postid = req.params.postId;
    var query = connection.query(`select * from posts where id=?`,[postid],(err,rows)=>{
      if(err) console.error(err);

      res.json(rows);

    })

});
};








//사용자 이미지 등록
router.post('/user_img', function(req, res, next) {

  user_Id=req.user.id;
  fs.readFile(req.file.image.path, function (err, data){

    var dirname = "";
    var newPath = dirname + "/uploads/" + Date.now() +	req.file.image.originalFilename;


    fs.writeFile(newPath, data, function (err) {

      //post_id에 해당하는 url저장.
      //Number(post_img_num)
      var query = connection.query(`update users set img_url=? where id=?`,[newPath,id],(err,rows)=>{
        if(err) console.error(err);
      })

      if(err) {
        res.json({'response':'Error'});
      }

      else {
        res.json({'response':'Saved'});

      }

    })
  });

});


//해당 해당 file이 저장된 경로를 찾고, 해당 이미지를 브라우저에 보여준다. !!Project랑 상관없음.
//Resizing같은거 android에서 진행.
router.get('/user_profile', function (req, res){


    user_Id=req.user.id;
    var query = connection.query(`select img_url from users where id=?`,[user_Id],(err,rows)=>{
      if(err) console.error(err);

      res.json(rows);

    })

});
};
*/







// //제플린보면 POST 등록시에 같이 이미지 등록한다. 그래서 postcontroller에서 createPost에서 같이 저장하던지 아니면 다른 내용만 저장하던지 해야 한다.
// //다른 내용만 저장하고 나중에 해당 postid를 return해서 진행하는게 편하긴 할거같다.
// //이미지를 받고, 해당 경로에 이미지를 저장한다.
// //Post 등록할 때, id와 연결해서 이미지 URL을 저장해야 함. 즉, DB에 업체명, 일시, 시간등을 먼저 저장하고 POST ID를 저장만든 후에 사진 추가한다.
// router.post('/post_upload', function(req, res) {
//
//   //즉,request body에 postid싣어서 보내야 함. 나머지는 multer 데이터
//     /*
//     {
//       postId:xxxxx
//     }
//     */
//   	console.log(req.files.image.originalFilename);
//   	console.log(req.files.image.path);
//
//     len = req.files;
//
//     for (i=0;i<len;i++)
//     {
//         fs.readFile(req.files[i].image.path, function (err, data){
//
//     		var dirname = "";
//     		var newPath = dirname + "/uploads/" + Date.now() +	req.files[i].image.originalFilename;
//
//
//     		fs.writeFile(newPath, data, function (err) {
//
//           //post id는 앞에 post관련 정보 저장하면서 memory_session에 저장한다.
//
//           /*
//           var cache = require('memory-cache');
//           session_id=req.user.id;
//           phoneNumber = req.body.phoneNumber;
//           //인증번호를 key로 하는 캐시가 있다면 삭제(재요청시)
//           cache.del(phoneNumber);
//
//           //인증번호 생성.
//           verificationNumber=Math.floor(Math.random()*10000000)+1;
//           console.log(verificationNumber);
//
//           console.log('phonenumber: '+phoneNumber+",verification:",verificationNumber);
//
//         //4분 후에 캐시 삭제
//           cache.put(phoneNumber,verificationNumber,180000,(key,value)=>{
//               //Time out callback
//
//
//
//           });
//           console.log(phoneNumber +' verification number is '+cache.get(phoneNumber));
//
//
//           */
//           post id =req.body.postId;
//
//           //post_id에 해당하는 url저장.
//           var query = connection.query(`update posts set img_url[?]=? where id=?`,[i+1,newPath,post_id],(err,rows)=>{
//             if(err) console.error(err);
//
//           })
//
//       		//respone posts create와 연결해서 진행.
//
//       });
//       });
//
//     }
// });
