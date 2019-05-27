/**
 * 아이템 상위 클래스
 */
class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dy = 1;
        this.size = WIDTH / 100 * 3;
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
        ballArray.push(new Ball(bar.x, bar.y, 2, 30, (level-1)/2 + 2));

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
        stage.blockArr.length -= 1;
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
            ball.setColor("#FC646A");
        });
    }
}
