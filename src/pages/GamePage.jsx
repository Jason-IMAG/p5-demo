import Nav from '../componet/nav';
import { useState } from 'react';
import Spline from './spline'; 
function GamePage() {
  // 用於存儲從 Spline 接收的數據
  const [gameData, setGameData] = useState({ 
    score: 0,
    health: 100
  });
  
  // 這就是 onDataFromSpline 函數的定義
  const handleDataFromSpline = (data) => {
    // 更新遊戲數據
    setGameData(prevData => ({
      ...prevData,
      ...data
    }));
    
   
    
    // 可以在這裡添加其他邏輯，例如：
    if (data.health && data.health <= 0) {
      // 玩家生命值歸零，遊戲結束邏輯
      handleGameOver();
    }
  };
  
  const handleGameOver = () => {
    // 遊戲結束邏輯
    console.log('遊戲結束');
    // 顯示遊戲結束畫面等
  };
  
  return (
    <div className="game-container">
      <div className="game-ui">
        <div className="score-display">分數: {gameData.score}</div>
        <div className="health-bar">生命值: {gameData.health}</div>
      </div>
      
      {/* 將 handleDataFromSpline 作為 onDataFromSpline prop 傳遞給 SplineScene */}
      <Spline onDataFromSpline={handleDataFromSpline} />
      <Nav/>
    </div>
  );
}

export default GamePage;