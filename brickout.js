
// 전역 변수
var canvas;
var context;
var stage;
var bar;
// var ball;
var canvas2;
var context2;
var WIDTH; //canvas의 폭과 높이 
var HEIGHT;
var lives = 3;//목숨
var animate;    //animation 시작, 정지 변수
var timer;
var ballArray;
var itemArray;
var ballThrow = false;
var BALL_VELOCITY = 2;  //stage마다 볼 던질 속도
var COLORS = {10: "red", 20: "orange", 30: "blue", 40: "green", 50: "purple"};
var totalScore = 0;


function init() {

    canvas = document.getElementById("frame");
    context = canvas.getContext("2d");
    WIDTH = canvas.width;   //300 고정
    HEIGHT = canvas.height;

    drawStair();
    canvas2 = document.getElementById("frame2");
    context2 = canvas2.getContext("2d");
}

//단계를 설정 그림
function drawStair() {
    context.beginPath();
    context.moveTo(0, 115);
    context.lineTo(75, 115);
    context.lineTo(75, 85);
    context.lineTo(150, 85);
    context.lineTo(150, 55);
    context.lineTo(225, 55);
    context.lineTo(225, 25);
    context.lineTo(300, 25);
    context.stroke();
    context.font = "20px Verdana";
    context.fillText("1", 30, 110);
    context.fillText("2", 105, 80);
    context.fillText("3", 180, 50);
    context.fillText("4", 255, 20);
}

function addEvent(func) {
    document.addEventListener("click", func, false);
}

function removeEvent(func)
{
    document.removeEventListener("click",func);
}

function settingStage(e)
{
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;
 
   //stage1을 선택할 때
    if ((relativeX>0&&relativeX<=60)&&(relativeY>=84&&relativeY<=115)) {gameStart(1);}
    //stage2를 선택할 떄
    if ((relativeX>=76&&relativeX<=150)&&(relativeY>=54&&relativeY<=84)) {gameStart(2);}
    //stage3을 선택할 때
    if ((relativeX>=151&&relativeX<=225)&&(relativeY>=35&&relativeY<=55)) {gameStart(3);}
    //stage4를 선택할 때
    if ((relativeX>=226&&relativeX<=300)&&(relativeY>=0&&relativeY<=25)) {gameStart(4);}  
}




// 첫 시작 시 불러올 함수들
window.onload = function () {
    init();
    addEvent(settingStage);
    addEvent(move_settingPage);
    addEvent(move_stairPage);
    drawNextbtn();
    displayLivesAndScore();

}


/**
 * 블럭 한 개에 대한 속성을 정의한다.
 * Stage를 만들 때, 이 클래스의 배열을 이용한다.
 */
