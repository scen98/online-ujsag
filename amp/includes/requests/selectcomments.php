<?php
  require_once "../MSQDB.php";
  require_once "../objects/articlecomment.php";
  require_once "requestutils.php";
session_start();
if(!isset($_SESSION["id"])){
  RequestUtils::permissionDenied();
}

$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$articleComments = ArticleComment::selectByArticle($database, $data->articleId);
if(is_null($articleComments)){
  RequestUtils::sqlError();
}
RequestUtils::returnData("articleComments", $articleComments);