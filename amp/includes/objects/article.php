<?php
require "tokeninstance.php";
class Article {
    public $id;
    public $title;
    public $lead;
    public $authorId;
    public $date;
    public $imgPath;
    public $columnId;
    public $text;

    function __construct($id, $title, $lead, $authorId, $date, $imgPath, $columnId, $text){
        $this->id = $id;
        $this->title = $title;
        $this->lead = $lead;
        $this->authorId = $authorId;
        $this->date = $date;
        $this->imgPath = $imgPath;
        $this->columnId = $columnId;
        $this->text = $text;
    }

    public static function insertArticle($mysqlidb, $newArticle){
        $sql = "INSERT INTO articles (title, lead, authorId, date, imgPath, columnId, text, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        $state = 0;
        mysqli_stmt_bind_param($stmt, "ssissisi", $newArticle->title, $newArticle->lead, $newArticle->authorId, $newArticle->date, $newArticle->imgPath, $newArticle->columnId, $newArticle->text, $state);
        if(mysqli_stmt_execute($stmt)){
            $newId =  mysqli_insert_id($mysqlidb->conn);
            if(Article::insertLock($mysqlidb, $newId) === true){
                return $newId;
            }
        } else {
            return NULL;
        }
    }

    public static function selectByBlock($mysqlidb, $blockId){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.imgPath, articles.columnId, articles.date, articles.authorId, authors.name as authorName, columns.name as columnName, positions.htmlId FROM articles
        INNER JOIN positions ON positions.articleId = articles.id
        INNER JOIN positionBlocks ON positionBlocks.id = positions.blockId
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON columns.id = articles.columnId
        WHERE positionBlocks.id = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $blockId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->authorName = $row["authorName"];
            $article->columnName = $row["columnName"];
            $article->htmlId = $row["htmlId"];
            array_push($article_array, $article);
        }
        return $article_array; 
    }

    public static function selectSideArticles($mysqlidb, $columnId){
        if($columnId === 0 || is_null($columnId)){
            return Article::selectMainSideArticles($mysqlidb);
        }
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.date, articles.imgPath, articles.authorId, articles.columnId, authors.name as authorName, columns.name as columnName, positions.htmlId FROM articles
        INNER JOIN positions ON positions.articleId = articles.id
        INNER JOIN positionBlocks ON positionBlocks.id = positions.blockId
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON columns.id = articles.columnId
        WHERE positionBlocks.main = 0 AND positionBlocks.columnId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $columnId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->authorName = $row["authorName"];
            $article->columnName = $row["columnName"];
            $article->htmlId = $row["htmlId"];
            array_push($article_array, $article);
        }
        return $article_array; 
    }

    public static function selectMainSideArticles($mysqlidb){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.imgPath, articles.columnId, articles.date, articles.authorId, authors.name as authorName, columns.name as columnName, positions.htmlId FROM articles
        INNER JOIN positions ON positions.articleId = articles.id
        INNER JOIN positionBlocks ON positionBlocks.id = positions.blockId
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON columns.id = articles.columnId
        WHERE positionBlocks.main = 0 AND positionBlocks.columnId IS NULL;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->authorName = $row["authorName"];
            $article->columnName = $row["columnName"];
            $article->htmlId = $row["htmlId"];
            array_push($article_array, $article);
        }
        return $article_array;   
    }

    public static function selectUserSearch($mysqlidb, $keyword, $limit, $offset){ ///magazine
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.date, articles.authorId, articles.imgPath, articles.columnId,
        authors.name as authorName, columns.name as columnName
        FROM articles
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON articles.columnId = columns.id
        WHERE articles.state > 1 AND (articles.title LIKE CONCAT('%',?,'%') OR articles.lead LIKE CONCAT('%',?,'%'))
        ORDER BY articles.date DESC
        LIMIT ? OFFSET ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "ssii", $keyword, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->authorName = $row["authorName"];
            $article->columnName = $row["columnName"];
            array_push($article_array, $article);
        }
        return $article_array;  
    }

    public static function selectUserSearchByAuthor($mysqlidb, $authorId, $limit, $offset){ //magazine
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.date, articles.authorId, articles.imgPath, articles.columnId,
        columns.name as columnName
        FROM articles
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON articles.columnId = columns.id
        WHERE articles.state > 1 AND articles.authorId = ?
        ORDER BY articles.date DESC
        LIMIT ? OFFSET ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "iii", $authorId, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->columnName = $row["columnName"];
            array_push($article_array, $article);
        }
        return $article_array;  
    }

    public static function selectByBlockColumn($mysqlidb, $columnId){
        if($columnId === 0 || is_null($columnId)){
            return Article::selectMainPageArticles($mysqlidb);
        }
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.date, articles.imgPath, articles.authorId, articles.columnId, authors.name as authorName, columns.name as columnName, positions.htmlId 
        FROM articles
        INNER JOIN positions ON positions.articleId = articles.id
        INNER JOIN positionBlocks ON positionBlocks.id = positions.blockId
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON columns.id = articles.columnId
        WHERE positionBlocks.main = 1 AND positionBlocks.columnId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $columnId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->authorName = $row["authorName"];
            $article->columnName = $row["columnName"];
            $article->htmlId = $row["htmlId"];
            array_push($article_array, $article);
        }
        return $article_array; 
    }

    public static function selectMainPageArticles($mysqlidb){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.imgPath, articles.columnId, articles.date, articles.authorId, authors.name as authorName, columns.name as columnName, positions.htmlId FROM articles
        INNER JOIN positions ON positions.articleId = articles.id
        INNER JOIN positionBlocks ON positionBlocks.id = positions.blockId
        INNER JOIN authors ON authors.id = articles.authorId
        INNER JOIN columns ON columns.id = articles.columnId
        WHERE positionBlocks.main = 1 AND positionBlocks.columnId IS NULL;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"],  $row["columnId"], "");
            $article->authorName = $row["authorName"];
            $article->columnName = $row["columnName"];
            $article->htmlId = $row["htmlId"];
            array_push($article_array, $article);
        }
        return $article_array;   
    }

    public static function insertLock($mysqlidb, $articleId){
        $sql = "INSERT INTO locks (isLocked, articleId) VALUES (?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        $lock = 0;
        mysqli_stmt_bind_param($stmt, "ii", $lock, $articleId);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }
    }

    public static function updateArticle($mysqlidb, $newArticle){
        $currentDate = date("Y-m-d H:i:s");
        $sql = "UPDATE articles SET title = ?, lead = ?, date = ?, imgPath = ?, columnId = ?, text = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "ssssisi", $newArticle->title, $newArticle->lead, $currentDate, $newArticle->imgPath, $newArticle->columnId, $newArticle->text, $newArticle->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }

    public static function updateArticleState($mysqlidb, $newArticle){
        $currentDate = date("Y-m-d H:i:s");
        $sql = "UPDATE articles SET state = ?, date = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false; 
        }
        mysqli_stmt_bind_param($stmt, "isi", $newArticle->state, $currentDate, $newArticle->id);
        if(!mysqli_stmt_execute($stmt)){
            return false;
        }
        if($newArticle->state < 1){
            TokenInstance::deleteByArticleId($mysqlidb, $newArticle->id);
        }
        return true;
    }

    public static function getArticle($mysqlidb, $articleId){
        $article;
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.imgPath, articles.columnId, articles.text,
        locks.isLocked, locks.lockedBy, articles.state, authors.name
        FROM articles 
        INNER JOIN locks ON articles.id = locks.articleId
        INNER JOIN authors ON authors.id = articles.authorId
        WHERE articles.id=?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"], $row["columnId"], $row["text"]);
            $article->isLocked = $row["isLocked"];
            $article->lockedBy = $row["lockedBy"];
            $article->state = $row["state"];
            $article->authorName = $row["name"];
        }
        return $article;
    }

    public static function selectWithAuthor($mysqlidb, $articleId){
        $article;
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.columnId, articles.state, authors.name
        FROM articles 
        INNER JOIN authors ON articles.authorId = authors.id
        WHERE articles.id=?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], "", $row["columnId"], "");
            $article->state = $row["state"];
            $article->authorName = $row["name"];
        }
        return $article;
    }

    public static function selectByState($mysqlidb, $keyword, $limit, $offset, $state){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.columnId, articles.state,
        locks.isLocked, locks.lockedBy, authors.name
        FROM articles
        INNER JOIN locks on articles.id = locks.articleId
        INNER JOIN authors ON articles.authorId = authors.id
        WHERE articles.state = ? AND (articles.title LIKE CONCAT('%',?,'%') OR articles.lead LIKE CONCAT('%',?,'%'))
        ORDER BY locks.isLocked DESC, articles.date
        LIMIT ? OFFSET ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }     
        mysqli_stmt_bind_param($stmt, "issii", $state, $keyword, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], "",  $row["columnId"], "");
            $article->isLocked = $row["isLocked"];
            $article->lockedBy = $row["lockedBy"];
            $article->state = $row["state"];
            $article->authorName = $row["name"];
            if($article->state > 0){
                $article->tokenInstances = TokenInstance::selectByArticleId($mysqlidb, $article->id);
            }
            array_push($article_array, $article);
        }
        return $article_array;       
    }

    public static function selectByStateAndColumn($mysqlidb, $keyword, $limit, $offset, $columnId, $state){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.columnId, articles.state,
        locks.isLocked, locks.lockedBy, authors.name
        FROM articles
        INNER JOIN locks on articles.id = locks.articleId
        INNER JOIN authors ON articles.authorId = authors.id
        WHERE articles.state = ? AND articles.columnId = ? AND (articles.title LIKE CONCAT('%',?,'%') OR articles.lead LIKE CONCAT('%',?,'%'))
        ORDER BY locks.isLocked DESC, articles.date
        LIMIT ? OFFSET ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }     
        mysqli_stmt_bind_param($stmt, "iissii", $state, $columnId, $keyword, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], "",  $row["columnId"], "");
            $article->isLocked = $row["isLocked"];
            $article->lockedBy = $row["lockedBy"];
            $article->state = $row["state"];
            $article->authorName = $row["name"];
            if($article->state > 0){
                $article->tokenInstances = TokenInstance::selectByArticleId($mysqlidb, $article->id);
            }
            array_push($article_array, $article);
        }
        return $article_array;     
    }

    public static function selectLock($mysqlidb, $articleId){
        $lock = new stdClass();
        $sql = "SELECT * FROM locks WHERE articleId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $lock->id = $row["id"];
            $lock->isLocked = $row["isLocked"];
            $lock->lockedBy = $row["lockedBy"];
        }
        return $lock;
    }

    public static function selectByAuthorId($mysqlidb, $authorId, $keyword, $state, $columnId, $limit, $offset){
        $article_array = array();
        $sql;
        if($columnId === 0){
            $sql = "SELECT id, title, lead, imgPath, date, columnId, state
            FROM articles 
            WHERE authorId = ? AND (title LIKE CONCAT('%',?,'%') OR lead LIKE CONCAT('%',?,'%')) AND state = ? 
            ORDER BY date DESC 
            LIMIT ? OFFSET ?;";
        } else {
            return Article::selectByAuthorIdAndColumn($mysqlidb, $authorId, $keyword, $state, $columnId, $limit, $offset);
        }
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }        
        mysqli_stmt_bind_param($stmt, "issiii", $authorId, $keyword, $keyword, $state, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $authorId, $row["date"], $row["imgPath"], $row["columnId"], "");
            $article->state = $row["state"];
            if($article->state > 0){
                $article->tokenInstances = TokenInstance::selectByArticleId($mysqlidb, $article->id);
            }
            array_push($article_array, $article);
        }
        return $article_array;
    }

    public static function selectByAuthorIdAndColumn($mysqlidb, $authorId, $keyword, $state, $columnId, $limit, $offset){
        $article_array = array();
        $sql = "SELECT id, title, lead, imgPath, date, state
        FROM articles 
        WHERE authorId = ? AND (title LIKE CONCAT('%',?,'%') OR lead LIKE CONCAT('%',?,'%')) AND state = ? AND columnId = ?
        ORDER BY date DESC 
        LIMIT ? OFFSET ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }        
        mysqli_stmt_bind_param($stmt, "issiiii", $authorId, $keyword, $keyword, $state, $columnId, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $authorId, $row["date"], $row["imgPath"], $columnId, "");
            $article->state = $row["state"];
            if($article->state > 0){
                $article->tokenInstances = TokenInstance::selectByArticleId($mysqlidb, $article->id);
            }
            array_push($article_array, $article);
        }
        return $article_array;
    }

    public static function selectStaticArticle($mysqlidb, $id){

    }

    public static function deleteArticle($mysqlidb, $articleId){
        $sql = "DELETE from articles WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return false;
        } else {
            return true;
        }
    }

    public static function lockArticle($mysqlidb, $article){
        $sql = "UPDATE locks SET isLocked = ?, lockedBy = ? WHERE articleId = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "iii", $article->isLocked, $article->lockedBy, $article->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }
}