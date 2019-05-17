
// 전역 변수
var canvas;
var context;
var stage;
var bar;
var ball;
var WIDTH; //canvas의 폭과 높이 
var HEIGHT;

function init()
{

    canvas = document.getElementById("frame");
    context  = canvas.getContext("2d");
    WIDTH = canvas.width;   //300 고정
    HEIGHT = canvas.height;
}

window.onload = function()
{
    init();
    test();
}


/**
 * 블럭 한 개에 대한 속성을 정의한다.
 * Stage를 만들 때, 이 클래스의 배열을 이용한다.
 */
class Block
{
    // 블럭 생성자
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.state = true;                  //true 블럭 멀쩡함 , false: 깨짐

    }

    // 블럭 위치 설정
    setPosition(x,y)
    {
        this.x = x;
        this.y = y;
    }

    // 블럭 색깔 변경
    setColor(color)
    {
        this.color = color;
    }

    // 블럭 크기 설정
    setSize(width, height)
    {
        this.width = width;
        this.height = height;
    }
} 



/**
 * 스테이지 부모 클래스
 * 새 스테이지로 넘어갈 때마다 다형성을 이용하여 자식 스테이지 객체 생성하여 초기화.
 * 클래스 생성시 자동으로 initStage()실행 => 스테이지 자동 생성 완료.
 * 
 * initStage(): 스테이지 기본 정보 초기화..  색, 타이머, 블록 배치 등등
 * initBlock(): 2차원 블럭 배열 생성
 * placeBlock(): 블럭 배치 설정. 스테이지마다 오바리이딩 필요.
 * insertLine(); 스테이지 맨 위에 블럭 한 줄 새로 삽입
 */
class Stage
{
    // score: 모든 스테이지에서 합산 되어야 하므로 static
    static score = 0;

    constructor()
    {
        this.initStage();
    }

    initStage()
    {
        this.colors = ["red", "orange", "blue", "green", "purple"];     // 블럭 색깔. 
        this.initLineTimer(0);
        // this.initBlockArr(10,10,10,10);
        // this.placeBlocks();
    }

    // 블럭 내려오는 시간 간격 정함
    initLineTimer(timer)
    {
        this.lineTimer = timer;
    }


    // blockArr 초기 배열 생성
    initBlockArr(block_width, block_height, block_in_row, block_in_col)
    {
        this.blockArr = new Array();
        this.block_width = block_width;                      
        this.block_height = block_height;                    
        this.block_in_row = block_in_row;                               //한 줄에 있는 블럭 개수
        this.block_in_col = block_in_col;                               //블럭 줄 수 

        // blockArr라는 2차원 배열 생성
        // this.blockArr = new Array(this.block_lines).fill(null).map(() => Array(this.block_width));

        while(block_in_col--)
        {
            this.insertLine(this.blockArr, block_in_row);
        }
    }

    // 새로 블럭 한 줄을 맨 위에 삽입
    insertLine(blockArr, block_in_row)
    {
        // 기존 블럭 아래로 한 줄씩 당김
        this.downBlock(blockArr);
        // document.write("adf");

        // 새 블럭 한 줄 맨 위에 삽입
        var color = this.colors[Math.floor(Math.random()*5)];
        blockArr.push(this.createNewLine(block_in_row, color));
    }

    // 블럭 전체 한 칸씩 아래로 당기기
    downBlock(blockArr)
    {
        blockArr.forEach(line=>{
        line.forEach(block=>{
                block.y += block.height;
            });
        });
    }


    //새 블록 한 줄을 생성하여 리턴
    createNewLine(block_in_row, color)
    {
        var x = 0;
        var temp = new Array();
        while(block_in_row--)
        {
            temp.push(new Block(x,0, color,this.block_width, this.block_height));
            x+= this.block_width;
        }
        return temp;
    }

    // 블럭 배치
    placeBlocks(){};
}


/**
 * 첫 번째 스테이지.
 */
class Stage_One extends Stage
{
    initStage()
    {
        super.initStage();
        super.initLineTimer(500000);
        super.initBlockArr(10,5,30,8);
        this.placeBlocks();

    }

