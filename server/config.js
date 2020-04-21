
//Session저장위한 mysql 연결정보 db까지만 만들면 자동으로 table만들고 지가 알아서한다.
var config={
  host:'localhost',
  port:3306,
  user:'root',
  password:'***',
  database:'capstone'

}

module.exports = config  ;


/*
  create table Users(

    id int auto_increment,
    name varchar(20),
    snsId varchar(20),
    email varchar(20),
    createdAt date,
    updatedAt date,
    deletedAt date,
    nickname varchar(20),
    address varchar(20),
    univ varchar(20),
    gender varchar(10),
    age int,
    career varchar(100),
    phoneNumber varchar(20),
    key_for_verify varchar(100),
    email_authorized boolean default false,
    PRIMARY KEY (id)

);







*/
