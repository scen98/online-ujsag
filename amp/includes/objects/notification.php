<?php
class Notification{
    function __construct($id, $type, $articleId, $authorId, $date){
        $this->id = $id;
        $this->type = $type;
        $this->articleId = $articleId;
        $this->authorId = $authorId;
        $this->date = $date;
    }
}