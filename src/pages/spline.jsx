import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';


function Spline({ onDataFromSpline }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);
  const scoreRef = useRef(0);
  const healthRef = useRef(0);


  useEffect(() => {
    let intervalId = null;
    if (canvasRef.current) {
      appRef.current = new Application(canvasRef.current);
      appRef.current.load('https://prod.spline.design/6OvR6zxq7fIeLkeZ/scene.splinecode')
      .then(()=> {
        const score =appRef.current.getVariable('playerHealth');
        

       intervalId = setInterval(() => {
          const scoreChanged = appRef.current.getVariable('score');
          const healthChanged = appRef.current.getVariable('playerHealth');
          scoreRef.current = scoreChanged;
          healthRef.current = healthChanged;
          console.log(healthChanged);
          onDataFromSpline({score: scoreChanged, health: healthChanged});
        },500);

        appRef.current.addEventListener('VariableChange', (e)=> {
          console.log('變數變化事件觸發:', e);
          const { name, value } = e;
          
          // 將變數值傳遞給 React
          if (name === 'score') {
            console.log(value);
            onDataFromSpline({ score: value });
          } else if (name === 'playerHealth') {
            onDataFromSpline({ health: value });
          }
        });
      });
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (appRef.current) {
        // 使用官方提供的 removeEventListener 方法清理事件監聽器
        if (typeof appRef.current.removeEventListener === 'function') {
          appRef.current.removeEventListener('variablechange');
        }
        
        // 如果有 dispose 方法也一併調用
        if (typeof appRef.current.dispose === 'function') {
          appRef.current.dispose();
        }
        
        // 清空引用
        appRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <canvas id="canvas3d" ref={canvasRef} />
    </>
  );
}

export default Spline;

