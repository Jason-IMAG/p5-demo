import React, {useRef, useEffect, useState} from "react";
import Nav from '../componet/nav';
import './image.css';

function ImageCanvas(){
  const canvasRef = useRef(null);
  const canvas2Ref = useRef(null);
  const canvasOverRef = useRef(null);
  const [ image, setImage ] = useState(null);
  const [ image2, setImage2 ] = useState(null);
  const [ rotate, setRotate ] = useState(0);
  const [ isOverlaid, setIsOverlaid ] = useState(false);
  const [ isLoading, setIsloading ] = useState(true);
  
  //載入底圖
  useEffect(() => {
    const img = new Image();
    img.src = '/images/porsche.png';
    img.onload = () => {
      setImage(img);
      setIsloading(false);
    };
    img.onerror = () => {
      console.error('圖片載入失敗');
      setIsloading(false);
    }
  },[]);

  //載入上層圖
  useEffect(() => {
    const img = new Image();
    img.src = '/images/porscheLogo.png';
    img.onload = () => {
      setImage2(img);
      setIsloading(false);
    };
    img.onerror = () => {
      console.error('圖片載入失敗');
      setIsloading(false);
    }
  },[]);

  //底圖
  useEffect(() => {
    if(!image) return;
    if(isOverlaid === true) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    ctx.drawImage(image, 0, 0, 300, 300);

  },[image, isOverlaid]);

  //上層圖
  useEffect(() => {
    if(!image2) return;
    if(isOverlaid  === true) return;

    const canvas = canvas2Ref.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 300;
    canvas.height = 300;

    const imgWidth = 300;
    const imgHeight = 50;
    const x = (canvas.width - imgWidth) /2;
    const y = (canvas.height - imgHeight) /2;
    
    //清除畫布
    ctx.clearRect(0, 0, 300, 300);
    //保存當前狀態
    ctx.save();
    //移動到畫布的中心點
    ctx.translate(x + imgWidth/2, y + imgHeight/2  );
    //旋轉圖片
    ctx.rotate(rotate);

    ctx.drawImage(image2, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);

    ctx.restore();

  },[image2, rotate, isOverlaid]);

  //疊加後的圖片
  useEffect(() => {
    if(!image || !image2) return;
    console.log(isOverlaid);
    if(isOverlaid === false) return;

    
    const canvas = canvasOverRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    
    const imgWidth = 300;
    const imgHeight = 50;
    const x = (canvas.width - imgWidth) /2;
    const y = (canvas.height - imgHeight) /2;

    //清除畫布
    ctx.clearRect(0, 0, 300, 300);

    ctx.drawImage(image, 0, 0, 300, 300);
    //保存當前狀態
    ctx.save();
    //移動到畫布的中心點
    ctx.translate(x + imgWidth/2, y + imgHeight/2 );
    //旋轉圖片
    ctx.rotate(rotate);
    ctx.drawImage(image2, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
    ctx.restore();
  
  },[isOverlaid, rotate])

  //匯出圖片
  const exportImage = () => {
    console.log('匯出');
    const canvas = canvasOverRef.current;
    if(!canvas){
      console.error('canvas不存在');
      return;
    }
    try{
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = 'overlaid-image.png';
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('圖片已下載');
    }catch(error){
      console.error('圖片下載失敗', error);
    }
  }

  return(
    <div>
      <div className="canvas-container">
        {!isOverlaid ? (
          <>
          <canvas ref={canvasRef}/>
          <canvas ref={canvas2Ref}/>
          </>
        ) : (
          <>
          <canvas ref={canvasOverRef}/>
          </>
        ) }
      </div>
      <div className = 'button-container'>
        <button onClick={() => setRotate(rotate + Math.PI/4)}>
          旋轉右1圖片
        </button>
        <button onClick={() => setIsOverlaid(!isOverlaid)}>
          {isOverlaid ? '取消疊加': '疊加'}
        </button>
        {isOverlaid ?(
          <button onClick={exportImage}>
            匯出圖片
          </button>
        ) : (
          <>
          </>
        )}
      </div>
      <Nav/>
    </div>
  )
}

export default ImageCanvas;