/**
 * 菜单的开关逻辑
 */
var menuSwitchContainer = document.getElementById("menu-switch-container");
var menuSwitchIcon = document.getElementById("menu-switch-icon");
var nav = document.getElementById("nav");
var isMenuShow = false;
menuSwitchContainer.addEventListener("click",function(){
    if(isMenuShow){
        nav.style.display = "none";
        menuSwitchContainer.style.backgroundColor = "#2980b9";
        isMenuShow = false;
    }else{
        nav.style.display = "block";
        menuSwitchContainer.style.backgroundColor = "#404040";
        isMenuShow = true;
    }
});