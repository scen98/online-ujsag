<?php 
class ArticleComment{
    public $id;
    public $text;
    public $articleId;
    public $authorId;
    public $date;
    public $authorName;
    function __construct($id, $text, $articleId, $authorId, $date, $authorName){
        $this->id = $id;
        $this->text = $text;
        $this->articleId = $articleId;
        $this->authorId = $authorId;
        $this->date = $date;
        $this->authorName = $authorName;
    }

    public static function selectByArticle($mysqlidb, $articleId){
        $comment_array = array();
        $sql = "SELECT articleComments.id, articleComments.text, articleComments.articleId, articleComments.authorId, date, authors.name FROM articleComments
        INNER JOIN authors ON articleComments.authorId = authors.id
        WHERE articleComments.articleId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return NULL;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $comment = new ArticleComment($row["id"], $row["text"], $row["articleId"], $row["authorId"], $row["date"], $row["name"]);
            array_push($comment_array, $comment);
        }
        return $comment_array;   
    }
    
    public static function insert($mysqlidb, $articleComment){ 
        $sql = "INSERT INTO articleComments (text, articleId, authorId, date) VALUES (?, ?, ?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "siis", $articleComment->text, $articleComment->articleId, $articleComment->authorId, $articleComment->date);
        if(mysqli_stmt_execute($stmt)){
            $newId =  mysqli_insert_id($mysqlidb->conn);
            return $newId;       
        } 
        return NULL;
    }
    
    public static function delete($mysqlidb, $id){ //unchecked
        $sql = "DELETE FROM articleComments WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        mysqli_stmt_bind_param($stmt, "i", $id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } 
        return false;
    }
}

