
/**
 * 블럭 한 개에 대한 속성을 정의한다.
 * Stage를 만들 때, 이 클래스의 배열을 이용한다.
 */
class Block {
    // 블럭 생성자
    // TODO: css 속성 이용할 것
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

export {Block};