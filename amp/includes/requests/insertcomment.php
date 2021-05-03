<?php
require "../objects/articlecomment.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();

$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
if($_SESSION["id"] !== $data->authorId){
    RequestUtils::permissionDenied();
}
$database = new MSQDB;
$data->date = date("Y-m-d H:i:s");
$newId = ArticleComment::insert($database, $data);
if(is_null($newId)){
    RequestUtils::sqlError();
} else {
    RequestUtils::returnData("newId", $newId);
}