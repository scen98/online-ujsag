<?php 
    require "header.php";
    ?>
  <!-- <script type="module" src="js/createuserController.js"></script> -->
    <div class="container">
        <form action="includes/createuser.inc.php" method="post">
        <p><?php require "includes/messages/addusermessage.php" ?></p>
        <label for="newuniquename"><b>Felhasználó név: (az egyedi név, amellyel majd be tud lépni a felhasználó)</b></label>
        <input class="login-input" type="text" placeholder="Enter Username" name="newuniquename" required>
        <label for="newuname"><b>Új felhasználó neve: (ami majd megjelenik a megjelent cikkek mellett)</b></label>
        <input class="login-input" type="text" placeholder="Enter Username" name="newuname" required>
        <label for="newpwd"><b>Új felhaszhnáló jelszava: </b></label>
        <input class="login-input" type="password" placeholder="Enter Password" name="newpwd" required>
        <label for="newpwd-repeat"><b>Új felhaszhnáló jelszava ismét: </b></label>
        <input class="login-input" type="password" placeholder="Enter Password" name="newpwd-repeat" required>
        <button id="add-btn" onclick="addColumn()" type="button" style="display: none;" class="addbutton"><i class="fas fa-plus"></i></button>
        <button id="remove-btn" onclick="removeColumn()" type="button" style="display: none;" class="removebutton" ><i class="fas fa-minus"></i></button>
         <br>
        <div id="permission-details">
        </div>
        <br>
        <button class="loginbutton" name="adduser" type="submit">Regisztráció</button>
        </form>
</div>


<?php
    require "footer.php";
    ?>
