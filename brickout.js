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
        this.state = true;
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
    }

    initStage()
    {
        this.lineTimer = -1;                                            // 블럭 내려오는 속도
        this.colors = ["red", "orange", "blue", "green", "purple"];     // 블럭 색깔. 
        this.blockArr = new Array();
        // this.initBlockArr(10,10,10,10);
        // this.placeBlocks();
    }

    // blockArr 배열 생성
    initBlockArr(block_width, block_height, block_in_row, block_in_col)
    {
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

    insertLine(blockArr, block_in_row)
    {
        this.downBlock(blockArr);
        var color = this.colors[Math.floor(Math.random()*5)];
        blockArr.push(this.createNewLine(block_in_row, color));
    }

    // block 한 줄씩 아래로 당기기
    downBlock(blockArr)
    {
        // 한줄씩 아래로 당기기
        blockArr.forEach(line=>
        {
        line.forEach(block=>
            {
                block.y += block.height;
            });
        });
    }


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

// 첫번째 스테이지
class Stage_One extends Stage
{
    initStage()
    {
        super.initStage();
        super.initBlockArr(10,5,30,8);
        this.placeBlocks();
        this.lineTimer = 5000;
    }

    // 블록 배치. Stage따라 다르다.
    placeBlocks()
    {
        for(var i = 0; i<this.block_in_col; i++)
        {
            for(var j = 0; j<this.block_in_row; j++)
            {
                if((2*i + 7*j) % 3) this.blockArr[i][j].state = false;
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


function gameStart(level)
{
    switch(level)
    {
        case 1: return new Stage_One();
        default: return new Stage();
    }
}


// 임시 테스트 함수
function test()
{
    // var stage = new Stage_One();
    var stage = gameStart(1);
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