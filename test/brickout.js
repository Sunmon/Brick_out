// 전역변수
var canvas;
var context;
var block_width;
var block_height;
var ball;
var blocks; //블럭 배열
const max_blocks_in_row = 15;
// window load시 실행될 함수
window.onload = function(){
    init();
    initMap();
    // initStage();
}


//전체 게임 초기화
function init()
{
    canvas = document.getElementById("frame");
    context = canvas.getContext("2d");
    block_width = canvas.width / max_blocks_in_row;
    block_height = 10;
}


// Block class
// https://infoscis.github.io/2018/02/13/ecmascript-6-introducing-javascript-classes/
class Block
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
    return  new Block(x,y,color);
}

// 블럭 배열 입력받아서 그리기
function drawBlocks()
{

    blocks.forEach(blockRow =>
    {
    document.write("block Row : " + blockRow.x+ blockRow.length + "<br/>");

        blockRow.forEach(block=>
            {
                document.write(block.length);
                document.write(block);
                document.write("<br/>block col <br/>");

                // if(!block.status) return;
                console.log(block.x, block.y);
                context.strokeStyle = block.color;
                context.strokeRect(block.x, block.y, block.width, block.height);
            });
        
    });
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



// num_block개씩 line줄만큼 블럭 생성
function makeBlocks(lines, num_blocks)
{
    // 임시적으로 맵 하나라고 가정.
    var color = ["red", "orange", "yellow", "green", "blue"];
    var colorIndex = 0;

    blocks = Array.from(new Array(lines));
    blocks.forEach(block=>
        {
            for(var i = 0; i<num_blocks; i++)
                block.push(createBlock(0,0,"red"));
        });


}

// 맵 그리기. 스테이지별로 다른 맵 하려면 캡슐화 이용해야 함. 
function initMap()
{
    makeBlocks(5,max_blocks_in_row);


    document.write(blocks.length + "<br/>");
    document.write(blocks[0]);
    document.write(blocks[1]);


    document.write(blocks[0].length);

/*     blocks.forEach(line=>
        {
            line.forEach(block=>
                {
                   block = createBlock(0,0,"red");
                   document.write(block.color + "<br/>");
                });
        }); */

    document.write(blocks[0][1].color);



}







class Ball
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
function draw(ball)
{
    drawBlocks();
    drawBall(ball);
    // var update = setInterval(updateBall, 50);
}