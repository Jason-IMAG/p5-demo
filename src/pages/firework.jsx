import Sketch from 'react-p5';
import Matter from 'matter-js';
import { useEffect, useRef } from 'react';
import '../App.css';
import Nav from '../componet/nav';


function Firework(){
    
    const engineRef = useRef(null);
    const worldRef = useRef(null);
    const particlesRef = useRef([]);
		const fireBallRef = useRef(null);
		const explosionYRef = useRef(null);
		const isExplosionRef = useRef(false);
		const hueRef = useRef(0);
		

    useEffect(() => {
        const { Engine, World } = Matter;

        const engine = Engine.create();
        engineRef.current = engine;      //初始化 engineRef
        worldRef.current = engine.world; //初始化 worldeRef
        engine.gravity.y = 0.1;          //設定重力
        
        return () => {
            World.clear(worldRef.current);
            Engine.clear(engineRef.current);  
        };
    },[])


    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        p5.background(0);
				p5.colorMode(p5.HSB);
				p5.frameRate(60);
    }

    const draw = (p5) => {
			  //調整背景透明度可以做到殘影的效果
        p5.background(0,0,0,0.1);
				
        //更新物理引擎 **關鍵
        if(engineRef.current){
          Matter.Engine.update(engineRef.current);
        }

				p5.push();
				//畫出火球
				if(fireBallRef.current){
					const pos  = fireBallRef.current.position;
					const velocity = fireBallRef.current.velocity;
					hueRef.current = (hueRef.current + 1) % 255; //顏色變化
					p5.noStroke();
					p5.fill(hueRef.current, 80, 90);
					p5.circle(pos.x, pos.y, 10);

					if(Math.abs(velocity.y) < 0.2){
						//紀錄火球最高點
						explosionYRef.current = pos.y;
						//移除火球
						Matter.World.remove(worldRef.current, fireBallRef.current);
						fireBallRef.current = null;
						//煙火爆炸 產生火花
						createFirework(p5, p5.windowWidth/2, explosionYRef.current);
						isExplosionRef.current = true;
					}
				}
				if(isExplosionRef.current){
					particlesRef.current.forEach((particle, index) => {
						const pos = particle.position;
						p5.noStroke();
						p5.fill(hueRef.current, 80, 90);
						p5.circle(pos.x, pos.y, particle.size);
						particle.size -= 0.08;
						if(particle.size <= 0.1){
							Matter.World.remove(worldRef.current, particle);
							particlesRef.current.splice(index, 1);
						}
						//煙火結束
						if(particlesRef.current.length === 0){
							isExplosionRef.current = false;
							hueRef.current = 0;
						}
				});
				}
				p5.pop();
        //煙火發射器
				p5.push();
				p5.fill(255);
				p5.rect(p5.windowWidth/2 - 20, p5.windowHeight -70 , 40, 70);
				p5.pop();
		};

		const mousePressed = (p5) => {
			
			const clickableArea = {
				x: p5.windowWidth/2 - 20,
				y: p5.windowHeight - 70,
				width: 40,
				height: 70
			};

			if (
				p5.mouseX >= clickableArea.x && 
				p5.mouseX <= clickableArea.x + clickableArea.width &&
				p5.mouseY >= clickableArea.y && 
				p5.mouseY <= clickableArea.y + clickableArea.height
			) {
				createFireBall(p5, p5.windowWidth/2 , p5.windowHeight -70);
				hueRef.current = p5.random(0,255);
				
			}
		};

		const createFireBall = (p5, x, y) => {
			const speed = -25;
			
			const fireBall = Matter.Bodies.circle(x, y ,10 , {
				frictionAir: 0.04,
				density: 0.01,
				render: {
					fillStyle: '#ff0000'
				}
			})
			//設定火球向上的速度
			Matter.Body.setVelocity(fireBall, { x: 0, y: speed });
			fireBallRef.current = fireBall;
			Matter.World.add(worldRef.current, fireBall);
			
		}

		const createFirework = (p5, x, y) => {
			const particleCount = 150;
			
			
			for (let i = 0; i < particleCount; i++){
				const angle = (Math.PI * 2 / particleCount) * i;
				const baseSpeed = p5.random(0,2);
				// 使用橢圓方程式來計算速度
				const a = 2.0;  // x 軸半徑（水平擴散）
				const b = 1;  // y 軸半徑（垂直擴散）
				// 計算橢圓上的點
				const speedX = Math.cos(angle) * baseSpeed * a;
				const speedY = Math.sin(angle) * baseSpeed * b;
				// 添加一些隨機性
				const randomness = 0.2;  // 隨機因子
				const finalSpeedX = speedX * (1 + p5.random(-randomness, randomness));
				const finalSpeedY = speedY * (1 + p5.random(-randomness, randomness));
			

				//創建 Matter.js 物體
				const particle = Matter.Bodies.circle(x, y ,2, {
					friction: 0,
					restitution: 0.4,
					frictionAir:0.02
				});
				//設定速度
				Matter.Body.setVelocity(particle, {
					 x: finalSpeedX, 
					 y: finalSpeedY 
					});
				particle.size = p5.random(10,20);
				particle.opacity = 255;

				Matter.World.add(worldRef.current, particle);
				particlesRef.current.push(particle);
			 }

		}

		const windowResized = (p5) => {
			// 當視窗大小改變時，重新設置畫布大小
			p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
			p5.background(0);
		};

    

    return(
			<div className="App">
        <Sketch 
				  setup={setup} 
					draw={draw} 
					mousePressed={mousePressed}
					windowResized={windowResized}
					/>
				<Nav/>
			</div>
    )
}

export default Firework;