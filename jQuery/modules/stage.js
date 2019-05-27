
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
   
           // 색깔 골라서 벽돌 삽입
           var colors = Object.entries(COLORS)[Math.floor(Math.random()*5)];
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
           super.initBlockArr(30, 5, 10, 8);
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
           super.initBlockArr(30, 5, 10, 10);
           this.placeBlocks();
       }
   
       // 블록 배치. Stage따라 다르다.
       placeBlocks() {
            for (var i = 0; i < this.block_in_col; i++) {
               for (var j = 0; j < this.block_in_row; j++)
                   if ((11 * i + 3 * j) % 6) this.blockArr[i][j].state = false;  //블럭 배치 모양 만들기
                   // if(!(i==4 && j == 3)) this.blockArr[i][j].state = false;
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
           super.initBlockArr(20, 5, 15, 11);
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
           super.initLineTimer(150000); //이정도 속도면 초등학생도 클리어 가능 할것 같습니다!
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
   


export {Stage, Stage_One, Stage_Two, Stage_Three, Stage_Four};