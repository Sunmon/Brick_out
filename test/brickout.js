// 전역변수
var canvas;
var context;
var block_width = canvas.width / 15;
var block_height = 10;

// window load시 실행될 함수
window.onload = function(){
    init();
    
}


//init stage
function init()
{
    canvas = document.getElementById("frame");
    context = canvas.getContext("2d");
}


//블럭 객체 생성
function createBlock(x, y)
{


    // 뭘로 해야 할 지 몰라서 일단 div로 설정.
    // TODO: object 되나??
    var newBlock = document.createElement("div");


    

}