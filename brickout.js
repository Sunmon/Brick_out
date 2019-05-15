
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
    WIDTH = canvas.width;
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
        super.initLineTimer(5000);
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
        super.initLineTimer(4000);
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
        super.initLineTimer(3500);
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

    // FIXME: 혹시 moveBall()로 메소드 이름 변경 가능한가요? draw는 그릴 때 쓰게요-->수정했습니다!
    //공을 화면에 그린다
   moveBall(){

        // FIXME:변수 dx없음.
        this.ballX+=this.ballDX;
        this.ballY+=this.ballDY;
        


        // FIXME: 왜 ballx  = -ballx, bally = -bally인지 이해가 안 됩니다. 공이 화면의 반대쪽으로 넘어가나요?
        //공이 canvas벽의 양끝에 닿았을 때 방향변화
        if((ballX>=WIDTH-this.radius)||(ballX<=this.radius))
            {ballX=-ballX;}
        //공이 천장에 닿았을 때 방향 변화
        if (ballY<=this.radius) {
            ballY=-ballY;
        }
        //공이 바닥에 닿지 않았을 떄
        else if(ballY>=HEIGHT-this.radius){
            /*

            *Barx,Barwidth는 다른 클래스인데 이걸 어떻게 가지고 와야 하는지 모르겠어요.
            // FIXME: 이 부분은 제가 다른 함수에서 처리할게요. 충돌 관련 함수에서. 
            //공이 bar에 닿았을 떄
            if ((Ballx>Barx)&&(Ballx<Barx+Barwidth)) 
                {Bally=-Bally;}
        }//else{공이 사라진다.}
        */
        }
    }




    // 충돌 처리 위해 임시적으로 만든 함수. 추후 삭제할 예정.
    tempMove()
    {
        this.ballX += this.ballDX;
        this.ballY += this.ballDY;
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

    //event:mouse에 따라 움직이는 bar    
  

    moveBar(e){  

       // FIXME: canvasleft 제대로 정의 안 됨. document.write(canvasleft)해보면 알 수 있음.
       //document.write("barwidth::"+ this.barWidth);
        
         //barEvent: 화면 상의 바의x 좌표
         this.barEvent = (WIDTH-this.barWidth)/2; 
         this.relativeX = e.clientX - canvas.offsetLeft;
         if (this.relativeX>0 && this.relativeX<WIDTH) {
            //barEvent: 이벤트 발생한 바의 중간 위치
         this.barEvent = this.relativeX - this.barWidth/2;
        } //document.write("barEvent: "+this.barEvent);
        
        //document.write("barwidth::"+ this.barWidth);
         //document.write("barEvent"+ (+this.barEvent) + this.barWidth);

        } //moveBar 




         
    }// 바 class





 
// 임시 테스트 함수
function test()
{
    // 레벨 맞는 스테이지 생성
    stage = setLevel(2);

    // Bar 그리기
    bar = new Bar(30,HEIGHT-40,"black", 100, 5);

    // FIXME: ball.ballX가 없어
    // ball 그리기
    ball = new Ball(bar.barX + (bar.barWidth / 2) + 10, bar.barY-3, 3, 1.7,-1.3);
    ball.setBallColor("green");


    // var drawing = setInterval(draw,10);
    // requestAnimationFrame(draw);
    
    draw();
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

//FIXME: 충돌 감지. 나중에 공 여러개면 ball을 array로 쓰든가 해서 수정해야 함.
function detectCollision()
{

    
    // FIXME: 허공에 부딛힌다.

    stage.blockArr.forEach(blockRow=>
        {
            blockRow.forEach(block=>
                {
                    // 충돌 검사
                    var blockLeft = block.x;
                    var blockRight = block.x + block.width;
                    var blockUP = block.y;
                    var blockDown = block.y + block.height;
                    
                    // 충돌했을 경우 공의 방향 바꿈
                    var x = ball.ballX + ball.ballDX;
                    var y = ball.ballY + ball.ballDY;
                    
                    var collision_x = (blockRight >= x - ball.radius) && (blockLeft <= x + ball.ballDX);
                    var collision_y = (blockUP <= y + ball.radius) && (blockDown >= y - ball.radius);

                    if(collision_x && collision_y)
                    {
                        block.state = false;
                        if(collision_x) ball.ballDX = -ball.ballDX;
                        if(collision_y) ball.ballDY = -ball.ballDY;
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
    ball.tempMove();
    // document.write(ball.ballX + " " + ball.ballY + " ");
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

    // interval 대신. 애니메이션을 부드럽게.
    requestAnimationFrame(draw);

     
    
}


