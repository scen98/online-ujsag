<?php 
    require "header.php";
    if(!isset($_SESSION["permissions"][0])){
        header("Location: index.php?error=accessdenied");
        exit();
    }
    ?>
    <script type="module" src="js/editauthorController.js"></script>
 <div class="container">
        <h2 id="user-name" class="authorTitle">Név</h2>
        <h3 id="uniq-name" class="authorUniq">Felhasználónév</h3>
        <div id="permission-settings" style="display: none" class="settingBox">
        <h2>Általános jogosultságok beállításai: </h2> 
        <label>Jogosultság típus megváltoztatása: </label>
        <select id="permission-type" class="columnselect">
            <option value="10">Általános</option>
            <option value="20">Rovat irányító</option>
            <option value="40">Újságvezető</option>
        </select>

        <button id="change-permission-btn" type="button" class="commandBtn shine"  >Megváltoztat</button>
        <p class="note" >A jogosultság típus megváltoztatása az összes eddigi jogosultság törlésével jár, beleértve a tokenekhez való jogokat is.</p>
        <div style="display: none" id="add-permission">
        <label>Jogosultság hozzáadása: </label>
        <select id="permission-column-select" class="columnselect">

        </select>
        <select id="column-permission-level" class="columnselect">
            <option value="20">Rovatsegéd</option>
            <option value="30">Rovatvezető</option>
        </select>
        <button id="add-column-permission-btn" class="plusBtn"><i class="fas fa-plus-square"></i></button>
        </div>
        <h3>Jelenlegi jogosultságok:</h3>
        <div id="permission-table" class="tableContainer">
        </div>
        </div>
        <div id="token-permissions" class="settingBox" >
        <h2>Token jogosultságok beállítása: </h2>
        <h3>Felhasználó token jogosultságai: </h3>
        <div id="author-token-table" class="tableContainer">
            
        </div>
        <h3>Jogosultság hozzáadása</h3>
        <div id="my-token-table" class="tableContainer">

        </div>
        </div>
        <div id="password-change-box" class="settingBox" style="display: none;">
            <h3>Felhasználó jelszavának megváltoztatása</h3>
            <label><b>Új jelszó:</b></label>
            <input input class="login-input" type="password" placeholder="Jelszó először" id="new-pw-1" required>
            <label ></label><b>Új jelszó ismét:</b></label>
            <input class="login-input" type="password" placeholder="Jelszó másodszor" id="new-pw-2" required>
            <label for="psw"><b>Rendszergazdai jelszó:</b></label>
            <input class="login-input" type="password" placeholder="Az én jelszavam" id="my-pw" required>
            <p id="pw-message"></p>
            <button id="change-pw" class="loginbutton" type="button">Jelszó megváltoztatása</button>
        </div>
</div>
<?php
    require "footer.php";
    ?>
