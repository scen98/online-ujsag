<?php
require "../objects/token.php";
require "../MSQDB.php";
require "../objects/accessmanager.php";
require "requestutils.php";
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
if($data->columnId === 0){
    $data->columnId = null;
}
$database = new MSQDB;
if(AccessManager::isTokenAccessible($data)){
    if(Token::update($database, $data)){
        RequestUtils::sendSuccess();
    } else {
        RequestUtils::sqlError();
    }
} else {
    RequestUtils::permissionDenied();
}