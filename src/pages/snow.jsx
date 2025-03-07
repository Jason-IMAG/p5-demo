import Sketch from "react-p5";
import Matter from "matter-js";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import '../App.css';
import Nav from '../componet/nav';

function Snow (){

  const navigate = useNavigate();
  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const snowRef = useRef([]);
  const snowSpeedRef = useRef(0); 
  const roofRef = useRef(null);
  const baseRef = useRef(null);
  const countRef = useRef(0);
  const [p5, setP5] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const { Engine, World } = Matter;
    const engine = Engine.create();
    engineRef.current = engine;
    worldRef.current = engine.world;
    engine.gravity.y = 0.1;
    setIsReady(true);
    
    return () => {
      World.clear(worldRef.current);
      Engine.clear(engineRef.current);
    }
  },[])

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    p5.background(0);
    setP5(p5);
  }
  //確保在載入matter及p5之後才創建雪球
  useEffect(()=>{
    if(isReady && worldRef.current && p5){
      createSnow(p5, 400);
      // createHouse(p5);
      createRoof(p5.windowWidth/2, p5.windowHeight - 300, 200, 100)
      console.log(snowRef.current[0].id);
    }
    
  },[isReady, p5])
  

  const draw = (p5) => {

    if(engineRef.current){
      Matter.Engine.update(engineRef.current); 
    }
   
    p5.background(0);
    
    //畫出雪球
    p5.push();
    if(snowRef.current && snowRef.current.length > 0){
      
      snowRef.current.forEach((snow) =>{
        
        const pos = snow.position;
        const size = snow.circleRadius;
        p5.noStroke();
        p5.fill(255);
        p5.circle(pos.x, pos.y, size)
        
        if(pos.y > p5.windowHeight){
          Matter.Body.setPosition(snow, {
            x: p5.random(0, p5.windowWidth),
            y: p5.random(-10,-2)
          })
          Matter.Body.setVelocity(snow, {
            x: p5.random(-snowSpeedRef.current, snowSpeedRef.current),
            y: snowSpeedRef.current
          })
        }
      })
    }
    p5.pop();

    //每800幀多創建80個雪球 避免屋頂積太多雪球變太少
    if(snowRef.current.length < 1000){
      if(p5.frameCount % 800 === 0 ){
        createSnow(p5, 80);
        console.log(snowRef.current.length);
      }
    }


    //畫出屋頂
    p5.push();
    if(roofRef.current){
      const pos = roofRef.current.position;
      p5.fill(255, 0, 0);
      p5.noStroke();
      p5.triangle(
        pos.x, pos.y-67, 
        pos.x + 200, pos.y+33, 
        pos.x - 200, pos.y+33 
      )

    }
    p5.pop();
  }
  //創建雪
  const createSnow = (p5, count) => {
    snowSpeedRef.current = 2;
    const snowSize = 2;

    for(let i = 0; i< count; i++){
      const randomX = p5.random(0, p5.windowWidth);
      const randomY = p5.random(-p5.windowHeight, -2);
      const snow = Matter.Bodies.circle(
        randomX,
        randomY,
        snowSize,
        {
          frictionAir:0.01,
          density: 0.05,
          friction:0.01,
          restitution: 0.2,
        }
      )
      
      Matter.Body.setVelocity(snow,{
        x: p5.random(-snowSpeedRef.current, snowSpeedRef.current),
        y: p5.random(0,2)
      })
      Matter.World.add(worldRef.current, snow);
      snowRef.current.push(snow);
    }
  }

  // 創建屋頂（等腰三角形）
  const createRoof = (x, y, width, height) => {
    // 定義等腰三角形的頂點
    const vertices = [
      { x: x, y: y },                  //頂點
      { x: x + width, y: y + height }, //右角 
      { x: x - width, y: y + height}   //左角
    ];
    
    // 計算重心（三角形的重心是三個頂點的平均值）
    const centroid = {
      x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
      y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3
    };
    
    // 創建三角形，以重心為中心
    const roof = Matter.Bodies.fromVertices(
      centroid.x, centroid.y,
      [vertices],
      {
        friction:0.01,
        frictionStatic:0.05,
        isStatic:true
      }
    );
    
    Matter.World.add(worldRef.current, roof);
    roofRef.current = roof;
    
  };

  const windowResized = (p5) => {
    // 當視窗大小改變時，重新設置畫布大小
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    p5.background(0);
  };

  return(
    <div>
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
      />
      <Nav/>
    </div>
  )
}

export default Snow;