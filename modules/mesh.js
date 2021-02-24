export class Mesh {
  constructor( {w, h} ) {
    this.maxDist = Math.hypot(w, h);
    
    this.stepX = this.maxDist * .1;
    this.stepY = this.stepX * Math.sqrt(3) / 2;

    this.extraPoints = 3;
    this.cols = (w / this.stepX | 0) + this.extraPoints;
    this.rows = (h / this.stepY | 0) + this.extraPoints;

    this.extraOffsetX = this.stepX / 4;
    this.offsetX = (w - (this.cols - 1) * this.stepX) / 2;
    this.offsetY = (h - (this.rows - 1) * this.stepY) / 2;

    this.colorTimer = 0;
    this.colorSpeed = 30;
    this.colorPalet = 160;

    this.createParticles();
    this.createTriangles();
  }
  createParticles() {
    this.particles = [];
    for (let i = 0 ; i < this.rows ; i++) {
      for (let j = 0 ; j < this.cols ; j++) {
        const shiftX = i & 1 ? -this.extraOffsetX : this.extraOffsetX;

        const x = j * this.stepX + this.offsetX + shiftX;
        const y = i * this.stepY + this.offsetY;
        const homeX = x;
        const homeY = y;

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * this.extraOffsetX / 2 + this.extraOffsetX;
        const velocity = Math.random() * 2 - 1;

        this.particles.push({x, y, homeX, homeY, angle, radius, velocity});
      }
    }
  }
  createTriangles() {
    this.triangles = [];
    for (let y = 0 ; y < this.rows - 1 ; y++) {
      const vertices = [];
      for (let x = 0 ; x < this.cols ; x++) {
        let a = x + this.cols * (y + 1);
        let b = x + this.cols * y;

        if (y & 1) { [a, b] = [b, a] }

        vertices.push(this.particles[a], this.particles[b]);
      }
      for (let i = 0 ; i < vertices.length - 2 ; i++) {
        const a = vertices[i];
        const b = vertices[i + 1];
        const c = vertices[i + 2];

        this.triangles.push( {a, b ,c} );
      }
    }
  }
  updateParticles(correction = 0) {
    this.particles.forEach(p => {
      p.angle += p.velocity * correction;

      p.x = Math.cos(p.angle) * p.radius + p.homeX;
      p.y = Math.sin(p.angle) * p.radius + p.homeY;
    });
  }
  updateTriangles(correction = 0) {
    this.colorTimer = (this.colorTimer + this.colorSpeed * correction) % 360;
  }
  renderParticles(ctx) {
    ctx.fillStyle = `red`;
    const radius = 5;
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  renderTriangles(ctx) {
      this.triangles.forEach((t, i) => {
        
        if (i%8 !== 0 ) return
        const {a, b, c} = t;

        const posX = (a.x + b.x + c.x) / 3;
        const posY = (a.y + b.y + c.y) / 3;
        const dist = Math.hypot(posX, posY);
        
        const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
        ctx.fillStyle = `hsl(${hue}, 85%, 50%)`;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.lineTo(c.x, c.y);
        ctx.closePath();

        ctx.stroke();
        if (i%Math.random()*100 | 0 !== 0) return
        ctx.fill();
      });
  }
  renderCurves(ctx) {
    this.triangles.forEach((t, i) => {
        
      // if (i%8 !== 0 ) return
      const {a, b, c} = t;

      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      
      const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillStyle = `hsl(${hue}, 85%, 50%)`;

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(posX, posY, b.x, b.y);
      ctx.quadraticCurveTo(posX, posY, c.x, c.y);
      ctx.quadraticCurveTo(posX, posY, a.x, a.y);
      // ctx.stroke();
      // ctx.fill();

      ctx.stroke();
      // if (i%Math.random()*100 | 0 !== 0) return
      ctx.fill();
    });
  }
  renderDistortion(ctx) {
    this.triangles.forEach((t, i) => {
        
      // if (i%8 !== 0 ) return
      const {a, b, c} = t;

      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      
      const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillStyle = `hsl(${hue}, 85%, 50%)`;

      const AB = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
      const BC = {x: (b.x + c.x) / 2, y: (b.y + c.y) / 2}
      const CA = {x: (c.x + a.x) / 2, y: (c.y + a.y) / 2}

      let dA = Math.hypot(AB.x - posX, AB.y - posY)
      let dB = Math.hypot(BC.x - posX, BC.y - posY)
      let dC = Math.hypot(CA.x - posX, CA.y - posY)
      let r = Math.min(dA, dB, dC) / 4
      
      ctx.beginPath();
      ctx.arc(AB.x, AB.y, r, 0, Math.PI * 2);
      // ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(BC.x, BC.y, r, 0, Math.PI * 2);
      // ctx.stroke();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(CA.x, CA.y, r, 0, Math.PI * 2);
      // ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.closePath();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(AB.x, AB.y);
      ctx.lineTo(BC.x, BC.y);
      ctx.lineTo(CA.x, CA.y);
      ctx.closePath();

      ctx.stroke();
      // if (i%Math.random()*100 | 0 !== 0) return
      // ctx.fill();
    });
  }
  renderCells(ctx) {
    this.triangles.forEach((t, i) => {
        
      // if (i%8 !== 0 ) return
      const {a, b, c} = t;

      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      
      const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillStyle = `hsl(${hue}, 85%, 50%)`;

      const AB = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
      const BC = {x: (b.x + c.x) / 2, y: (b.y + c.y) / 2}
      const CA = {x: (c.x + a.x) / 2, y: (c.y + a.y) / 2}

      let dA = Math.hypot(AB.x - posX, AB.y - posY)
      let dB = Math.hypot(BC.x - posX, BC.y - posY)
      let dC = Math.hypot(CA.x - posX, CA.y - posY)
      let r = Math.min(dA, dB, dC) / 4
      
      ctx.beginPath();
      ctx.arc(posX, posY, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.closePath();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(AB.x, AB.y);
      ctx.lineTo(BC.x, BC.y);
      ctx.lineTo(CA.x, CA.y);
      ctx.closePath();

      ctx.stroke();
      // if (i%Math.random()*100 | 0 !== 0) return
      // ctx.fill();
    });
  }
  renderCells2(ctx) {
    this.triangles.forEach((t, i) => {
        
      // if (i%8 !== 0 ) return
      const {a, b, c} = t;

      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      
      const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillStyle = `hsla(${hue}, 85%, 50%, .3)`;

      const AB = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
      const BC = {x: (b.x + c.x) / 2, y: (b.y + c.y) / 2}
      const CA = {x: (c.x + a.x) / 2, y: (c.y + a.y) / 2}

      let dA = Math.hypot(AB.x - posX, AB.y - posY)
      let dB = Math.hypot(BC.x - posX, BC.y - posY)
      let dC = Math.hypot(CA.x - posX, CA.y - posY)
      let r = Math.min(dA, dB, dC) / 3
      

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(c.x, c.y);
      ctx.closePath();
      ctx.stroke();

      // ctx.stroke();
      // if (i%Math.random()*100 | 0 !== 0) return
      ctx.fill();
      
      ctx.fillStyle = `hsla(${hue + 90}, 100%, 50%, 1)`;
      ctx.beginPath();
      ctx.arc(posX, posY, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  renderCells3(ctx) {
    this.triangles.forEach((t, i) => {
        
      // if (i%8 !== 0 ) return
      const {a, b, c} = t;

      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      
      const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillStyle = `hsla(${hue}, 85%, 50%, .3)`;

      const AB = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
      const BC = {x: (b.x + c.x) / 2, y: (b.y + c.y) / 2}
      const CA = {x: (c.x + a.x) / 2, y: (c.y + a.y) / 2}

      let dA = Math.hypot(AB.x - posX, AB.y - posY)
      let dB = Math.hypot(BC.x - posX, BC.y - posY)
      let dC = Math.hypot(CA.x - posX, CA.y - posY)
      let r = Math.min(dA, dB, dC) / 3
      

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(posX, posY, b.x, b.y);
      ctx.quadraticCurveTo(posX, posY, c.x, c.y);
      ctx.quadraticCurveTo(posX, posY, a.x, a.y);
      ctx.stroke();

      


      // ctx.stroke();
      // if (i%Math.random()*100 | 0 !== 0) return
      ctx.fill();
      
      ctx.fillStyle = `hsla(${hue + 180}, 100%, 50%, 1)`;
      ctx.beginPath();
      ctx.arc(posX, posY, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  renderCells4(ctx) {
    this.triangles.forEach((t, i) => {
        
      // if (i%8 !== 0 ) return
      const {a, b, c} = t;

      const posX = (a.x + b.x + c.x) / 3;
      const posY = (a.y + b.y + c.y) / 3;
      const dist = Math.hypot(posX, posY);
      
      const hue = dist / this.maxDist * this.colorPalet - this.colorTimer;

      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`
      ctx.fillStyle = `hsla(${hue}, 85%, 50%, .3)`;

      const AB = {x: (a.x + b.x) / 2, y: (a.y + b.y) / 2}
      const BC = {x: (b.x + c.x) / 2, y: (b.y + c.y) / 2}
      const CA = {x: (c.x + a.x) / 2, y: (c.y + a.y) / 2}

      let dA = Math.hypot(AB.x - posX, AB.y - posY)
      let dB = Math.hypot(BC.x - posX, BC.y - posY)
      let dC = Math.hypot(CA.x - posX, CA.y - posY)
      let r = Math.min(dA, dB, dC) / 3

      ctx.beginPath();
      ctx.moveTo(AB.x, AB.y);
      ctx.lineTo(BC.x, BC.y);
      ctx.lineTo(CA.x, CA.y);
      ctx.closePath();
      ctx.stroke();
      
      ctx.strokeStyle = `hsla(${hue + 180}, 100%, 50%, 1)`;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(posX, posY, b.x, b.y);
      ctx.quadraticCurveTo(posX, posY, c.x, c.y);
      ctx.quadraticCurveTo(posX, posY, a.x, a.y);
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = `hsla(${hue + 180}, 100%, 50%, 1)`;
      ctx.beginPath();
      ctx.arc(AB.x, AB.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(BC.x, BC.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(CA.x, CA.y, 6, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(posX, posY, r, 0, Math.PI * 2);

      ctx.fill();
    });
  }
}