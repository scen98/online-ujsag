<?php
require "header.php";
//require "includes/edit.inc.php";
?>
<script type="module" src="js/editxController.js"></script>
<div class="container">
    <p id="message"></p>
    <form>
        <textarea id="title" name="title" rows="2" type="text" class="titleInput" placeholder="Cím"></textarea><br><br>
        <textarea id="lead" class="leadInput" rows="4" placeholder="Bevezető" cols="50"></textarea><br><br>
        <label>Rovat:  </label>
        <select name="column" class="columnselect" id="column-select"></select><br>
        <label>Kép:  </label>
        <input id="img-path" name="img-path" type="text" class="imgsrc">
        <button id="open-img-path-btn" type="button"><i class="fas fa-external-link-square-alt"></i></button>
        <br>
    </form>
    <h3>Tokenek: </h3>
        <div id="token-table">
        </div>
    <h3>Cikk státusza: </h3>
    <select class="columnselect" id="state-select">
        <option value="0">Írás alatt</option>
        <option value="1">Ellenőrzésre vár</option>
        <option value="2">Kész</option>
        <option value="3">Archív</option>
    </select>
   <button id="check-btn" title="Státusz mentése" class="acceptBtn"><i class="fas fa-check-square"></i></button>
   <div>
        <h4>Állapot: </p> <p id="state"></h4>
        <p id="lock-message"></p>
        <button id="lock-btn" ></button>  
    </div>
   <?php require "textedit.php"?>
    <?php require "comments.php"?>
</div>
</div>  
<div id="state-modal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    <span id="change-close-span" class="close">&times;</span>
    <p>A cikk nem rendelkezik a szükséges tokenekkel. Biztosan szeretné folytatni?</p>
    <div class="center">
        <button class="modal-btn blue" id="save-state-btn" type="button">Megerősít</button>
        <button class="modal-btn red" id="hide-state-modal-btn" type="button">Mégse</button>
    </div>
  </div>
</div>  

<?php
require "footer.php";
?>