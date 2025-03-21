import Sketch from 'react-p5';
import {  useRef, useState } from 'react';
import '../App.css';
import Nav from '../componet/nav';

function Scratch(){
  
  const bottomImgRef = useRef(null);  
  const topLayerRef = useRef(null);
  const imgWidthRef = useRef(null);
  const imgHeightRef = useRef(null);
  const imgXRef = useRef(null);
  const imgYRef = useRef(null);
  const totalPixelsRef = useRef(null);
  const isInteractingRef = useRef(false);

  
  const [erasedPercentage, setErasedPercentage] = useState(0);
  const [imageReady, setImageReady] = useState(false);
  
  const preload = (p5) => {
    bottomImgRef.current = p5.loadImage('/images/porsche.png');
  }

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight-100).parent(canvasParentRef);
    p5.background(0, 0, 0);

    // 設定圖片大小
    imgWidthRef.current = Math.min(400, p5.windowWidth - 50);
    imgHeightRef.current = imgWidthRef.current; // 保持正方形
    totalPixelsRef.current = imgWidthRef.current * imgHeightRef.current;

    // 設定圖片位置
    imgXRef.current = (p5.windowWidth - imgWidthRef.current) / 2;
    imgYRef.current = (p5.windowHeight - imgHeightRef.current) / 2;

    // 創建覆蓋的銀灰層
    topLayerRef.current = p5.createGraphics(imgWidthRef.current, imgHeightRef.current);
    topLayerRef.current.background(192, 192, 192);
    topLayerRef.current.fill(255); // 字的顏色
    topLayerRef.current.textSize(30); // 字的大小
    topLayerRef.current.textFont('Arial'); // 字體
    topLayerRef.current.textAlign(p5.CENTER, p5.CENTER); // 文字位置
    topLayerRef.current.text('刮刮樂ABC', imgWidthRef.current / 2, imgHeightRef.current / 2);

    // 繪製圖片及銀灰層
    if (bottomImgRef.current) {
      p5.image(bottomImgRef.current, imgXRef.current, imgYRef.current, imgWidthRef.current, imgHeightRef.current);
      p5.image(topLayerRef.current, imgXRef.current, imgYRef.current);
      setImageReady(true);
    }
  };

  //計算被擦除的面積
  const calculateErasedPixels = () => {
    if (!topLayerRef.current) return 0;
    //createGraphics()製造出來的圖已經包含loadPixels()所以不需要p5.前綴
    topLayerRef.current.loadPixels();
    const pixels = topLayerRef.current.pixels;
    
    let erasedCount = 0;
    const totalPixels = pixels.length / 4
    
    // 在 RGBA 模式下，每個像素有 4 個值 (R,G,B,A)
    // 只檢查 Alpha 通道 (每 4 個值的第 4 個)
    for (let i = 3; i < pixels.length; i += 4) {
      // 如果 Alpha 值小於 128，認為是透明的（已擦除）
      if (pixels[i] < 128) {
        erasedCount++;
      }
    }
    const percentage = Math.min(Math.floor((erasedCount / totalPixels) * 100), 100);
    return percentage;
  };

  const handleErase = (p5, x, y) => {
    isInteractingRef.current = true; // 確保在觸控開始時設置為 true
    if (!imageReady) return;

    const brushSize = 30; // 定義筆刷大小

    // 計算相對於覆蓋層的位置
    const relativeX = x - imgXRef.current;
    const relativeY = y - imgYRef.current;

    // 檢查相對位置是否在覆蓋層的範圍內
    if (relativeX >= 0 && relativeX < imgWidthRef.current && relativeY >= 0 && relativeY < imgHeightRef.current) {
      topLayerRef.current.erase();
      topLayerRef.current.ellipse(relativeX, relativeY, brushSize, brushSize);
      topLayerRef.current.noErase();
    }
    
    // 每 5 幀計算一次已刮除的百分比
    if (p5.frameCount % 5 === 0) {
      const erasedPixels = calculateErasedPixels();
      setErasedPercentage(erasedPixels);
    }
  }

  const draw = (p5) => {
    //每10幀計算一次刮除百分比
    if (p5.frameCount % 10 === 0) {
      const erasedPixels = calculateErasedPixels();
      setErasedPercentage(erasedPixels);
    }
    //滑鼠或觸控事件
    if (isInteractingRef.current) {
      handleErase(p5, p5.mouseX, p5.mouseY);
    }

    p5.background(0, 0, 0);
    p5.image(bottomImgRef.current, p5.windowWidth/2-(p5.windowWidth-50)/2, p5.windowHeight/2-(p5.windowWidth-50)/2, p5.windowWidth-50, p5.windowWidth-50);
    p5.image(topLayerRef.current, p5.windowWidth/2-(p5.windowWidth-50)/2, p5.windowHeight/2-(p5.windowWidth-50)/2, p5.windowWidth-50, p5.windowWidth-50);
    
    p5.fill(255);
    p5.textSize(24);
    p5.text(`已刮除: ${erasedPercentage}%`, 20, 40);
  }

  // 滑鼠事件處理
  const mousePressed = () => {
    isInteractingRef.current = true;
  };

  const mouseReleased = () => {
    isInteractingRef.current = false;
  };

  // 觸控事件處理
  const touchStarted = (p5) => {
    isInteractingRef.current = true;
    
    // 檢查是否有觸控點
    if (p5.touches.length === 0) return true;

    // 檢查觸控點是否在圖片範圍內
    const touch = p5.touches[0];
    const isInBounds = touch.x >= imgXRef.current && 
                      touch.x <= imgXRef.current + imgWidthRef.current &&
                      touch.y >= imgYRef.current && 
                      touch.y <= imgYRef.current + imgHeightRef.current;

    if (isInBounds) {
      // 處理所有觸控點
      for (let i = 0; i < p5.touches.length; i++) {
        handleErase(p5, p5.touches[i].x, p5.touches[i].y);
      }
      return false; // 只在圖片範圍內阻止默認行為
    }
    return true;
  };

  const touchMoved = (p5) => {
    if (!imageReady) return true;
    
    // 檢查是否有觸控點
    if (p5.touches.length === 0) return true;
    
    // 檢查觸控點是否在圖片範圍內
    const touch = p5.touches[0];
    const isInBounds = touch.x >= imgXRef.current && 
                      touch.x <= imgXRef.current + imgWidthRef.current &&
                      touch.y >= imgYRef.current && 
                      touch.y <= imgYRef.current + imgHeightRef.current;

    if (isInBounds) {
      // 處理所有觸控點
      for (let i = 0; i < p5.touches.length; i++) {
        handleErase(p5, p5.touches[i].x, p5.touches[i].y);
      }
      return false; // 只在圖片範圍內阻止默認行為
    }
    return true;
  };

  const touchEnded = () => {
    isInteractingRef.current = false;
    return true; // 允許其他觸控行為
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);

    // 重新計算圖片大小和位置
    imgWidthRef.current = Math.min(400, p5.windowWidth - 50);
    imgHeightRef.current = imgWidthRef.current; // 保持正方形
    imgXRef.current = (p5.windowWidth - imgWidthRef.current) / 2;
    imgYRef.current = (p5.windowHeight - imgHeightRef.current) / 2;

    p5.background(0, 0, 0);
    p5.image(bottomImgRef.current, imgXRef.current, imgYRef.current, imgWidthRef.current, imgHeightRef.current);
    p5.image(topLayerRef.current, imgXRef.current, imgYRef.current);
  };



  return(
    <div style={{ 
      touchAction: 'none',  // 禁止所有觸控行為
      overflow: 'hidden'    // 防止滾動
    }}>
      <Sketch 
        setup={setup}
        draw={draw} 
        preload={preload}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        touchStarted={touchStarted}
        touchMoved={touchMoved}
        touchEnded={touchEnded}
        windowResized={windowResized}
        style={{ touchAction: 'none' }}  // 在 canvas 上也禁止觸控行為
      />
      <Nav/>
    </div>
  )
}

export default Scratch;