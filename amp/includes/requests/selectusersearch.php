<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "requestutils.php";
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$article_array = array();
if(isset($data->authorId)){
  $article_array = Article::selectUserSearchByAuthor($database, $data->authorId, $data->limit, $data->offset);
} else {
  $article_array = Article::selectUserSearch($database, $data->keyword, $data->limit, $data->offset);
}

if(is_null($article_array)){
    RequestUtils::sqlerror();
} else {
    RequestUtils::returnData("articles", $article_array);
}