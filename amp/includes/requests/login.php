<?php
require_once "../objects/author.php";
require_once "../MSQDB.php";
require_once "../objects/accessmanager.php";
require_once "requestutils.php";

$data = json_decode(file_get_contents("php://input"));

$database = new MSQDB;

$validAuthor = Author::selectAuthorByUserName($database, $data->userName);

if(!password_verify($data->password, $validAuthor->password)){
    RequestUtils::permissionDenied();
}
if(isset($_SESSION)){
    session_destroy();
}
session_start();
$_SESSION["id"] = $validAuthor->id;
$_SESSION["userName"] = $validAuthor->userName;
$_SESSION["uniqName"] = $validAuthor->uniqName;
//$_SESSION["permissions"] = Permission::selectPermissionsByAID($database, $validAuthor->id);
$_SESSION["permissions"] = $validAuthor->permissions;
$_SESSION["tokenPermissions"] = $validAuthor->tokenPermissions;
setcookie("uid", $validAuthor->id, 0, "/");
setcookie("userName", $validAuthor->userName, 0, "/");
setcookie("uniqName", $validAuthor->uniqName, 0, "/");
setcookie("highestPerm", AccessManager::getMaxLevel(), 0, "/");
RequestUtils::sendSuccess();