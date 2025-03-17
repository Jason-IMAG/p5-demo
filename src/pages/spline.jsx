import React, { useEffect, useRef } from 'react';
import { Application } from '@splinetool/runtime';


function Spline({ onDataFromSpline }) {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      appRef.current = new Application(canvasRef.current);
      appRef.current.load('https://prod.spline.design/fmDQw3Rif0hB5ZoM/scene.splinecode')
      .then( ()=> {
        appRef.current.addEventListener('variableChanged', (event)=> {
          const { name, value } = event;
          
          // 將變數值傳遞給 React
          if (name === 'score') {
            onDataFromSpline({ score: value });
          } else if (name === 'playerHealth') {
            onDataFromSpline({ health: value });
          }
        });
      });
    }
    
    return () => {
      if (appRef.current) {
        // 使用官方提供的 removeEventListener 方法清理事件監聽器
        if (typeof appRef.current.removeEventListener === 'function') {
          appRef.current.removeEventListener();
        }
        
        // 如果有 dispose 方法也一併調用
        if (typeof appRef.current.dispose === 'function') {
          appRef.current.dispose();
        }
        
        // 清空引用
        appRef.current = null;
      }
    };
  }, [onDataFromSpline]);

  return (
    <>
      <canvas id="canvas3d" ref={canvasRef} />
    </>
  );
}

export default Spline;

