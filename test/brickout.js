// 전역변수
var canvas;
var context;
var block_width;
var block_height;
var ball;
// window load시 실행될 함수
window.onload = function(){
    init();
    initStage();
ball = new BallClass(100,100);

    drawBall(ball);
}


//init stage
function init()
{
    canvas = document.getElementById("frame");
    context = canvas.getContext("2d");
    block_width = canvas.width / 15;
    block_height = 10;
}


// Block class
// https://infoscis.github.io/2018/02/13/ecmascript-6-introducing-javascript-classes/
class BlockClass
{
    // 블럭 생성자
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = block_width;
        this.height = block_height;
        this.status = true; //블럭이 있다 / 깨졌다 표시
      }
}

//블럭 객체 생성
function createBlock(x, y, color)
{
    return  new BlockClass(x,y,color);
}

// 블럭 그리기
function drawBlock(block)
{
    context.strokeStyle = block.color;
    context.strokeRect(block.x, block.y, block.width, block.height);
}

// init stage
function initStage()
{
    //블럭 그리기
    initMap();
    initScore();
    initTimer();
}

function initScore()
{
    //점수 초기화
}

function initTimer()
{
    //타이머 초기화
}

// 맵 그리기. 스테이지별로 다른 맵 하려면 캡슐화 이용해야 함. 
function initMap()
{
    // 임시적으로 맵 하나라고 가정.
    var color = ["red", "orange", "yellow", "green", "blue"];

    // TODO: block 2차원 배열 생성
    // var blocks = 이차원배열();

    // TODO: Blocks 그리기
    for(var j = 0; j< 5; j++)
    {
        for(var i = 0; i<15 - j*3; i++)
        {
            var block = createBlock(i*block_width, j*block_height, color[j]);
            drawBlock(block);
        }
    }
}




class BallClass
{
     // 공 생성자
     constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = "black";
        this.radius = 3;
        this.angle = 0; //충돌 각도
        this.velocity = 10;
        this.dx = velocity * Math.cos(angle);
        this.dy = velocity * Math.sin(angle);
      }
}



// draw Ball
function drawBall(ball)
{
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI);
    context.strokeStyle = ball.color;
    context.stroke();
}

// update and re-draw ball position
function updateBall(ball)
{
    // 방향, 속도 설정
    ball.y+= ball.velocity;

    if(collisionDetect(ball)) calculateDirection(ball);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
}

// 충돌 검사 
function collisionDetection(ball)
{
    

}

// draw
function draw()
{
    drawBall(ball);
    // var update = setInterval(updateBall, 50);
}

