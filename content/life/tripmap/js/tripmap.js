var map = null;
var imageWall = document.getElementById("image-wall");
var imageWallTitle = document.getElementById("image-wall-title");

var places = null;
var placeMap = new Map();

var imageContainer = document.getElementById("image-container");

var tripPos = 
[
    [113.304734,22.502695], // 中山沙溪
    [118.085972,24.601109], // 华大厦门校区
    [118.066878,24.444961], // 厦门鼓浪屿
    [108.935823,34.338884], // 西安
    [116.413831,39.550047], // 北京
    [114.194592,30.594695], // 武汉
    [112.939404,28.211729], // 长沙
    [112.406568,34.596369], // 洛阳
];


function initmap(){
    map = new AMap.Map("map",{
        zoom: 2
    });

    getPlacesJson();

    // tripPos.forEach(function(pos){
    //     addMarker(pos);
    // });
}

function addMarker(place){
    var marker = new AMap.Marker({
        icon: "images/locate.png",
        position: place.pos,
        offset: new AMap.Pixel(-24,-48),
        title: place.name,
        map: map
    });

    // 添加点击事件
    AMap.event.addListener(marker,"click",onMarkerClick);
}
// marker点击事件
function onMarkerClick(e){
    imageWall.style.display = "block";
    
    var name = e.target.getTitle();
    var place = placeMap.get(name);

    imageWallTitle.innerText = name;

    place.images.forEach(function(url){
        var image = new Image();
        image.src = url;
        image.className = "image";
        imageContainer.appendChild(image);
    });
}

// imageWall关闭事件
function closeImageWall(){
    imageWall.style.display = "none";
}

function getPlacesJson(){
    var request = new XMLHttpRequest();
    var url = "places.json";
    request.onreadystatechange = function(){
        if(request.readyState === 4 && request.status === 200){
            var jsonData = JSON.parse(request.responseText);
            places = jsonData.places;
            places.forEach(function(place){
                placeMap.set(place.name,place);
                addMarker(place);
            })
            console.log(placeMap);
        }
    }
    request.open("GET",url,true);
    request.send();
}