import * as utils from "../amp/js/utils.js";
import * as doc from "../amp/js/doc.js";
window.onscroll = function() {handleHeader()};
let header = document.getElementById("myTopnav") as HTMLElement;
let sticky = header.offsetTop;
let searchInput = doc.getInput("search-input");
let searchIcon = doc.get("search-icon");
init();
function init(){
    setActive();
    doc.addClick(searchIcon, toggleSearchIcon);
    doc.addClick("hamburger-menu", displayMenu);
    doc.addEnter(searchInput, search);
}

function search(){
  console.log("asd");
  window.location.href = encodeURI(`../magazine/archiv.php?search=${encodeURIComponent(searchInput.value)}`);
}

function setActive(){
    let columnId = parseInt(utils.getUrlParameter("cid"));
    if(columnId > 0){
        doc.get(`menu-${columnId}`).classList.add("active");
    } else {  
        doc.get("menu-0").classList.add("active");
    }
}

function displayMenu() {
  let x = doc.get("myTopnav");
  if (!x.classList.contains("responsive")) {
    x.classList.add("responsive");
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  } else {
      x.classList.remove("responsive");
  }
}

function handleHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

function toggleSearchIcon(){
  if(searchInput.style.display === "block"){
    searchInput.style.display = "none";
    searchIcon.classList.remove("mainRed");
  } else {
    searchInput.style.display = "block";
    searchInput.focus(); 
    searchIcon.classList.add("mainRed"); 
  }
}