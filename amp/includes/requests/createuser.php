<?php
require_once "../MSQDB.php";
require_once "../objects/author.php";
require_once "requestutils.php";

$data = json_decode(file_get_contents("php://input"));

$database = new MSQDB;

session_start();

RequestUtils::checkData($data);
//RequestUtils::checkData

if(!isset($_POST["adduser"])){
    header("Location: ../createuser.php?error=server");
    exit();
}
if($_SESSION["permissions"][0]->level < 50){
    header("Location: ../createuser.php?error=accessdenied");
    exit();
}
$database = new MSQDB;
$uniqName = $_POST["uniquename"];
$userName = $_POST["uname"];
$userPassword = $_POST["pwd"];
$userPasswordRepeat = $_POST["pwd-repeat"];
if(Author::doesExist($database, $uniqName) === true){
    header("Location: ../createuser.php?error=nametaken");
    exit();
}
$lastId = Author::createAuthor($database, $uniqName, $userName, $userPassword, $userPasswordRepeat);
mysqli_close($database->conn);
header("Location: ../editAuthor.php?author=".$uniqName);
exit();