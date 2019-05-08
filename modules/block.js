// block.js : 블럭 관련한 함수 모아둔 .js 파일

class Block
{
    // 블럭 생성자
    constructor(x, y, color, width, height) {
        //좌표값 설정
        this.x = x;
        this.y = y;

        //색깔 설정
        this.color = color;

        // 크기 설정
        this.width = width;
        this.height = height;

        // 블럭 표시 유무. 
        this.status = true;
        
/*      아직 기능 추가 X 
        this.point = point;
        this.shape = shape;
        this.item = item;
 */        
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



// class 내보내기
export default Block;


