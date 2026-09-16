import assert from 'node:assert/strict';
import * as T from './three.module.min.js';
import {SoftwareRenderer} from './raster-renderer.js';
let output;
const context={clearRect(){},createImageData(w,h){return{width:w,height:h,data:new Uint8ClampedArray(w*h*4)}},putImageData(image){output=image}};
const canvas={getContext(){return context}};
const renderer=new SoftwareRenderer(T,canvas);renderer.setSize(100,100);renderer.setViewport(0,0,100,100);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(35,1,.1,50);camera.position.z=6;
scene.add(new T.Mesh(new T.BoxGeometry(2,2,.2),new T.MeshStandardMaterial({color:'#0000ff'})));
const face=new T.Mesh(new T.PlaneGeometry(2,2,48,6),new T.MeshStandardMaterial({color:'#ff0000'}));face.position.z=.12;scene.add(face);
renderer.render(scene,camera);
for(let y=30;y<70;y++)for(let x=30;x<70;x++){const at=(y*100+x)*4;assert.equal(output.data[at+3],255,'Unexpected raster gap');assert.ok(output.data[at]>output.data[at+2],'Cover occluded by book block')}
console.log('Depth-buffered cover occlusion and 1600 interior pixels: PASS');
