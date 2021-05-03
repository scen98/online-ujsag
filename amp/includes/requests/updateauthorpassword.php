<?php
require "../objects/author.php";
require "requestutils.php";
require "../MSQDB.php";
session_start();
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
if(!canUpdatePw($database, $data)){
    RequestUtils::permissionDenied();
}
if(Author::updatePassword($database, $data)){
    RequestUtils::sendSuccess();
}

RequestUtils::sendFail();

function canUpdatePw($database, $data){
    $validMe = Author::selectAuthorByUserName($database, $_SESSION["uniqName"]);
    if(!password_verify($data->requesterPassword, $validMe->password)){
        return false;
    }
    if($_SESSION["permissions"][0]->level >= 50 || $data->id === $_SESSION["id"]){
        return true;
    }
    return false;
}