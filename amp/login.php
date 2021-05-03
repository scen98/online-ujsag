<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/styles.css" /> 
</head>
<body class="loginbg">
<script type="module" src="js/loginController.js"></script>
<div class="login-container">
<form name="loginform" onsubmit="event.preventDefault();">
    <label for="uname"><b>Felhasználónév</b></label>
    <input type="text" class="login-input" placeholder="Enter Username" name="userName" required>
    <label for="pwd"><b>Jelszó</b></label>
    <input type="password" class="login-input" placeholder="Enter Password" name="password">        
    <button type="login" class="loginbutton" id="login" name="login">Bejelentkezés</button>
    <label>
      <p id="login-msg"></p>
    </label>
</form>
</div>
</body>
</html>