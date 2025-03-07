import Sketch from 'react-p5';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import { FaRegSmileBeam } from "react-icons/fa";
import { renderToStaticMarkup } from 'react-dom/server';
import Nav from './componet/nav';

function App() {

  const [ minusX, setMinusX ] = useState(1);
  const [ minusY, setMinusY ] = useState(1);
  const [ count, setCount, ] = useState(0);
  const navigate = useNavigate();

  //避免useState狀態改變react重新渲染之後 位置直接重置回原點
  const positionRef =useRef({
    x:400,
    y:400
  });
  const imgRef = useRef(null);
  const hueRef = useRef(0);

  //畫出canvas畫布
  const setup = (p5, canvasParentRef) => {
    //設定畫布大小然後回傳給父層
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    //設定背景顏色
    p5.background(0,0,0);
    //設定每秒執行次數 預設是60
    p5.frameRate(60);
    //設定顏色模式 可以讓顏色順暢的轉換
    p5.colorMode(p5.HSB);
    //眼睛的角度
    p5.angleMode(p5.DEFREES);

    //將React Icon 轉換為SVG字串
    const svgString  = renderToStaticMarkup(<FaRegSmileBeam />);
    //創建 SVG data URL
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    //載入 SVG
    p5.loadImage(svgUrl, img => {
      imgRef.current = img;  // 將載入的圖片存在 ref 中
    });
  }

  
  //會一直不斷重複執行 把畫面畫出來
  const draw =(p5) => {
    setCount(count +1);
    if(count > 50){
      p5.background(0,0,0, 0.3);
      setCount(0);;
    }
    
    //將其註解就會留下行徑軌跡
    
    // p5.background(200);

    //邊界碰撞判斷
    if( positionRef.current.x > p5.width){
      setMinusX(-1);
      positionRef.current.x = p5.width;
    }else if (positionRef.current.x < 0){
      setMinusX(1);
      positionRef.current.x = 0;
    }
    if( positionRef.current.y > p5.height){
      setMinusY(-1);
      positionRef.current.y = p5.height;
    }else if (positionRef.current.y < 0){
      setMinusY(1);
      positionRef.current.y = 0;

    }
    //移動速度
    positionRef.current.x += 1*minusX;
    positionRef.current.y += 1*minusY;

    //顏色變化速度
    hueRef.current +=0.5;

    if(hueRef.current > 360){
      hueRef.current = 0;
    };
    

    //如果要畫兩個東西以上的話 要用push跟pop隔離 才不會互相影響
    
    p5.push(); // 保存當前的變換狀態
    //形狀邊框顏色
    p5.stroke(hueRef.current, 80, 90);
    //形狀裡面不要有顏色
    p5.noFill();
    p5.translate(positionRef.current.x, positionRef.current.y); // 移動原點到方塊中心
    p5.rotate(p5.frameCount * 0.012); // 旋轉，使用 frameCount 來創建連續旋轉
    p5.square(-50, -50, 100); // 因為已移動原點，所以座標要調整
    
    
    p5.pop(); // 恢復之前的變換狀態

    

    //畫左眼
    let leftX = 150;
    let leftY = 100;
    let leftAngle = p5.atan2(p5.mouseY - leftY, p5.mouseX - leftX);
    p5.push();
    p5.translate(leftX, leftY);
    p5.fill(255);
    p5.ellipse(0, 0, 50, 50);
    p5.rotate(leftAngle);
    p5.fill(0);
    p5.ellipse(12.5, 0, 25, 25);
    p5.pop();

    //畫右眼
    let rightX = 250;
    let rightY = 100;
    let rightAngle = p5.atan2(p5.mouseY - rightY, p5.mouseX - rightX);
    p5.push();
    p5.translate(rightX, rightY);
    p5.fill(255);
    p5.ellipse(0, 0, 50, 50);
    p5.rotate(rightAngle);
    p5.fill(0);
    p5.ellipse(12.5, 0, 25, 25);
    p5.pop();
  }

  return (
    <div className="App">
      <Sketch
        setup={setup}
        draw={draw}
      />
      <Nav/>
    </div>
  );
}

export default App;
