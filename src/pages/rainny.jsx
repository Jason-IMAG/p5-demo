import Sketch from "react-p5";
import "../App.css";
import { useNavigate } from 'react-router-dom';
import Nav from '../componet/nav';

function Rainny() {
  let drops = [];
  const dropsCount = 500;
  const umbrellaSize = 300;
  const navigate = useNavigate();
  
  let minHeight ;

  // setup() 函數在畫布創建時執行一次
  const setup = (p5, canvasParentRef) => {
    // 創建畫布並將其附加到父元素
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.background(100);

    minHeight = p5.windowHeight*0.8;
    

    //初始化雨滴
    for (let i = 0; i < dropsCount; i++) {
      const initialLength = p5.random(10, 20);
      drops.push({
        x: p5.random(p5.width),
        y: p5.random(p5.height),
        length: initialLength,
        speed: p5.random(2, 6),
        originalLength: initialLength,
      });
    }
  };
  const isPointInTriangle = (p5, px, py, x1, y1, x2, y2, x3, y3) => {
    const areaOrig = p5.abs((x2-x1)*(y3-y1) - (x3-x1)*(y2-y1));
    const area1 = Math.abs((x1-px)*(y2-py) - (x2-px)*(y1-py));
    const area2 = Math.abs((x2-px)*(y3-py) - (x3-px)*(y2-py));
    const area3 = Math.abs((x3-px)*(y1-py) - (x1-px)*(y3-py));

    return Math.abs(area1 + area2 + area3 - areaOrig) < 0.01;
  }
  // draw() 函數持續循環執行
  const draw = (p5) => {
    //背景色
    p5.background(230, 230, 250);
    //雨滴顏色
    p5.stroke(138, 143, 226);
    //雨滴粗細
    p5.strokeWeight(p5.random(1, 2));
    

    const limitedMouseY = p5.constrain(p5.mouseY, minHeight, p5.height);

    //畫出雨滴
    drops.forEach((drop) => {
     
      drop.y += drop.speed;

      

      //重置超出畫面的雨滴
      if (drop.y > p5.height) {
        drop.y = -drop.length;
        drop.x = p5.random(p5.width);
      }
      //判斷雨滴有沒有碰到傘
      //計算雨滴的尾部
      const tailY = drop.y + drop.length;

      //計算三角形的三個頂點
      const leftX = p5.mouseX - umbrellaSize / 2;
      const rightX = p5.mouseX + umbrellaSize / 2;
      const topX = p5.mouseX;
      const baseY = limitedMouseY;
      const topY = limitedMouseY - umbrellaSize / 2;


      if (isPointInTriangle(p5,
          drop.x, tailY, //雨滴尾部的座標
          leftX, baseY, //左頂點
          rightX, baseY, //右頂點
          topX, topY //上頂點
      )) {
            //碰到雨傘的時候 雨滴逐漸減少長度
        drop.length = Math.max(0, drop.length - drop.speed);
        
        if(drop.length <= 0){
          drop.y = -drop.originalLength;
          drop.x = p5.random(p5.width);
          drop.length = drop.originalLength;
        }
      }

      p5.line(drop.x, drop.y, drop.x, drop.y + drop.length);
    });
    //畫出雨傘
    // 畫三角形傘
    p5.push(); // 保存當前繪圖狀態

    // 畫傘柄
    p5.stroke(100);
    p5.strokeWeight(4);
    p5.line(p5.mouseX, limitedMouseY, p5.mouseX, limitedMouseY + 100);

    // 畫三角形傘面
    p5.fill(200, 100, 100, 200); // 紅色半透明
    p5.stroke(150, 75, 75);
    p5.strokeWeight(2);
    p5.triangle(
      p5.mouseX - umbrellaSize / 2,
      limitedMouseY, // 左頂點
      p5.mouseX + umbrellaSize / 2,
      limitedMouseY, // 右頂點
      p5.mouseX,
      limitedMouseY - umbrellaSize / 2 // 上頂點
    );

    p5.pop(); // 恢復繪圖狀態
  };

  const windowResized = (p5) => {
    // 當視窗大小改變時，重新設置畫布大小
    minHeight = p5.windowHeight*0.8;
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  // const mousePressed = (p5) => {
  //   // 滑鼠點擊時執行的程式
  // };

  const cleanup = (p5) => {
    p5.remove();
  };

  return (
    <div className="App">
      <Sketch
        setup={setup}
        draw={draw}
        unmount={cleanup}
        windowResized={windowResized}
      />
      <Nav/>
    </div>
  );
}

export default Rainny;
