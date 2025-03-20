import Matter, { World } from 'matter-js';
import { useEffect, useRef } from 'react';
import Nav from '../componet/nav';


function App() {

  const sceneRef = useRef(null);
  
  useEffect( ()=>{
    if(!sceneRef.current) return;
    const { 
      Engine, 
      Render, 
      Runner, 
      Bodies, 
      Body, 
      Composite, 
      Events,
      Mouse,
      MouseConstraint,
      Constraint,
      
    } = Matter;

    

    const engine = Engine.create();
    console.log(sceneRef.current.clientWidth);
    console.log(sceneRef.current.clientHeight);
    const width = Math.min(sceneRef.current.clientWidth, 800);
    const height = sceneRef.current.clientHeight*0.8
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options:{
        width:width, //畫布寬度
        height:width === 800 ? 1200 : height, //畫布高度
        wireframes:false, //是否顯示線框 不是單指畫布外框 而是畫布內所有物體都會變
        background: '#f0f0f0' //背景顏色
      }
    });

    const scaleX = (x) => {
      if (!sceneRef.current) return x; // 防護檢查
      return x/800*Math.min(sceneRef.current.clientWidth, 800);
    }
    const scaleY = (y) => {
      if (!sceneRef.current) return y; // 防護檢查
      return y/1200*sceneRef.current.clientHeight;
    }

    //矩形參數 中心x,y 寬, 高
    const boxA = Bodies.rectangle(scaleX(665), scaleY(320), scaleX(20), scaleY(200),{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#ffe4c8' }
    });
    const boxB = Bodies.rectangle(scaleX(735), scaleY(320), scaleX(20), scaleY(200),{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#ffe4c8' }
    });
    const boxC = Bodies.rectangle(scaleX(665), scaleY(520), scaleX(20), scaleY(200),{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#ffe4c8' }
    });
    const boxD = Bodies.rectangle(scaleX(735), scaleY(520), scaleX(20), scaleY(200),{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#ffe4c8' }
    });
    const boxE = Bodies.rectangle(scaleX(700), scaleY(640), scaleX(20), scaleY(20),{
      restitution: 0,
      isStatic: true,
      render: { fillStyle: '#e74c3c' }
    });

    //圓形參數 圓心x,y 半徑
    const circle = Bodies.circle(scaleX(400), scaleY(200), scaleX(25 ), {
      restitution: 0.3,
      friction: 0.001,
      frictionAir: 0.01,
      density: 0.0001,
      render: { fillStyle: '#fffef4' }
    });

    //發射器彈簧及物體
    const rockOptions = { density: 0.004 };
    const rock = Bodies.circle(scaleX(700), scaleY(480), scaleX(20), rockOptions);
    const anchor = { x: scaleX(700), y: scaleY(480) };
    const spring = Constraint.create({ 
      pointA: anchor, 
      bodyB: rock, 
      length: 0.1,
      damping: 0.1 ,
      stiffness: 0
    });

  //多個隨機障礙物
  function createObstacles(x, y, moveX, radius, count){
    const ManyObstacles = [ 
        Bodies.circle(scaleX(670), scaleY(450), scaleX(13),{
          isStatic: true,
          restitution: 0.8,
          render:{ fillStyle:'#030402'}
        }),
        Bodies.circle(scaleX(730), scaleY(450), scaleX(13),{
              isStatic: true,
              restitution: 0.8,
              render:{ fillStyle:'#030402'}
            })
        ];
    for(let i = 0; i <= count; i ++){
      const loopX = x * i  + moveX + 100;
      const loopY = y + 100;
      const obstacle = Bodies.circle( scaleX(loopX), scaleY(loopY), scaleX(radius), {
        isStatic: true,
        restitution: 0.8,
        render:{ fillStyle:'#030402'}
      })
      ManyObstacles.push(obstacle);
    } 
    return ManyObstacles;
  }
  //參數 障礙物間距, 障礙物Y , 平移X的量, 障礙物半徑, 障礙物數量
  const obstacles1 = createObstacles(80, 80, 80, 10, 4);
  const obstacles2 = createObstacles(80, 180, 40, 10, 6);
  const obstacles3 = createObstacles(80, 280, 0, 10, 6);
  const obstacles4 = createObstacles(80, 380, 40, 10, 6);
  const obstacles5 = createObstacles(80, 480, 0, 10, 6);
  const obstacles6 = createObstacles(80, 580, 40, 10, 6);
  const obstacles = [...obstacles1, ...obstacles2, ...obstacles3, ...obstacles4, ...obstacles5, ...obstacles6];

    //地板
    // const ground = Bodies.rectangle(scaleX(400), scaleY(800), scaleX(500), scaleY(20), { 
    //   isStatic: true,
    //   angle: Math.PI/25,
    //   restitution:0.1 ,
    //   friction:0.001  
    // });
    
    //牆壁
    const walls = [
      // 底部
      Bodies.rectangle(scaleX(400), scaleY(920), scaleX(800), scaleY(20), { 
          isStatic: true,
          render: { 
              fillStyle: '#2c3e50',
              opacity: 0.5 
          }
      }),
      // 頂部
      Bodies.rectangle(scaleX(400), scaleY(10), scaleX(800), scaleY(20), { 
          isStatic: true,
          render: { 
              fillStyle: '#2c3e50',
              opacity: 0.5 
          }
      }),
      // 左邊
      Bodies.rectangle(scaleX(10), scaleY(310), scaleX(20), scaleY(1200), { 
          isStatic: true,
          render: { 
              fillStyle: '#2c3e50',
              opacity: 0.5 
          }
      }),
      // 右邊
      Bodies.rectangle(scaleX(790), scaleY(310), scaleX(20), scaleY(1200), { 
          isStatic: true,
          render: { 
              fillStyle: '#2c3e50',
              opacity: 0.5 
          }
      })
  ];
    //彎道
    function createArcPath(centerX, centerY, radius, startAngle, endAngle, segments = 30) {
      const bodies = [];
      const angleStep = (endAngle - startAngle) / (segments - 1);
      
      for (let i = 0; i < segments; i++) {
          const angle = startAngle + (angleStep * i);
          
          // 計算每個段落的位置
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          
          const segment = Bodies.rectangle(
              x,
              y,
              10,  // 段落寬度
              10,  // 段落高度
              {
                  isStatic: true,
                  restitution: 0,     // 設置為 0 表示無彈跳
                  friction: 0.05,     // 可以調整摩擦力
                  slop:0.5,      
                  angle: angle,  // 使段落切於圓弧
                  render: { 
                      fillStyle: '#3498db',
                      strokeStyle: '#2980b9',
                      lineWidth: 1
                  },
                  chamfer: { radius: 5 }//圓滑程度
              }
          );
          
          bodies.push(segment);
      }

      return bodies;
  }
  const arcPath1 = createArcPath(
    scaleX(555),    // 圓心 x
    scaleY(200),    // 圓心 y
    scaleX(180),    // 半徑
    -Math.PI/2.2,      // 起始角度（弧度）
    0,  // 結束角度（弧度）
    100     // 段落數
  );
  const arcPath2 = createArcPath(
    scaleX(220),    // 圓心 x
    scaleY(200),    // 圓心 y
    scaleX(180),    // 半徑
    Math.PI,      // 起始角度（弧度）
    Math.PI*1.5,  // 結束角度（弧度）
    100     // 段落數
  );

  const moveBall = Bodies.circle(scaleX(200), scaleY(300), scaleX(10),{
    isStatic:true, 
    render:{ fillStyle:'#000000'}
  });
  const moveBall2 = Bodies.circle(scaleX(450), scaleY(450), scaleX(10),{
    isStatic: true,
    render:{ fillStyle:'#030402'}
  });

  //加入滑鼠控制
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 0.2,
        render: {
            visible: false
        }
    }
  });

  //啟動事件
  Events.on(engine, 'beforeUpdate', () => {
    //計算讓球上下移動的y軸
    const px = scaleX(350) + scaleX(150) * Math.sin(engine.timing.timestamp * 0.002);
    //讓障礙物動起來
    Body.setPosition(moveBall, { x:px, y:scaleY(230)}, true)
    Body.setPosition(moveBall2, { x:px, y:scaleY(430)}, true)

  });
  Events.on(engine, 'afterUpdate', () => {
    // 檢查球是否掉出畫面
    if (circle.position.y > scaleY(810)) {
      circle.render.visible = false;
      setTimeout(() => {
        circle.render.visible = true;
        // 重置球的位置
        Body.setPosition(circle, {
          x: scaleX(700),
          y: scaleY(300)
        });
        //重置球的速度 不然會因為重力的關係一直加速
        Body.setVelocity(circle, {x:0, y:0});
      }, 500)
        
    }
  });



    //加入所有物體到世界
    Composite.add(engine.world, [...walls, circle,  ...obstacles, moveBall, moveBall2, boxA, boxB, boxC, boxD, boxE, ...arcPath1, ...arcPath2, spring, rock ]);
    //加入滑鼠控制到世界
    Composite.add(engine.world, mouseConstraint);
    //啟動渲染
    Render.run(render);
    render.mouse = mouse;
    //啟動Runner
    const runner = Runner.create();

    Runner.run(runner, engine);
   
    // 添加鍵盤事件監聽
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {  // 空白鍵
          spring.stiffness = 0.1;  // 按下時啟動彈力
          event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
          spring.stiffness = 0;  // 放開時關閉彈力
          event.preventDefault();
      }
    };

    // 添加觸控事件處理
    const handleTouchStart = (event) => {
      // 檢查觸控點是否在 BoxE 附近
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      const rect = render.canvas.getBoundingClientRect();
      const canvasX = touchX - rect.left;
      const canvasY = touchY - rect.top;
      
      // 計算觸控點與 BoxE 位置的距離
      const dx = canvasX - boxE.position.x;
      const dy = canvasY - boxE.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 如果觸控點在 BoxE 附近，啟動彈力
      if (distance < scaleX(50)) {  // 可以調整這個值來改變觸發範圍
        spring.stiffness = 0.1;
        event.preventDefault();
      }
    };

    const handleTouchEnd = () => {
      spring.stiffness = 0;
    };

     // 添加事件監聽器
     window.addEventListener('keydown', handleKeyDown);
     window.addEventListener('keyup', handleKeyUp);
     render.canvas.addEventListener('touchstart', handleTouchStart);
     render.canvas.addEventListener('touchend', handleTouchEnd);

    //碰撞偵測

    //清理函數 避免重複創建
    return () => {

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      render.canvas.removeEventListener('touchstart', handleTouchStart);
      render.canvas.removeEventListener('touchend', handleTouchEnd);
       
      //停止渲染
      Render.stop(render);
      render.canvas.remove();
      
      //清除世界
      World.clear(engine.world);
      //清除引擎
      Engine.clear(engine);
    }
  },[])
  


  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
      <div
        ref={sceneRef}
        style={{
          width:'90vw',
          height:'80vh',
          margin:'auto',
          marginTop:'10px',
          overflow:'auto'
        }} 
      />
      <h1>點擊紅色方塊發射</h1>
      <Nav/>
    </div>
  );
}

export default App;
