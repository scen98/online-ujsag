<?php
require_once "objects/author.php";
require_once "MSQDB.php";
require_once "objects/accessmanager.php";

if(!isset($_POST["login"])){
    header("Location: ../login.php?error=server");
    exit();
}
$database = new MSQDB;
$userName = $_POST["userName"];
$password = $_POST["password"];
//$userName = "szvirag";
//$password = "főnök1";
//$validAuthor = Author::getAuthor($database, $userName);
$validAuthor = Author::selectAuthorByUserName($database, $userName);
//echo $validAuthor->password;

if(!password_verify($password, $validAuthor->password)){
    header("Location: ../login.php?error=wrongd");
    exit();
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
header("Location: ../en.php?szerzo=".$validAuthor->id);
exit();

