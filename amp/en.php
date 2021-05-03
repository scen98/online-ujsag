<?php 
    require "header.php";
    if(($_SESSION["id"] !== intval($_GET["szerzo"]))){
        header("Location: index.php?error=accessdenied");
        exit();
    }
    ?>
    <script type="module" src="js/authorController.js"></script>
    <script type="module" src="js/myUserController.js"></script>
 <div class="container">
    <button id="logout-btn" class="logout-btn red" type="button">Kijelentkezés</button>
    <h1 id="author-name">Név</h1>
    <h2>Jogosultságok: </h2>
    <ul id="permission-list">
        
    </ul>
    <h2 id="token-permission-title">Token jogok:</h2>
    <ul id="token-permission-list">
    </ul>
    <div class="searchBar">
     <input placeholder="Keresés" id="search-input" class="searchInput">
        <select class="columnselect" id="column-select">
          <option value="0">Mind</option>
        </select>
        <select  id="state-select" class="columnselect">
          <option value="0">Készülő</option>
          <option value="1">Ellenőrzés alatt</option>
          <option value="2">Publikálható</option>
          <option value="3">Archív</option>
        </select>
        <button id="search-btn" type="button" class="commandBtn shine" >Mehet!</button>
    </div>
    <div id="article-table">

    </div>
    <div id="article-container">

    </div>
    <div class="centered">
    <button id="expand-btn" class="expandBtn">Mutass még</button>
    </div>
    <div id="password-change-box" class="settingBox">
            <h3>Jelszavam megváltoztatása</h3>
            <label><b>Új jelszó:</b></label>
            <input input class="login-input" type="password" placeholder="Jelszó először" id="new-pw-1" required>
            <label ></label><b>Új jelszó ismét:</b></label>
            <input class="login-input" type="password" placeholder="Jelszó másodszor" id="new-pw-2" required>
            <label for="psw"><b>Mostani jelszavam:</b></label>
            <input class="login-input" type="password" placeholder="Megváltoztatni kívánt jelszó" id="my-pw" required>
            <p id="pw-message"></p>
            <button id="change-pw" class="loginbutton" type="button">Jelszó megváltoztatása</button>
        </div>
</div>
<?php
    require "footer.php";
    ?>
