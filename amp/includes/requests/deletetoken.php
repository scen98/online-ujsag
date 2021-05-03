<?php
require "../objects/accessmanager.php";
require "../objects/token.php";
require "../MSQDB.php";
require "requestutils.php";
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);

if(!AccessManager::isTokenAccessible($data)){
    RequestData::permissionDenied();
}

$database = new MSQDB;
$result = Token::delete($database, $data->id);
if($result === true){
    RequestUtils::sendSuccess();
} else {
    RequestUtils::sqlError();
}