    // 블록 배치 정하기
    placeBlocks()
    {
        for(var i = 0; i<this.block_in_col; i++)
        {
            for(var j = 0; j<this.block_in_row; j++)
                if((2*i + 7*j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        } 
    }

}


/**
 * 두 번째 스테이지.
 */
class Stage_Two extends Stage
{
    initStage()
    {
        super.initStage();
        super.initLineTimer(400000);
        super.initBlockArr(15,5,20,10);
        this.placeBlocks();
    }

    // 블록 배치. Stage따라 다르다.
    placeBlocks()
    {
        for(var i = 0; i<this.block_in_col; i++)
        {
            for(var j = 0; j<this.block_in_row; j++)
                if((3*i + 7*j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        } 
    }


}


/**
 * 세 번째 스테이지.
 */
class Stage_Three extends Stage
{
    initStage()
    {
        super.initStage();
        super.initLineTimer(300000);
        super.initBlockArr(20,5,17,11);
        this.placeBlocks();
    }

    // 블록 배치. 3탄에서는 랜덤으로 배치해봤습니다 난잡해 보이신다면 바꾸겠습니다!
    placeBlocks()
    {
        for(var i = 0; i<this.block_in_col; i++)
        {
            for(var j = 0; j<this.block_in_row; j++)
                if((Math.floor(Math.random()*3)*i + Math.floor(Math.random()*3)*j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        } 
    }


}



/**
 * 네 번째 스테이지.
 */
 class Stage_Four extends Stage
{
    initStage()
    {
        super.initStage();
        super.initLineTimer(4000);
        super.initBlockArr(20,5,15,14);
        this.placeBlocks();
    }

    // 블록 배치. 대각선으로 배치해보았습니다.
    placeBlocks()
    {
        for(var i = 0; i<this.block_in_col; i++)
        {
            for(var j = 0; j<this.block_in_row; j++)
                if((5*i + 7*j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        } 
    }


}








// 레벨에 맞는 stage 객체를 생성하여 리턴. Factory pattern
function setLevel(level)
{
    switch(level)
    {
        case 1: return new Stage_One();
        case 2: return new Stage_Two();
        case 3: return new Stage_Three();
        case 4: return new Stage_Four();
        default: return new Stage();
    }
}


class Ball
{

    //공의 생성자
    constructor(x,y,radius,dx,dy){ 
        this.ballX=x;
        this.ballY=y;
        this.radius=radius;
        this.ballDY=dy;
        this.ballDX=dx;
    }

    //공의 크기 설정
    setballsize(radius) 
    {
        this.radius=radius;
    }

    //공의 위치 설정
    setballposition(x,y){
        this.ballX=x;
        this.ballY=y;
    }

    //공의 방향 설정
    setballdirection(dx,dy){
        this.ballDX=dx;
        this.ballDY=dy;
    }

    // 공의 색깔 설정
    setBallColor(color)
    {
        this.ballColor = color;
    }

    //공을 움직인다
   moveBall(){
        this.ballX+=this.ballDX;
        this.ballY+=this.ballDY;
    }
}// 공 class


class Bar{

    //bar의 생성자
    constructor(x,y,color,width,height){ 
        this.barX=x;
        this.barY=y;
        this.barColor=color;
        this.barWidth=width;
        this.barHeight=height;
      

        // 마우스 이동 event listner 추가
        document.addEventListener("mousemove", this.moveBar.bind(this), false);

    }
    
    //bar의 크기 설정
    setbarsize(width,height){ 
        this.barWidth=width;
        this.barHeight=height;
    } 

    //마우스에 따라 바 움직이기
    moveBar(e){  
        // relativeX: 캔버스 내 마우스의 X 좌표 (캔버스 크기 : 300, default값)
        var relativeX = (e.clientX - canvas.offsetLeft)*WIDTH / canvas.clientWidth;

        // 마우스에 따른 bar 위치 조정
        if(relativeX > 0 && relativeX < canvas.width) this.barX = relativeX-this.barWidth/2;
  }
}// 바 class


    



 
// 임시 테스트 함수
function test()
{
    // 레벨 맞는 스테이지 생성
    stage = setLevel(2);

    // Bar 그리기
    bar = new Bar(30,HEIGHT-40,"black", 100, 5);

    // ball 그리기
    ball = new Ball(bar.barX + (bar.barWidth / 2), bar.barY-3, 2, 1.2, -1.3);
    ball.setBallColor("green");


    // 화면 그림 갱신하기
    // var drawing = setInterval(draw,10);
    draw();

    // 일정 시간마다 블럭 내려오기
    var timer = setInterval(function(){
         stage.insertLine(stage.blockArr, stage.block_in_row)}, stage.lineTimer);
}

// stage 그리기
function drawStage()
{
    stage.blockArr.forEach(blockRow=>
        {
            blockRow.forEach(block=>
                {
                    if(!block.state) return;
                    /* context.fillStyle = block.color;
                    context.fillRect(block.x, block.y, block.width, block.height); */
                    context.strokeStyle = block.color;
                    context.strokeRect(block.x, block.y, block.width, block.height);
                });
        });
}

//충돌 감지. 나중에 공 여러개면 ball을 array로 쓰든가 해서 수정해야 함.
function detectCollision()
{
    detectCollision_block();
    collision_bar();
}

// 특정 좌표가 border 범위 내인지 확인
function isInBorder(border_min, border_max, pos)
{
    return ((border_min <= pos) && (border_max >= pos));
}

// 벽돌과 충돌 감지
function detectCollision_block()
{
    stage.blockArr.forEach(blockRow=>
        {
            blockRow.forEach(block=>
                {
                    if(!block.state) return;

                    // 블럭 경계
                    var leftBorder = block.x;
                    var rightBorder = leftBorder + block.width;
                    var upBorder = block.y;
                    var downBorder = upBorder + block.height;

                    //공의 좌표
                    var x = ball.ballX;
                    var y = ball.ballY;
                    
                    // 충돌시 튕기고 블록 삭제
                    if(isInBorder(leftBorder, rightBorder, x))
                    {
                        if(!isInBorder(upBorder,downBorder,y+ball.ballDY)) return;
                        block.state = false;
                        ball.ballDY = -ball.ballDY;
                    }

                    if(isInBorder(upBorder, downBorder, y))
                    {
                        if(!isInBorder(leftBorder, rightBorder, x+ball.ballDX)) return;
                        block.state = false;
                        ball.ballDX = -ball.ballDX;
                    }
                });
        });
}

//FIXME: 임시로 만든 함수. 이벤트 리스너 동작하는 것 보고 수정할 것.
function drawBar()
{
    context.strokeStyle = bar.barColor;
    context.strokeRect(bar.barX, bar.barY, bar.barWidth, bar.barHeight);
}

// FIXME:  임시로 만든 함수. 나주에 공이 여러개가 된다면 수정 필요.
// 공을 화면에 그린다
function drawBall()
{
    // 공 좌표 이동
    ball.moveBall();

     // 공 그리기
    context.beginPath();
    context.arc(ball.ballX, ball.ballY, ball.radius, 0, 2.0 * Math.PI, true);
    context.fillStyle = ball.ballColor;
    context.fill();
}

// 화면에 그리는 함수.
function draw()
{
    context.clearRect(0,0,WIDTH, HEIGHT);

    drawBall();
    detectCollision();
    drawStage();
    drawBar();

    // 화면 특정 시간마다 갱신하기
    requestAnimationFrame(draw); // interval 대신. 애니메이션을 부드럽게.
}

function collision_bar(){
    //공이 좌우 벽면에 닿았을 떄
    if (ball.ballX+ball.ballDX>WIDTH-ball.radius||ball.ballX+ball.ballDX<ball.radius) {
        ball.ballDX=-ball.ballDX;
    }

     //공이 천장 벽면에 닿았을 때
    if (ball.ballY+ball.ballDY<ball.radius) 
        {ball.ballDY=-ball.ballDY;}


    //공이 아래 바닥쪽에 갈때
    else if (ball.ballY+ball.ballDY>HEIGHT-ball.radius-40) 
   {
        //공의 x좌표가 바의 x좌표와 동실선에 있을 떄
        if (ball.ballX>bar.barX&&ball.ballX<bar.barX+bar.barWidth) 
            {ball.ballDY=-ball.ballDY;}
       
    }
}

