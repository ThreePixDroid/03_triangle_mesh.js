import { Layer } from './layer.js'
import { Loop } from './loop.js'
import { Mesh } from './mesh.js'

class App {
  constructor(container) {
    this.layer = new Layer(container);

    addEventListener(`resize`, () => this.createMesh());
    this.createMesh();

    this.loop = new Loop(time => this.update(time), () => this.display());
  }
  createMesh() {
    this.mesh = new Mesh(this.layer);
  }
  update(correction = 0) {
    this.mesh.updateParticles(correction);
    this.mesh.updateTriangles(correction);
  }
  display() {
    this.layer.context.clearRect(0, 0, this.layer.w, this.layer.h)
    // this.mesh.renderTriangles(this.layer.context);
    this.mesh.renderCells4(this.layer.context);
    // this.mesh.renderParticles(this.layer.context);
  }
}

onload = () => { new App(document.body) }