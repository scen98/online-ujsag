<?php
    require "includes/objects/permission.php";
    require "includes/objects/tokenpermission.php";
    session_start();
    if(!isset($_SESSION["permissions"][0])){
        header("Location: ../amp/login.php?error=timeout");
        exit();
    }
    ?>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/styles.css" />
    <script src="https://kit.fontawesome.com/2eba930695.js"></script>
    <script type="module" src="js/headerController.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Magazine - Szerkesztőség</title>
</head>
<body>
    <header>
        <div class="topnav" id="top-nav">
            <a href="en.php?szerzo=<?php echo $_SESSION["id"] ?>"><i class="fas fa-user"></i></a>
            <a href="uj_cikk.php">Új cikk</a>
            <a href="cikkeim.php">Cikkeim</a>
            <a id="awaiting-articles" href="publikacio.php">Publikáció</a>
            <a id="position-page" href="lapszerkeszto.php">Lapszerkesztő</a>
            <a id="tokens" href="tokenek.php">Tokenek</a>
            <a href="szerzok.php">Szerzők</a>
            <a id="create-user" href="uj_szerzo.php">Új szerző</a>
            <a href="../index.php" target="blank" >Újság</a>
            <a id="hamburger-menu" href="javascript:void(0);" class="icon">
                <i class="fa fa-bars"></i>
            </a> 
        </div>
    </header>
