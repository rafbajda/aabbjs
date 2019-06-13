import Renderable	from "./Renderable.js";
import DynamicBuffer	from "../util/DynamicBuffer.js";
import gl, {VAO, ATTR_POSITION_LOC} from "../gl.js";

class BoundingBox extends Renderable{
	constructor(vmin,vmax,matName){
		super(null,matName);
		this.vMin = vmin; 
		this.vMax = vmax; 
		this.bounds = [vmin,vmax];
		this.boundFlat = [vmin[0],vmin[1],vmin[2],vmax[0],vmax[1],vmax[2]]; 
		this.drawMode = gl.ctx.LINES;

		//Build VAO and Buffers for rendering.
		var bufByteSize = Float32Array.BYTES_PER_ELEMENT * 4 * 8; //Cube only has 8 points
		this.vao = VAO.create();
		VAO.emptyFloatArrayBuffer(this.vao,"bVertices",bufByteSize,ATTR_POSITION_LOC,4,0,0,false)
			.emptyIndexBuffer(this.vao,"bIndex",48,false)
			.finalize(this.vao,"VisDebug");

		this.vertBuffer = DynamicBuffer.newFloat(this.vao.bVertices.ptr,4,8);
		this.indBuffer =  DynamicBuffer.newElement(this.vao.bIndex.ptr,48);

		this.genBox();
	}

	genBox(){
		var b = this.boundFlat, c = 4;

		for(var i=1; i < 5; i+=3){ 
			this.vertBuffer.data.push(	b[0],b[i],b[2],c,	//Floor Top Left Corner
										b[3],b[i],b[2],c,	//Floor Top Right
										b[3],b[i],b[5],c,	//Floor Bottom Right
										b[0],b[i],b[5],c);	//Floor Bottom left
		}

		//Build up the indexes to connect the dots.
		var ii,iu;
		for(var i=0; i < 4; i++){
			ii = (i+1)%4;
			iu = i+4;
			this.indBuffer.data.push(i,ii,  iu,ii+4,  i,iu); //Draw bottom, Top, Then Side
		}

		this.vertBuffer.pushToGPU();
		this.indBuffer.pushToGPU();

		//this.vao.count	= this.vertBuffer.getComponentCnt();
		this.vao.count	= this.indBuffer.getComponentCnt();
	}
}

export default BoundingBox;