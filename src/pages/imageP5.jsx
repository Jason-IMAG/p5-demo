import Sketch from "react-p5";
import Nav from '../componet/nav';
import './image.css'
import { useRef, useState } from 'react';


function Image(){

  const porscheRef = useRef(null);
  const topRef = useRef(null);
  const rotateRef = useRef(0);
  const p5Ref = useRef(null);
  const combinedCanvasRef = useRef(null);

  const [isOverlaid, setIsOverlaid] = useState(false);
  

  const preload1 = (p5) => {
    porscheRef.current = p5.loadImage('/images/porsche.png')
  }

  const preload2 = (p5) => {
    topRef.current = p5.loadImage('/images/porscheLogo.png')
  }

  const setup1 = (p5, canvasParentRef) => {
    p5.createCanvas(300, 300).parent(canvasParentRef);
    p5.background(0);
    
  }

  const draw1 = (p5) => {
    p5.background(0);
    if(porscheRef.current && porscheRef.current.width > 0){
      p5.image(porscheRef.current, 0, 0, 300, 300);
    }
  }

  const setup2 = (p5, canvasParentRef) => {
    p5.createCanvas(300, 300).parent(canvasParentRef);
    p5.background(200);
  }

  const draw2 = (p5) => {

    //不要有背景
    p5.clear();

    //畫出圖片
    if(topRef.current  && topRef.current.width > 0){
      p5.push();
      //設置透明度(第四個參數是alpha 值 , 範圍 0 - 255)
      //255是完全不透明， 0 是完全透明
      p5.tint(255, 255, 255, 250);
      p5.translate(p5.width/2, p5.height/2);//移動到畫布中心
      p5.rotate(rotateRef.current);
      p5.imageMode(p5.CENTER);
      p5.image(topRef.current, 0, 0, 300, 50)
      p5.pop();
    }
  }
  //旋轉右圖片
  const rotateRight = () => {
    rotateRef.current += Math.PI / 4;
    if( p5Ref.current){
      p5Ref.current.redraw();
    }
  }
  //設置疊加後的畫布
  const setupCombined = (p5, canvasParentRef) => {
    combinedCanvasRef.current = p5.createCanvas(300, 300).parent(canvasParentRef);
    p5.background(0);
  }
  //畫出疊加後的畫布
  const drawCombined = (p5) => {
    p5.background(0);
    
    // 繪製底層圖片 (Canvas1 的內容)
    if (porscheRef.current && porscheRef.current.width > 0) {
      p5.image(porscheRef.current, 0, 0, 300, 300);
    }
    
    // 繪製上層半透明圖片 (Canvas2 的內容)
    if (topRef.current && topRef.current.width > 0) {
      p5.push();
      p5.tint(255, 255, 255, 250);
      p5.translate(p5.width/2, p5.height/2);
      p5.rotate(rotateRef.current);
      p5.imageMode(p5.CENTER);
      p5.image(topRef.current, 0, 0, 300, 50);
      p5.pop();
    }
  }



  return(
    <div>
      {!isOverlaid ? (
        <>
        <div className='canvas-container'>
          <Sketch
            setup={setup1}
            draw={draw1}
            preload={preload1}
          />
          <Sketch
            setup={setup2}
            draw={draw2}
            preload={preload2}
          />
        </div>
        </>
      ) : (
        <>
        <div className='canvas-container'>
          <Sketch
            setup={setupCombined}
            draw={drawCombined}
          />
        </div>
        </>
      )}
      <div className="button-container">
        <div>
          <button onClick={rotateRight}>
            旋轉右1圖片
          </button>
        </div>
        <div>
          <button onClick={() => setIsOverlaid(!isOverlaid)}>
            {isOverlaid ? '取消疊加' : '疊加'}
          </button>
        </div>
      </div>
      
      
      <Nav/>
    </div>
  )
}

export default Image;