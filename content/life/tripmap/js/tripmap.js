var map = null;
var imageWall = document.getElementById("image-wall");
var imageWallTitle = document.getElementById("image-wall-title");

var places = null;
var placeMap = new Map();

var imageContainer = document.getElementById("image-container");
// 图片节点缓存
var imagePool = new Array();

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


// 将所有图片节点删除并放入缓存
function collectAllImageDom(){
    //imageDoms是动态的
    var imageDoms = imageContainer.getElementsByTagName("img");
    var imageDomCount = imageDoms.length || 0;
    var i;
    for(i=0; i<imageDomCount; i++){
        imageDoms[0].src = "";
        imagePool.push(imageContainer.removeChild(imageDoms[0]));
    }
    // while(imageContainer.hasChildNodes()){
    //     imagePool.push(imageContainer.removeChild(imageContainer.firstChild));
    // }
}

// marker点击事件
function onMarkerClick(e){
    // 滑到顶端
    imageWall.scrollTop = 0;
    // 先收回所有图片节点，再显示
    collectAllImageDom();
    var name = e.target.getTitle();
    var place = placeMap.get(name);
    imageWallTitle.innerText = name;

    imageWall.style.display = "block";

    place.images.forEach(function(url){
        var image = imagePool.pop() || new Image();
        image.src = url;
        image.className = "image";
        imageContainer.appendChild(image);
    });
    // var i;
    // var url;
    // var image;
    // for(i=0; i<place.images.length; i++){
    //     url = place.images[i];
    //     image = imagePool.pop() || new Image();
    //     image.src = url;
    //     image.className = "image";
    //     imageContainer.appendChild(image);
    //     console.log(i);
    //     console.log(image);
    // }

    // 其他工作完成再进行显示
}


// imageWall关闭事件
function closeImageWall(){
    imageWall.style.display = "none";
}


// 地方的Json请求
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