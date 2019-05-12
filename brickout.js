
// 전역 변수
var canvas;
var context;
var stage;
var width; //canvas의 폭과 높이 
var height;
function init()
{

    canvas = document.getElementById("frame");
    context  = canvas.getContext("2d");
    width = document.getElementById("frame").width();
    height = document.getElementById("frame").height();
    test();


}

window.onload = function()
{
    init();
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



function draw()
{
    // drawBall();
    drawStage();
}






// 맞는 레벨 stage 리턴. Factory pattern
function gameStart(level)
{
    switch(level)
    {
        case 1: return new Stage_One();
        case 2: return new Stage_Two();
        default: return new Stage();
    }
}


// 임시 테스트 함수
function test()
{
    // var stage = new Stage_One();
    stage = gameStart(2);
    // stage 그리기
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

class Ball
{

    //공의 생성자
    constructor(x,y,radius,dx,dy){ 
        this.ballx=x;
        this.bally=y;
        this.radius=radius;
        this.balldy=dy;
        this.balldx=dx;
    }

    //공의 크기 설정
    setballsize(radius) //공의 크기설정
    {
        this.radius=radius;
    }

    //공의 위치 설정
    setballposition(x,y){
        this.ballx=x;
        this.bally=y;
    }

    //공의 방향 설정
    setballdirection(dx,dy){
        this.dx=dx;
        this.dy=dy;
    }

    //공을 화면에 그린다
    drawball(){
        this.ballx+=this.dx;
        this.bally+=this.dy;
        
        //공이 canvas벽의 양끝에 닿았을 때 방향변화
        if((ballx>=width-this.radius)||(ballx<=this.radius))
            {ballx=-ballx;}
        //공이 천장에 닿았을 때 방향 변화
        if (bally<=this.radius) {
            bally=-bally;
        }
        //공이 바닥에 닿지 않았을 떄
        else if(bally>=height-this.radius){
            /*

            *Barx,Barwidth는 다른 클래스인데 이걸 어떻게 가지고 와야 하는지 모르겠어요.
            
            //공이 bar에 닿았을 떄
            if ((Ballx>Barx)&&(Ballx<Barx+Barwidth)) 
                {Bally=-Bally;}
        }//else{공이 사라진다.}
        */
    }




}// 공 class

class Bar{

    //bar의 생성자
    constructor(x,y,color,width,height){ 
        this.barx=x;
        this.bary=y;
        this.barcolor=color;
        this.barwidth=width;
        this.barheight=height;
    }
    
    //bar의 크기 설정
    setbarsize(width,height){ 
        this.barwidth=width;
        this.barheight=height;
    }

    //mouse에 따라 움직이는 bar
    movebar(e){
        canvasleft=document.getElementById("canvas").offset().left;
        canvasright=canvasleft+width;
        if (e.pageX>=canvasleft&&e.pageX<=canvasright){
            this.x=e.pageX=canvasleft-(this.width/2);//변수 x,width사용가능?
        }

    } //$(document).mousemove(onMouseMove);

 }// 바 class