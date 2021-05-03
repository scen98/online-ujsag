<?php
require "permission.php";
require "tokenpermission.php";
class Author{
    public $id;
    public $userName;
    public $uniqName;
    public $password;
    public $permissions = array();
    public $tokenPermissions = array();
    function __construct($id, $userName, $name, $password){
        $this->id = intval($id);
        $this->uniqName = $userName;
        $this->userName = $name;
        $this->password = $password;
    }

    public static function createAuthor($mysqlidb, $uniqName, $userName, $userPassword, $userPasswordRepeat){ //TODO classként mer azé na
        Author::checkFields($userName, $userPassword, $userPasswordRepeat);
        Author::checkPasswords($userPassword, $userPasswordRepeat);
        $sql = "INSERT INTO authors (userName, name, password) VALUES (?, ?, ?)";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../createuser.php?error=sql");
            exit();    
        }
        $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);
        mysqli_stmt_bind_param($stmt, "sss", $uniqName, $userName, $hashedPassword);
        if(mysqli_stmt_execute($stmt)){
            return mysqli_insert_id($mysqlidb->conn);
        } else {
            return NULL;
        }
    }

    public static function doesExist($mysqlidb, $uniqName){
        $sql = "SELECT id FROM authors WHERE userName = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../createuser.php?error=sql");
            exit();
        }
        mysqli_stmt_bind_param($stmt, "s", $uniqName);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $id_array = array();
        while($row = mysqli_fetch_assoc($result)){
            array_push($id_array, $row["id"]);
        }
        if(count($id_array) > 0){
            return true;
        } else {
            return false;
        }  
    }

    public static function selectAuthor($mysqlidb, $id){
        $author;
        $sql = "SELECT id, userName, name, password FROM authors WHERE id = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $author = new Author($row["id"], $row["userName"], $row["name"], $row["password"]);
        }
        $author->permissions = Permission::selectPermissionsByAID($mysqlidb, $id);
        if(count($author->permissions) > 0 && ($author->permissions[0]->level >= 20 && $author->permissions[0]->level < 40)){
            $author->tokenPermissions = TokenPermission::selectByAID($mysqlidb, $id);
        }
        return $author;
    }

    public static function selectAuthorQuery($mysqlidb, $userName){
        $author;
        $sql = "SELECT id, userName, name, password FROM authors WHERE userName = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "s", $userName);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $author = new Author($row["id"], $row["userName"], $row["name"], $row["password"]);
        }
        return $author;
    }

    public static function selectAuthorByUserName($mysqlidb, $userName){
        $author = Author::selectAuthorQuery($mysqlidb, $userName);
        $author->permissions = Permission::selectPermissionsByAID($mysqlidb, $author->id);
        if(count($author->permissions) > 0 && ($author->permissions[0]->level >= 20 && $author->permissions[0]->level < 40)){
            $author->tokenPermissions = TokenPermission::selectByAID($mysqlidb, $author->id);
        }
        return $author;
    }

    public static function selectAuthors($mysqlidb){
        $authors = Author::getAuthors($mysqlidb);
        $permissions = Permission::selectPermissions($mysqlidb);
        Author::pairPermissionsToAuthors($authors, $permissions);
        return $authors;
    }

    public static function getAuthors($mysqlidb){
        $sql = "SELECT id, name, userName FROM authors ORDER BY name;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        $author_array = array();
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $author = new Author($row["id"], $row["userName"], $row["name"], null);
            array_push($author_array, $author);
        }
        return $author_array;
    }

    public static function updatePassword($mysqlidb, $author){
        $sql = "UPDATE authors SET password = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        $hashedPassword = password_hash($author->password, PASSWORD_DEFAULT);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        mysqli_stmt_bind_param($stmt, "si", $hashedPassword, $author->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        }
        return false;
    }

    static function pairPermissionsToAuthors($authors, $permissions){
        foreach($permissions as $perm){
            Author::placePermission($authors, $perm);
        }
    }

    static function placePermission($authors, $permission){
        foreach($authors as $author){
            if($permission->authorId == $author->id){
                array_push($author->permissions, $permission);
            }
        }
    }

    static function checkFields($userName, $userPassword, $userPasswordRepeat){
        if(!isset($userName)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }
        if(!isset($userPassword)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }
    
        if(!isset($userPasswordRepeat)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }

    }

    static function checkPasswords($userPassword, $userPasswordRepeat){
        if($userPassword !== $userPasswordRepeat){
            header("Location: ../createuser.php?error=nomatch");
            exit();
        }
    }
}