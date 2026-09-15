// Canvas rasterizer for devices where WebGL is disabled. Uses the same Three.js
// scene, cameras, solid meshes and deformed page geometry, not a flat-image swap.
export class SoftwareRenderer {
 constructor(THREE,canvas){this.T=THREE;this.canvas=canvas;this.ctx=canvas.getContext('2d',{alpha:true});if(!this.ctx)throw new Error('Canvas unavailable');this.ratio=1;this.capabilities={getMaxAnisotropy:()=>1};this.shadowMap={};this.software=true;this.viewport={x:0,y:0,w:1,h:1};this.light=new THREE.Vector3(-.3,.5,1).normalize();}
 setClearColor(){} setPixelRatio(r){this.ratio=Math.min(r,1.5)}
 setSize(w,h){this.w=w;this.h=h;this.canvas.width=Math.round(w*this.ratio);this.canvas.height=Math.round(h*this.ratio)}
 setScissorTest(){} setScissor(){}
 clear(){this.ctx.setTransform(1,0,0,1,0,0);this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}
 setViewport(x,y,w,h){this.viewport={x,y:this.h-y-h,w,h}}
 render(scene,camera){const T=this.T,ctx=this.ctx,v=this.viewport;scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const vp=new T.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);const triangles=[];
 scene.traverseVisible(mesh=>{if(!mesh.isMesh||mesh.material?.isShadowMaterial)return;const pos=mesh.geometry.attributes.position,uv=mesh.geometry.attributes.uv,index=mesh.geometry.index,normal=mesh.geometry.attributes.normal;const mvp=new T.Matrix4().multiplyMatrices(vp,mesh.matrixWorld);const normalMatrix=new T.Matrix3().getNormalMatrix(mesh.matrixWorld);const verts=[];
 for(let i=0;i<pos.count;i++){const p=new T.Vector3().fromBufferAttribute(pos,i).applyMatrix4(mvp);verts.push({x:v.x+(p.x+1)*v.w/2,y:v.y+(1-p.y)*v.h/2,z:p.z,u:uv?.getX(i)||0,v:1-(uv?.getY(i)||0),normal:normal?new T.Vector3().fromBufferAttribute(normal,i).applyMatrix3(normalMatrix).normalize():new T.Vector3(0,0,1)})}
 const count=index?index.count:pos.count;
 for(let i=0;i<count;i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j),p=ids.map(n=>verts[n]);if(p.some(a=>a.z>1||a.z< -1))continue;let mat=mesh.material;if(Array.isArray(mat)){const group=mesh.geometry.groups.find(g=>i>=g.start&&i<g.start+g.count);mat=mat[group?.materialIndex||0]}if(!mat||!mat.visible)continue;const cross=(p[1].x-p[0].x)*(p[2].y-p[0].y)-(p[1].y-p[0].y)*(p[2].x-p[0].x);if(Math.abs(cross)<.0001)continue;if(mat.side===T.FrontSide&&cross>=0||mat.side===T.BackSide&&cross<0)continue;const n=p[0].normal.clone().add(p[1].normal).add(p[2].normal).normalize();if(cross>0)n.negate();const brightness=.76+.24*Math.max(0,n.dot(this.light));triangles.push({p,mat,z:(p[0].z+p[1].z+p[2].z)/3,brightness})}
 });
 triangles.sort((a,b)=>b.z-a.z);ctx.save();ctx.setTransform(this.ratio,0,0,this.ratio,0,0);ctx.beginPath();ctx.rect(v.x,v.y,v.w,v.h);ctx.clip();
 // Soft environmental shadow follows the projected object, not the page content.
 const shade=ctx.createRadialGradient(v.x+v.w*.52,v.y+v.h*.65,0,v.x+v.w*.52,v.y+v.h*.65,v.w*.46);shade.addColorStop(0,'#00000025');shade.addColorStop(1,'#00000000');ctx.fillStyle=shade;ctx.fillRect(v.x,v.y,v.w,v.h);
 for(const tri of triangles){const {p,mat,brightness}=tri;ctx.save();ctx.globalAlpha=mat.opacity??1;ctx.beginPath();const cx=(p[0].x+p[1].x+p[2].x)/3,cy=(p[0].y+p[1].y+p[2].y)/3;const expand=a=>{const d=Math.hypot(a.x-cx,a.y-cy)||1;return{x:a.x+(a.x-cx)/d*.35,y:a.y+(a.y-cy)/d*.35}};const edge=p.map(expand);ctx.moveTo(edge[0].x,edge[0].y);ctx.lineTo(edge[1].x,edge[1].y);ctx.lineTo(edge[2].x,edge[2].y);ctx.closePath();const im=mat.map?.image;
 if(im){ctx.clip();const [a,b,c]=p;const x0=a.u*im.width,y0=a.v*im.height,x1=b.u*im.width,y1=b.v*im.height,x2=c.u*im.width,y2=c.v*im.height;const den=x0*(y1-y2)+x1*(y2-y0)+x2*(y0-y1);if(Math.abs(den)>.0001){const A=(a.x*(y1-y2)+b.x*(y2-y0)+c.x*(y0-y1))/den,B=(a.y*(y1-y2)+b.y*(y2-y0)+c.y*(y0-y1))/den,C=(a.x*(x2-x1)+b.x*(x0-x2)+c.x*(x1-x0))/den,D=(a.y*(x2-x1)+b.y*(x0-x2)+c.y*(x1-x0))/den,E=(a.x*(x1*y2-x2*y1)+b.x*(x2*y0-x0*y2)+c.x*(x0*y1-x1*y0))/den,F=(a.y*(x1*y2-x2*y1)+b.y*(x2*y0-x0*y2)+c.y*(x0*y1-x1*y0))/den;ctx.transform(A,B,C,D,E,F);ctx.drawImage(im,0,0);ctx.fillStyle=`rgba(0,0,0,${1-brightness})`;ctx.fillRect(0,0,im.width,im.height)}}else{const color=mat.color.clone().convertLinearToSRGB();ctx.fillStyle=`rgb(${Math.round(color.r*255*brightness)},${Math.round(color.g*255*brightness)},${Math.round(color.b*255*brightness)})`;ctx.fill()}
 ctx.restore();}ctx.restore();}
}
