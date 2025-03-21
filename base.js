var drawing=false
var isTouch=false
const X=270
const Y=270
const SCALE_MULTIPLIER=13.5
var COLOR="rgb(109, 170, 44, 50%)"


function draw_pattern() {
	const canvas = document.getElementById("pattern");
	const board_canvas = document.getElementById("board");
	const board_ctx = board_canvas.getContext("2d");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");
		const bounding = canvas.getBoundingClientRect();
		function draw(event) {
			display_in_infobox("infobox-bounding"," left:"+bounding.left+" top:"+bounding.top)
			display_in_infobox("event-coords"," eventX:"+event.clientX+" eventY:"+event.clientY)
			if (drawing){
				//Last subtraction is just to compensate for intuitive drawing - we want the drawn pixel to be in the m i d d l e of the pen tip
				var x = (event.clientX - bounding.left - SCALE_MULTIPLIER/2)%X
				//Last subtraction is just to compensate for intuitive drawing - we want the drawn pixel to be in the m i d d l e of the pen tip
				var y = (event.clientY - bounding.top - SCALE_MULTIPLIER/2)%Y
				display_in_infobox("final-coords"," x:"+x+" y:"+y)
				var scaled_x=Math.round(x/SCALE_MULTIPLIER)
				var scaled_y=Math.round(y/SCALE_MULTIPLIER)
				display_in_infobox("scaled-coords"," x scaled:" + scaled_x + "; y scaled:"+scaled_y);

				ctx.fillStyle = COLOR;
				ctx.fillRect(scaled_x, scaled_y, 1, 1);
				const pattern = board_ctx.createPattern(canvas, "repeat");
				//clearing only necessary when doing translucent stuff though
				board_ctx.clearRect(0, 0, board_canvas.width, board_canvas.height);
				board_ctx.fillStyle = pattern;
				board_ctx.fillRect(0, 0, 270, 270);

			}
		}
		canvas.addEventListener("mousedown", (event) => drawing=true);
		canvas.addEventListener("mouseup", (event) => drawing=false);
		canvas.addEventListener("mousemove", (event) => draw(event));
		// Set up touch events for mobile, etc
		canvas.addEventListener("touchstart", function (e) {
			if (e.target == canvas) {
				isTouch=true
				e.preventDefault();
			}
			mousePos = getTouchPos(canvas, e);
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent(
				"mousedown", 
				{clientX: mousePos.x,clientY: mousePos.y}
				);
			canvas.dispatchEvent(mouseEvent);
		}, false);

		canvas.addEventListener("touchend", function (e) {
			isTouch=true;
			if (e.target == canvas) {
				e.preventDefault();
			}

			var mouseEvent = new MouseEvent("mouseup", {});
			canvas.dispatchEvent(mouseEvent);
		}, false);

		canvas.addEventListener("touchmove", function (e) {
			isTouch=true;
			if (e.target == canvas) {
				e.preventDefault();
			}
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousemove", {
				clientX: touch.clientX,
				clientY: touch.clientY
			});
			canvas.dispatchEvent(mouseEvent);
		}, false);

		

		// Get the position of a touch relative to the canvas. I am doing this twice for touch and it works perfect. wtf.
		function getTouchPos(canvasDom, touchEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top
			};
		}
	}
	
}

//retro palette from https://pixeljoint.com/forum/forum_posts.asp?TID=12795
const palette = [
	[20, 12, 28],
	[68, 36, 52],
	[48, 52, 109],
	[78, 74, 78],
	[133, 76, 48],
	[52, 101, 36],
	[208, 70, 72],
	[117, 113, 97],
	[89, 125, 206],
	[210, 125, 44],
	[133, 149, 161],
	[109, 170, 44],
	[210, 170, 153],
	[109, 194, 202],
	[218, 212, 94],
	[222, 238, 214]
]


function create_palette() {
	element =document.getElementById("palette-table")
	el = document.createElement("div")
	palette.forEach( (color,i) => {
		let R=color[0].toString(16)
		let G = color[1].toString(16)
		let B=color[2].toString(16)
		let swatch = document.createElement("div");
		swatch.className="swatch";
		swatch.style.backgroundColor = "#" + R+G+B;
		swatch.style.color = "#" + R+G+B;
		swatch.style.padding="10px";
		swatch.addEventListener(("click"), function() {COLOR="rgba("+color[0]+", "+color[1]+", "+color[2]+", 0.75)"} )
		el.appendChild(swatch)
		if (!((i+1)%4)) {
			element.appendChild(el);
			el =document.createElement("div");
		}
	})
}


function display_in_infobox(infoClass,info) {
	el = document.getElementById(infoClass)
	el.lastChild.textContent=info
}


function downloadCanvas() {
	canvas = document.getElementById(this.dataset.canvasId)
	canvas.toBlob(function(blob) {
		const link = document.createElement('a');
                link.download = 'canvas_image.png'; 
                link.href = URL.createObjectURL(blob);
                link.click();
                // Clean up by revoking the object URL
                URL.revokeObjectURL(link.href);
              }, 
              'image/png');
}

window.addEventListener("load", draw_pattern);
window.addEventListener("load", create_palette);
document.getElementById('download').addEventListener('click', downloadCanvas);
document.getElementById('download-board').addEventListener('click', downloadCanvas);
