<?php
class MSQDB {
    private $servername = "mi3-ss57.a2hosting.com";
    private $dBUserName = "szbeneu_magaziner";
    private $dBPassword = "MagazinePhp";
    private $dBName = "szbeneu_magazine";

    public $conn; 

    public function __construct()
    {
        $this->conn = new mysqli($this->servername, $this->dBUserName, $this->dBPassword, $this->dBName);
        if ($this->conn -> connect_errno) {
            echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
            exit();
          }
    }
}