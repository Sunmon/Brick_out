// 전역 변수
var canvas;
var context;

window.onload = function()
{
    init();
}

class Block
{
    // 블럭 생성자
    constructor(x, y, color, width, height) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = width;
        this.height = height;
        this.status = true;
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


// 게임 스테이지 설정
class Stage
{
    static score = 0;

    constructor()
    {
        this.initStage();
        this.setBlockArr(0,0);
        this.placeBlocks();
    }

    
    initStage()
    {
        this.lineTimer = -1;                                            // 블럭 내려오는 속도
        this.block_in_row = -1;                                         // 한 라인에 존재 가능한 최대 블록 수
        this.colors = ["red", "orange", "blue", "green", "purple"];     // 블럭 색깔. 
    }

    // TODO: 파라미터 이상함. 좀 더 이쁘게 고칠 것
    // blockArr 배열 생성
    setBlockArr(block_width, block_height, lines)
    {
        // this.block_width = block_width;                      //block_width지정해줬을때
        this.block_width = canvas.width / this.block_in_row;    //블록 넓이 정하기
        this.block_height = block_height;                       //블록 높이 정하기
        this.block_lines = lines;                               //블록 몇 줄인지 정하기

        // blockArr라는 2차원 배열 생성
        this.blockArr = new Array(this.block_lines).fill(null).map(() => Array(this.block_width));
    }

    // 블럭 배치
    placeBlocks(){};
}

// 첫번째 스테이지
class Stage_One extends Stage
{
    constructor()
    {
        super();
    }

    initStage()
    {
        super.initStage();
        this.lineTimer = 5000;
        this.block_in_row = 10;
    }

    // 블록 배치. Stage따라 다르다.
    placeBlocks()
    {
        super.setBlockArr(5,10,5);

        // blockArr에 블록 객체 생성
        for(var i = 0; i<this.block_lines; i++)
        {
            for(var j = 0; j<this.block_in_row; j++)
            {
                this.blockArr[i][j] = new Block(this.block_width * j, this.block_height * i, this.colors[i], this.block_width, this.block_height);
                var valid = (2*i+j)%5;
                if(!valid) this.blockArr[i][j].status = false;
            }
        }
    }

}



function draw()
{
}


function init()
{
    canvas = document.getElementById("frame");
    context  = canvas.getContext("2d");
    test();

}


// 임시 테스트 함수
function test()
{
    var stage = new Stage_One();

    // stage 그리기
    stage.blockArr.forEach(blockRow=>
        {
            blockRow.forEach(block=>
                {
                    if(!block.status) return;
                    /* context.fillStyle = block.color;
                    context.fillRect(block.x, block.y, block.width, block.height); */
                    context.strokeStyle = block.color;
                    context.strokeRect(block.x, block.y, block.width, block.height);
                });
        });
 

}