<?php
session_start();
session_destroy();
$past = time() - 3600;
foreach($_COOKIE as $name => $value){
    setcookie($name, "", $past, "/");
}