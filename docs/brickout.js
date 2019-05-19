import Block from "block.js"


// 전역 변수
var canvas;
var context;
var stage;
var bar;
var ball;
var canvas2;
var context2;
var WIDTH; //canvas의 폭과 높이 
var HEIGHT;
var lives = 3;//목숨
var animate;    //animation 시작, 정지 변수
var timer;
var ballArray;

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

function settingStage(e)
{
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;
   
   //stage1을 선택할 때
    if ((relativeX>0&&relativeX<=75)&&(relativeY>=84&&relativeY<=115)) {test(1);}
    //stage2를 선택할 떄
    if ((relativeX>=76&&relativeX<=150)&&(relativeY>=54&&relativeY<=84)) {test(2);}
    //stage3을 선택할 때
    if ((relativeX>=151&&relativeX<=225)&&(relativeY>=26&&relativeY<=55)) {test(3);}
    //stage4를 선택할 때
    if ((relativeX>=226&&relativeX<=300)&&(relativeY>=0&&relativeY<=25)) {test(4);}  
}




window.onload = function () {
    init();
    addEvent(settingStage);
    addEvent(move_settingPage);
    addEvent(move_stairPage);
    drawNextbtn();
    displayLives();
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
    // score: 모든 스테이지에서 합산 되어야 하므로 static
    static score = 0;

    constructor() {
        this.initStage();
    }

    initStage() {
        this.colors = ["red", "orange", "blue", "green", "purple"];     // 블럭 색깔. 
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

        // 새 블럭 한 줄 맨 위에 삽입
        var color = this.colors[Math.floor(Math.random() * 5)];
        blockArr.push(this.createNewLine(block_in_row, color));
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
    }

    // 아이템 떨어지기
    dropItem() {
        this.y += 1;
    }

    // 아이템 효과 적용
    affect() {
        // 아이템 삭제
        delete (this);
    }
}


// 공 추가해주는 아이템 클래스
class AddBall extends Item {
    affect() {
        super.affect();
        ballArray.push(new Ball(bar.x, bar.y, 2, 1, -1));
        delete (this);
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
    constructor(x, y, radius, dx, dy) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
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
}// 공 class


class Bar {

    //bar의 생성자
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;


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







// 임시 테스트 함수
function test(level) {
    // 레벨 맞는 스테이지 생성
    stage = setLevel(level);

    // Bar 그리기
    bar = new Bar(30, HEIGHT - 40, "black", 100, 5);

    // ball 그리기
    ball = new Ball(bar.x + (bar.width / 2), bar.y - 3, 2, 1.2, -1.3);
    ball.setColor("green");

    // TODO: ball Array이용하기
    ballArray = new Array();
    ballArray.push(ball);

    ballArray.push(new Ball(bar.x + 10, bar.y - 3, 2, 1, -1.3))

    // 화면 그림 갱신하기
    // var drawing = setInterval(draw,10);
    // 화면 특정 시간마다 갱신하기
    // animate = requestAnimationFrame(draw); // interval 대신. 애니메이션을 부드럽게.
    draw();

    // 일정 시간마다 블럭 내려오기
    timer = setInterval(function () {
        stage.insertLine(stage.blockArr, stage.block_in_row)
    }, stage.lineTimer);

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
}

// 특정 좌표가 border 범위 내인지 확인
function isInBorder(border_min, border_max, pos) {
    return ((border_min <= pos) && (border_max >= pos));
}

// 벽돌과 충돌 감지
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
                    ball.setDirection(ball.dx, -ball.dy);
                }

                if (isInBorder(upBorder, downBorder, y)) {
                    if (!isInBorder(leftBorder, rightBorder, x + ball.dx)) return;
                    block.state = false;
                    ball.setDirection(-ball.dx, ball.dy);
                }

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
    });
}

// 벽과 충돌 검사하고 공의 방향을 바꾼다
function detectCollision_wall() {

    ballArray.forEach(ball => {
        // 천장, 바닥과 충돌 검사
        if (!isInBorder(0, HEIGHT, ball.y + ball.dy)) {
            ball.dy < 0 ? ball.setDirection(ball.dx, -ball.dy) :
                ballArray.length > 1 ? ballArray.splice(ball, 1) : decreaseLives();
        }

        // 좌우 벽과 충돌 검사
        if (!isInBorder(0, WIDTH, ball.x + ball.dx)) ball.setDirection(-ball.dx, ball.dy);
    });

}



// 화면에 바를 그린다
function drawBar() {
    context.strokeStyle = bar.color;
    context.strokeRect(bar.x, bar.y, bar.width, bar.height);
}

// 공을 화면에 그린다
function drawBall() {
    // TODO: ballArray 이용

    /*     // 공 좌표 이동
        ball.moveBall();
    
         // 공 그리기
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI, true);
        context.fillStyle = ball.color;
        context.fill(); */

    // if(ballArray == null) return;

    ballArray.forEach(ball => {
        // 공 좌표 이동
        ball.moveBall();

        // 공 그리기
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2.0 * Math.PI, true);
        context.fillStyle = ball.color;
        context.fill();
    });

}

// 화면에 그리는 함수.
function draw() {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // 화면 특정 시간마다 갱신하기
    animate = requestAnimationFrame(draw); // interval 대신. 애니메이션을 부드럽게.

    drawBall();
    drawStage();
    drawBar();
    detectCollision();
    displayLives();

}






// 목숨 감소
function decreaseLives() {
    lives--;
    if (lives <= 0) gameOver();
    else {
        // 볼 초기화
        ballArray = new Array();
        var ball = new Ball(WIDTH / 2, HEIGHT / 2, 2, 1, -1);
        ball.setColor("green");
        ballArray.push(ball);
    }
}


//게임오버 글자를 만드는 함수
function drawGameover() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    var graient = context.createLinearGradient(0, 0, WIDTH, 0);
    graient.addColorStop("0", "red");
    graient.addColorStop("0.5", "yellow");
    graient.addColorStop("1.0", "orange");
    context.fillStyle = graient;
    context.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2);
    context.font = "50px Verdana";
}

function gameOver() {
    clearInterval(timer);
    cancelAnimationFrame(animate);
    ballArray.splice(0, 1);
    drawGameover();
    displayLives();
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
    {settingPage();}
}

//환경설정페이지
function settingPage() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    drawPbtn();
}

//다시 계단있는 페이지로 돌아간다.
function move_stairPage(e)
{
    var relativeX = (e.clientX-canvas.offsetLeft)*WIDTH/canvas.clientWidth;
    var relativeY = (e.clientY-canvas.offsetTop)*HEIGHT/canvas.clientHeight;

     if ((relativeX>=0&&relativeX<=42)&&(relativeY>=120&&relativeY<=155))
    {
     context.clearRect(0,0,WIDTH,HEIGHT);
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
    context2.clearRect(0, 0, canvas2.width, canvas2.height);
    context2.font = "45px Verdana"
    context2.fillText("LIVES: " + lives, canvas2.width / 2 - 130, canvas2.height / 2 - 20);
}