import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { useNavigate } from 'react-router-dom';

function Flocking() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let flock;
    
    const sketch = (p) => {
      class Flock {
        constructor() {
          this.boids = [];
        }

        run() {
          for (let boid of this.boids) {
            boid.run(this.boids);
          }
        }

        addBoid(b) {
          this.boids.push(b);
        }
      }

      class Boid {
        constructor(x, y) {
          this.acceleration = p.createVector(0, 0);
          this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
          this.position = p.createVector(x, y);
          this.size = 3.0;
          this.maxSpeed = 3;
          this.maxForce = 0.05;
          p.colorMode(p.HSB);
          this.color = p.color(p.random(256), 255, 255);
        }

        // ... 其他 Boid 類別方法保持不變，只需將 p5 函數改為 p.函數
        run(boids) {
          this.flock(boids);
          this.update();
          this.borders();
          this.render();
        }

        render() {
          let theta = this.velocity.heading() + p.radians(90);
          p.fill(this.color);
          p.stroke(255);
          p.push();
          p.translate(this.position.x, this.position.y);
          p.rotate(theta);
          p.beginShape();
          p.vertex(0, -this.size * 2);
          p.vertex(-this.size, this.size * 2);
          p.vertex(this.size, this.size * 2);
          p.endShape(p.CLOSE);
          p.pop();
        }

        // ... 其他方法類似轉換
      }

      p.setup = () => {
        p.createCanvas(640, 360);
        flock = new Flock();

        // 初始化群集
        for (let i = 0; i < 100; i++) {
          let b = new Boid(p.width / 2, p.height / 2);
          flock.addBoid(b);
        }
      };

      p.draw = () => {
        p.background(0);
        flock.run();
      };

      p.mouseDragged = () => {
        flock.addBoid(new Boid(p.mouseX, p.mouseY));
      };
    };

    // 創建新的 p5 實例
    const p5Instance = new p5(sketch, canvasRef.current);

    // 清理函數
    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div>
      <div ref={canvasRef}></div>
      <p>拖動滑鼠來產生新的群集個體</p>
      <button onClick={() => navigate('/')}>
         返回首頁
      </button>
    </div>
  );
}

export default Flocking;