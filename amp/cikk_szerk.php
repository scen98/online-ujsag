<?php
require "header.php";
//require "includes/edit.inc.php";
?>
<script type="module" src="js/editController.js" ></script>
<div class="container">
    <p id="message"></p>
    <form>
        <textarea id="title" name="title" rows="2" type="text" class="titleInput" placeholder="Cím"></textarea><br><br>
        <textarea id="lead" class="leadInput" rows="4" placeholder="Bevezető" cols="50"></textarea><br><br>
        <label>Rovat:  </label>
        <select name="column" class="columnselect" id="column-select"></select><br>
        <label>Kép:  </label>
        <input id="img-path" name="img-path" type="text" class="imgsrc">
        <button id="open-img-path-btn" type="button"><i class="fas fa-external-link-square-alt"></i></button><br>
        <select id="state-select" class="columnselect">
            <option value="-1">Piszkozat</option>
            <option value="0">Írás alatt</option>
            <option value="1">Ellenőrzésre vár</option>
        </select> 
        <button id="change-state-button" type="button" class="commandBtn" >Publikáció</button>
    </form>
    <div>
      <button id="delete-btn" type="button" class="delete-btn red">Cikk törlése</button>
    </div>
    <?php require "textedit.php"?>
    <?php require "comments.php" ?>
    </div>
<div id="myModal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    <span id="hide-modal-btn1" class="close">&times;</span>
    <p>Biztosan törölni szeretné ezt a cikket?</p>
    <div class="center">
        <button class="modal-btn red" id="delete-article-btn" type="button">Törlés</button>
        <button class="modal-btn blue" id="hide-modal-btn2" type="button">Mégse</button>
    </div>
    
  </div>
</div>  

<?php
require "footer.php";
?>