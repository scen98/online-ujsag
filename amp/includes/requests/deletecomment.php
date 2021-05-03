<?php
require_once "../MSQDB.php";
require_once "../objects/articlecomment.php";
require_once "requestutils.php";
session_start();
$data = json_decode(file_get_contents("php://input"));
$database = new MSQDB;
RequestUtils::checkData($data);
if($_SESSION["id"] !== $data->authorId){
    RequestUtils::permissionDenied();
}
$database = new MSQDB;
if(ArticleComment::delete($database, $data->id)){
    RequestUtils::sendSuccess();
} else {
    RequestUtils::sendFail();
}