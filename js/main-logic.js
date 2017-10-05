/**
 * 菜单的开关逻辑
 */
var menuSwitch = document.getElementById("menu-switch");
var nav = document.getElementById("nav");
var isMenuShow = false;
menuSwitch.addEventListener("click",function(){
    if(isMenuShow){
        nav.style.display = "none";
        isMenuShow = false;
    }else{
        nav.style.display = "block";
        isMenuShow = true;
    }
});