class Block {
    // 블럭 생성자
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color[1];
        this.score = color[0];
        this.width = width;
        this.height = height;
        this.state = true;                  //true 블럭 멀쩡함 , false: 깨짐
    }

    // 블럭 위치 설정
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    // 블럭 색깔 변경
    setColor(color) {
        this.color = color;
    }

    // 블럭 크기 설정
    setSize(width, height) {
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
class Stage {
 /*    // score: 모든 스테이지에서 합산 되어야 하므로 static
    static score = 0;
 */
    constructor() {
        this.initStage();
    }

    initStage() {
        // this.colors = ["red", "orange", "blue", "green", "purple"];     // 블럭 색깔. 
        // TODO: color 점수 pair로 
        this.colors = COLORS;
        this.initLineTimer(0);
        // this.initBlockArr(10,10,10,10);
        // this.placeBlocks();
    }

    // 블럭 내려오는 시간 간격 정함
    initLineTimer(timer) {
        this.lineTimer = timer;
    }


    // blockArr 초기 배열 생성
    initBlockArr(block_width, block_height, block_in_row, block_in_col) {
        this.blockArr = new Array();
        this.block_width = block_width;
        this.block_height = block_height;
        this.block_in_row = block_in_row;                               //한 줄에 있는 블럭 개수
        this.block_in_col = block_in_col;                               //블럭 줄 수 

        // blockArr라는 2차원 배열 생성
        // this.blockArr = new Array(this.block_lines).fill(null).map(() => Array(this.block_width));

        while (block_in_col--) {
            this.insertLine(this.blockArr, block_in_row);
        }
    }

    // 새로 블럭 한 줄을 맨 위에 삽입
    insertLine(blockArr, block_in_row) {
        // 기존 블럭 아래로 한 줄씩 당김
        this.downBlock(blockArr);

        // TODO: 새 블럭 한 줄 맨 위에 삽입
        // var color = this.colors[Math.floor(Math.random() * 5)];
        var colors = Object.entries(COLORS)[Math.floor(Math.random()*5)];
        // document.write(Object.entries(COLORS)[2][1]);
        blockArr.push(this.createNewLine(block_in_row, colors));
    }

    // 블럭 전체 한 칸씩 아래로 당기기
    downBlock(blockArr) {
        blockArr.forEach(line => {
            line.forEach(block => {
                block.y += block.height;
            });
        });
    }


    //새 블록 한 줄을 생성하여 리턴
    createNewLine(block_in_row, color) {
        var x = 0;
        var temp = new Array();
        while (block_in_row--) {
            temp.push(new Block(x, 0, color, this.block_width, this.block_height));
            x += this.block_width;
        }
        return temp;
    }

    // 블럭 배치
    placeBlocks() { };
}


/**
 * 첫 번째 스테이지.
 */
class Stage_One extends Stage {
    initStage() {
        super.initStage();
        super.initLineTimer(500000);
        super.initBlockArr(10, 5, 30, 8);
        this.placeBlocks();
    }

    // 블록 배치 정하기
    placeBlocks() {
        for (var i = 0; i < this.block_in_col; i++) {
            for (var j = 0; j < this.block_in_row; j++)
                if ((2 * i + 7 * j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        }
    }
}


/**
 * 두 번째 스테이지.
 */
class Stage_Two extends Stage {
    initStage() {
        super.initStage();
        super.initLineTimer(400000);
        super.initBlockArr(15, 5, 20, 10);
        this.placeBlocks();
    }

    // 블록 배치. Stage따라 다르다.
    placeBlocks() {
        for (var i = 0; i < this.block_in_col; i++) {
            for (var j = 0; j < this.block_in_row; j++)
                if ((3 * i + 7 * j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        }
    }


}


/**
 * 세 번째 스테이지.
 */
class Stage_Three extends Stage {
    initStage() {
        super.initStage();
        super.initLineTimer(300000);
        super.initBlockArr(20, 5, 17, 11);
        this.placeBlocks();
    }

    // 블록 배치. 3탄에서는 랜덤으로 배치해봤습니다 난잡해 보이신다면 바꾸겠습니다!
    placeBlocks() {
        for (var i = 0; i < this.block_in_col; i++) {
            for (var j = 0; j < this.block_in_row; j++)
                if ((Math.floor(Math.random() * 3) * i + Math.floor(Math.random() * 3) * j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        }
    }


}



/**
 * 네 번째 스테이지.
 */
class Stage_Four extends Stage {
    initStage() {
        super.initStage();
        super.initLineTimer(4000);
        super.initBlockArr(20, 5, 15, 14);
        this.placeBlocks();
    }

    // 블록 배치. 대각선으로 배치해보았습니다.
    placeBlocks() {
        for (var i = 0; i < this.block_in_col; i++) {
            for (var j = 0; j < this.block_in_row; j++)
                if ((5 * i + 7 * j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
        }
    }
}


/**
 * 아이템 상위 클래스
 */
class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dy = 1;
        this.size = WIDTH / 100 * 2;
    }

    // 속도 정하기
    setDy(dy)
    {
        this.dy = dy;
    }

    // 아이템 떨어지기
    moveItem() {
        this.y += this.dy;
    }

    // 아이템 효과 적용
    affect() {
    }

    // 아이콘 이미지 정하기
    setIcon(src)
    {
        this.icon = new Image();
        this.icon.src = src;
    }
}


// 공 추가해주는 아이템 클래스
class AddBall extends Item {
    constructor(x,y)
    {
        super(x,y);
        super.setDy(1);
        super.setIcon("./assets/add.png");
    }

    affect() {
        super.affect();
        // ballArray.push(new Ball(bar.x, bar.y, 2, -1.1, -1));
        ballArray.push(new Ball(bar.x, bar.y, 2, 120, BALL_VELOCITY));

    }
}

// life 추가 아이템
class LifePlus extends Item
{
    constructor(x,y)
    {
        super(x,y);
        super.setDy(1.5);
        super.setIcon("./assets/life.png");
    }

    affect()
    {
        super.affect();
        lives++;
    }
}

// bar 길이 넓히는 아이템
class WidenBar extends Item
{
    constructor(x,y)
    {
        super(x,y);
        super.setDy(1);
        super.setIcon("./assets/wide.png");
    }

    affect()
    {
        super.affect();
        if(bar.width < bar.MAX_WIDTH) bar.width+=10;
    }

}

// 한 줄 삭제 아이템
class RemoveLine extends Item
{
    constructor(x,y)
    {
        super(x,y);
        super.setDy(1);
        super.setIcon("./assets/remove.png");
    }

    affect()
    {
        super.affect();
        stage.blockArr.splice(stage.blockArr.length-1, 1);
    }

}


// 총알 공 아이템
class PowerBall extends Item
{
    constructor(x,y)
    {
        super(x,y);
        super.setDy(1.2);
        super.setIcon("./assets/thunder.png");
    }

    affect()
    {
        super.affect();
        ballArray.forEach(ball=>{
            ball.setPower(500);
            ball.setColor("red");
        });
    }
}


// 레벨에 맞는 stage 객체를 생성하여 리턴. Factory pattern
function setLevel(level) {
    switch (level) {
        case 1: return new Stage_One();
        case 2: return new Stage_Two();
        case 3: return new Stage_Three();
        case 4: return new Stage_Four();
        default: return new Stage();
    }
}


class Ball {

    //공의 생성자
/*     constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.power = 0;
    }
 */
    // 공의 생성자

    constructor(x, y, radius, angle, velocity)
    {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this. velocity = velocity;
        this.power = 0;
        this.setDirectionWithAngle(angle, velocity);
    }


    setDirectionWithAngle(angle, velocity)
    {
        var angleR = angle * Math.PI / 180;
        var dx = velocity * Math.cos(angleR);
        var dy = -velocity* Math.sin(angleR);
        this.setDirection(dx, dy);
    }

    //공의 크기 설정
    setSize(radius) {
        this.radius = radius;
    }

    //공의 위치 설정
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    //공의 방향 설정
    setDirection(dx, dy) {
        this.dx = dx;
        this.dy = dy;
    }

    // 공의 색깔 설정
    setColor(color) {
        this.color = color;
    }

    //공을 움직인다
    moveBall() {
        this.x += this.dx;
        this.y += this.dy;
    }

    // 아이템 사용시 튕기지 않는 공으로 변경. power초만큼 안튕김.
    setPower(power)
    {
        this.power = power;
    }

    // 일정시간마다 파워감소
    decreasePower()
    {
        if(this.power > 0) this.power --;
        else this.setColor("green");
    }
}// 공 class


class Bar {

    //bar의 생성자
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.MAX_WIDTH = 100;


        // 마우스 이동 event listner 추가
        document.addEventListener("mousemove", this.moveBar.bind(this), false);


    }

    //bar의 크기 설정
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    //마우스에 따라 바 움직이기
    moveBar(e) {
        // relativeX: 캔버스 내 마우스의 X 좌표 (캔버스 크기 : 300, default값)
        var relativeX = (e.clientX - canvas.offsetLeft) * WIDTH / canvas.clientWidth;

        // 마우스에 따른 bar 위치 조정
        if (relativeX > 0 && relativeX < canvas.width) this.x = relativeX - this.width / 2;
    }
}// 바 class




// 게임 시작 메소드
function gameStart(level)
{
    // 스테이지 생성
    stage = setLevel(level);

    // 공 던지는 속도 조정
    BALL_VELOCITY = 2 + level/2;

    totalScore = 0; 
    initGame();
    
    draw();
    removeEvent(settingStage);
}


// 게임 초기화
function initGame()
{
    // 게임 시작 준비
    ballThrow = false;
    addEvent(throwingBall);
   // document.addEventListener("click", throwingBall, true); //한 번만 호출

    // Bar 그리기
    bar = new Bar(30, HEIGHT - 20, "black", 50, 5);

    // ball 그리기
    var ball = new Ball(bar.x + (bar.width / 2), bar.y - 3, 2, 40, BALL_VELOCITY);
    ball.setColor("green");
    
    ballArray = new Array();
    ballArray.push(ball);

    // item array 초기화
    itemArray = new Array();

    // 일정 시간마다 블럭 내려오기
    timer = setInterval(function () {
        stage.insertLine(stage.blockArr, stage.block_in_row)
    }, stage.lineTimer);

}





// 임시 테스트 함수
function test(level) {
    // 레벨 맞는 스테이지 생성
    stage = setLevel(level);

    // Bar 그리기
    bar = new Bar(30, HEIGHT - 40, "black", 50, 5);

    // ball 그리기
    // var ball = new Ball(bar.x + (bar.width / 2), bar.y - 3, 2, 1.2, -1.3);
    var ball = new Ball(bar.x + (bar.width / 2), bar.y - 3, 2, 30, 2);

    ball.setColor("green");
    
    ballArray = new Array();
    ballArray.push(ball);


    // item array 초기화
    itemArray = new Array();

    // 화면 그림 갱신하기
    draw();

    // 일정 시간마다 블럭 내려오기
    timer = setInterval(function () {
        stage.insertLine(stage.blockArr, stage.block_in_row)
    }, stage.lineTimer);

   // removeEvent(settingStage);

}

// stage 그리기
function drawStage() {
    stage.blockArr.forEach(blockRow => {
        blockRow.forEach(block => {
            if (!block.state) return;
            /* context.fillStyle = block.color;
            context.fillRect(block.x, block.y, block.width, block.height); */
            context.strokeStyle = block.color;
            context.strokeRect(block.x, block.y, block.width, block.height);
        });
    });
}

//충돌 감지. 나중에 공 여러개면 ball을 array로 쓰든가 해서 수정해야 함.
function detectCollision() {
    detectCollision_block();
    detectCollision_bar();
    detectCollision_wall();
    detectCollision_item();
}

// 특정 좌표가 border 범위 내인지 확인
function isInBorder(border_min, border_max, pos) {
    return ((border_min <= pos) && (border_max >= pos));
}

// 블럭과 충돌 감지
function detectCollision_block() {

    stage.blockArr.forEach(blockRow => {
        blockRow.forEach(block => {
            if (!block.state) return;

            // 블럭 경계
            var leftBorder = block.x;
            var rightBorder = leftBorder + block.width;
            var upBorder = block.y;
            var downBorder = upBorder + block.height;


            ballArray.forEach(ball => {
                
                //공의 좌표
                var x = ball.x;
                var y = ball.y;

                // 충돌시 튕기고 블록 삭제
                if (isInBorder(leftBorder, rightBorder, x)) {
                    if (!isInBorder(upBorder, downBorder, y + ball.dy)) return;
                    block.state = false;
                    // 만약 파워아이템 먹었으면 안 튕김
                    ball.power ? true : ball.setDirection(ball.dx, -ball.dy);
                }

                if (isInBorder(upBorder, downBorder, y)) {
                    if (!isInBorder(leftBorder, rightBorder, x + ball.dx)) return;
                    block.state = false;
                    ball.power ? true: ball.setDirection(-ball.dx, ball.dy);
                }

                if(!block.state) dropItem(block.x, block.y);    // 일정 확률로 아이템 떨어짐
                if(!block.state) totalScore += +block.score;     // 깬 블럭 점수 추가
            });

        });
    });
}


// 공이 바와 충돌하는 지 검사하고 방향을 바꾼다
function detectCollision_bar() {
    ballArray.forEach(ball => {
        if (!isInBorder(bar.x, bar.x + bar.width, ball.x + ball.dx)) return;
        if (!isInBorder(bar.y, bar.y + bar.height, ball.y + ball.dy)) return;
        ball.setDirection(ball.dx, -ball.dy);
        ball.y += Math.sign(ball.dy) * ball.radius;
    });
}

// 벽과 충돌 검사하고 공의 방향을 바꾼다
function detectCollision_wall() {

    ballArray.forEach((ball,index) => {
        // 천장, 바닥과 충돌 검사
        if (!isInBorder(0, HEIGHT, ball.y + ball.dy)) {
            ball.dy < 0 ? ball.setDirection(ball.dx, -ball.dy) :                        //천장에 튀겼을 시
                ballArray.length > 1 ? ballArray.splice(index, 1) : decreaseLives();     //바닥에 튀겼을 시
        }

        // 좌우 벽과 충돌 검사
        if (!isInBorder(0, WIDTH, ball.x + ball.dx)) ball.setDirection(-ball.dx, ball.dy);
    });

}

// 바와 아이템의 충돌 검사
function detectCollision_item()
{
    itemArray.forEach( (item,index) =>{
        // 아이템이 화면 밖으로 사라지면 삭제
        if(!isInBorder(0, HEIGHT, item.y)) itemArray.splice(index,1);

        // 바와 충돌 확인
        if(!isInBorder(bar.x, bar.x+bar.width, item.x)) return;
        if(!isInBorder(bar.y, bar.y+bar.height, item.y+item.dy)) return;
        
        // 효과 적용
        item.affect();

        // 아이템 사라지기
        itemArray.splice(index, 1);
    });
}


// 마우스 클릭하면 공 날아가면서 게임 시작
function throwingBall()
{
    if(ballThrow) return;
    ballThrow = true;
    ballArray[0].setDirection(1.2, -1.2);
}


// 화면에 바를 그린다
function drawBar() {
    context.strokeStyle = bar.color;
    context.strokeRect(bar.x, bar.y, bar.width, bar.height);
}

// 공을 화면에 그린다
function drawBall() {
    if(!ballThrow) ballArray[0].setPosition(bar.x + bar.width/2, bar.y-ballArray[0].radius);
    ballArray.forEach(ball => {

        // 공 좌표 이동
        ball.moveBall();

        // 공 power 감소 (item 지속시간 감소)
        ball.decreasePower();

        // 공 그리기
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI, true);
        context.fillStyle = ball.color;
        context.fill();
    });

}

// 아이템 그리는 함수
function drawItem()
{
    itemArray.forEach(item=>{
        item.moveItem();
        context.drawImage(item.icon, item.x, item.y, item.size, item.size);
    })
}

// 화면에 그리는 함수.
function draw() {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // 화면 특정 시간마다 갱신하기
    animate = requestAnimationFrame(draw); // interval 대신. 애니메이션을 부드럽게.
    drawItem();
    drawBall();
    drawStage();
    drawBar();
    detectCollision();
    displayLivesAndScore();

}


// 일정확률로 x,y위치에서 아이템 드랍.
function dropItem(x,y)
{
    var rand = Math.floor(Math.random() * 50);
    switch(rand)
    {
        case 0: itemArray.push(new AddBall(x,y)); break;
        case 1: itemArray.push(new LifePlus(x,y)); break;
        case 2: itemArray.push(new WidenBar(x,y)); break;
        case 3: itemArray.push(new RemoveLine(x,y)); break;
        case 4: itemArray.push(new PowerBall(x,y)); break;
        default: break;
    }
}


// 목숨 감소
function decreaseLives() {
    ballThrow = false;
    lives--;
    if (lives <= 0) gameOver();
    else {
        initGame();

/*         // 볼 초기화
        ballArray = new Array();
        var ball = new Ball(WIDTH / 2, HEIGHT / 2, 2, 1, -1);
        ball.setColor("green");
        ballArray.push(ball); */
    }
}


//게임오버 글자를 만드는 함수
function drawGameover() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    var graient = context.createLinearGradient(0, 0, WIDTH, 0);
    graient.addColorStop("0", "red");
    graient.addColorStop("0.5", "yellow");
    graient.addColorStop("1.0", "orange");
    context.font = "40px Verdana";
    context.fillStyle = graient;
    context.fillText("GAME OVER", 28, 63);
    
}

function gameOver() {
    clearInterval(timer);
    cancelAnimationFrame(animate);
    ballArray.splice(0, 1);
    drawGameover();
    displayLivesAndScore();
    removeEvent(setBack);
    removeEvent(settingStage);
    removeEvent(playMusic);
    removeEvent(throwingBall);
    addEvent(replay);
    addEvent(reset);
    drawReplay();
    drawReset();
  }

//옆장으로 넘어가는 화살표를 그리는 함수
function drawNextbtn() {
    context.beginPath();
    context.moveTo(268, 130);
    context.lineTo(268, 145);
    context.lineTo(293, 137);
    context.closePath();
    context.fillStyle = "black";
    context.fill();
}

//화살표를 클릭헸을때의 이벤트
function move_settingPage(e)
{
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;
    if ((relativeX>=259&&relativeX<=303)&&(relativeY>=120&&relativeY<=155))
    {settingPage(e);}
}

//환경설정페이지
function settingPage(e) {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    removeEvent(settingStage);
    addEvent(setBack);
    addEvent(playMusic);
    drawPbtn();
    drawsettingpageLine();
    insertImage("./assets/beach.jpg",15,5,53,40);
    insertImage("./assets/universe.jpg",85,5,53,40);
    insertImage("./assets/mountain.jpg",156,5,53,40);
    insertImage("./assets/city.jpg",229,5,53,40);
    insertImage("./assets/musicplay.jpg",35,80,57,35);
    insertImage("./assets/musicplay.jpg",112,80,57,35);
    insertImage("./assets/musicplay.jpg",189,80,57,35);
    playMusic(e);
}

//다시 계단있는 페이지로 돌아간다.
function move_stairPage(e)
{
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;

     if ((relativeX>=0&&relativeX<=42)&&(relativeY>=120&&relativeY<=155))
    {

     context.clearRect(0,0,WIDTH,HEIGHT);
     removeEvent(setBack);
     init();
     addEvent(settingStage);
     drawStair();
     settingStage(e);
     drawNextbtn();
    }
}

//다시 앞으로 돌아가는 버튼을 그린다
function drawPbtn() {
    context.beginPath();
    context.moveTo(32, 130);
    context.lineTo(32, 145);
    context.lineTo(7, 137);
    context.closePath();
    context.fillStyle = "black";
    context.fill();

}

//canvas2에 목숨을 표시한다.
function displayLives() {
    context2.fillText("LIVES: " + lives, canvas2.width / 2 - 130, canvas2.height / 2 -20);
}


// canvas2에 점수 표시
function displayScore()
{
    context2.fillText("SCORE: " + totalScore, canvas2.width / 2 - 130, canvas2.height / 2 + 20);
}

function displayLivesAndScore()
{
    context2.font = "40px Verdana"
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    displayLives();
    displayScore();
}


//음악선택과 배경선택을 나누는 선을 그린다
function drawsettingpageLine()
{
    context.beginPath();
    context.moveTo(0,65);
    context.lineTo(300,65);
    context.stroke();
    context.fillStyle="black";
}

//canvas에 이미지를 삽입한다.
function insertImage(src,x,y,width,height)
{
    var image = new Image();
    image.src = src;
    var imageX = x;//이미지의 x좌표 
    var imageY = y;//이미지의 y좌표
    var imageWidth = width;//이미지의 가로
    var imageHeight = height;//이미지의 세로

    image.onload = function()
    {context.drawImage(image,imageX,imageY,imageWidth,imageHeight);}
}

// 그림을 클릭하면 배경이 설정된다
function setBack(e)
{
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;

    if ((relativeX>=17&&relativeX<=68)&&(relativeY<=51)&&(relativeY>=12))
        {document.getElementById("frame").style.backgroundImage="url('./assets/beach1.jpg')";}
    if ((relativeX>=87&&relativeX<=139)&&(relativeY<=51)&&(relativeY>=12))
        {document.getElementById("frame").style.backgroundImage="url('./assets/universe2.jpg')";}
    if ((relativeX>=157&&relativeX<=209)&&(relativeY<=51)&&(relativeY>=12))
        {document.getElementById("frame").style.backgroundImage="url('./assets/mountain1.jpg')";}
    if ((relativeX>=230&&relativeX<=282)&&(relativeY<=51)&&(relativeY>=12))
        {document.getElementById("frame").style.backgroundImage="url('./assets/city1.jpg')";}

}

//음악을 재생하는 함수
function getMusic(id)
{
    var mussssic = document.getElementById(id);
    mussssic.play();
}

//검정 버튼을 클릭하면 음악이 나오는 함수 
function playMusic(e)
{
      var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
      var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;

      if ((relativeX>=60&&relativeX<=74)&&(relativeY<=104)&&(relativeY>=93))
        {
            stopMusic('myAudio2');
            stopMusic('myAudio3');
            getMusic("myAudio1");
        }
    if ((relativeX>=136&&relativeX<=152)&&(relativeY<=104)&&(relativeY>=93))
        {
            stopMusic('myAudio1');
            stopMusic('myAudio3');
            getMusic("myAudio2");
        }
    if ((relativeX>=213&&relativeX<=228)&&(relativeY<=104)&&(relativeY>=93))
        {
            stopMusic('myAudio1');
            stopMusic('myAudio2');
            getMusic("myAudio3");
        }

}

//음악을 멈추는 함수
function stopMusic(id)
{
    var mussssic = document.getElementById(id);
    mussssic.pause();
}

function drawReplay()
{
    context.font = "15px Verdana";
    context.fillStyle = "black";
    context.fillText("REPLAY",50,113);   
}

function drawReset()
{
    context.font = "15px Gothic";
    context.fillStyle = "black";
    context.fillText("RESET",200,113);
}

//해당 단계를 다시 시작
function replay(e){
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;

    if ((relativeX>=50&&relativeX<=111)&&(relativeY>=100&&relativeY<=117))
    {gameStart(4);}//일단 임의로 시작하게 만들었습니다.

}

//처음으로 돌아간다
function reset(e){
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;

    if ((relativeX>=200&&relativeX<=245)&&(relativeY>=100&&relativeY<=117))
    {
     context.clearRect(0,0,WIDTH,HEIGHT); 
     init();
     addEvent(settingStage);
     addEvent(move_settingPage);
     addEvent(move_stairPage);
     drawNextbtn();
     displayLivesAndScore();
    }

}
