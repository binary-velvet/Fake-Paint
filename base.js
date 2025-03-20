const hoveredColor=1
const selectedColor=1
var drawing=false
var isTouch=false
const X=270
const Y=270
const SCALE_MULTIPLIER=13.5
var COLOR="rgb(109, 170, 44, 50%)"


function draw_board() {
	const canvas = document.getElementById("board");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");
		// create new image object to use as pattern
		const patterncanvas = document.getElementById("pattern")
		ctx2 = patterncanvas.getContext("2d")
		//console.log(ctx2)

    	// create pattern. needs wrapping
		const pattern = ctx.createPattern(patterncanvas, "repeat");
		ctx.fillStyle = pattern;
		ctx.fillRect(0, 0, 270, 270);

	}
}
function draw_pattern() {
	const canvas = document.getElementById("pattern");
	const board_canvas = document.getElementById("board");
	const board_ctx = board_canvas.getContext("2d");
	if (canvas.getContext) {
		const ctx = canvas.getContext("2d");
		ctx.fillStyle = COLOR
		const bounding = canvas.getBoundingClientRect();
		function draw(event, destination) {
			//console.log("draw "+ drawing)
			display_in_infobox("infobox-bounding"," left:"+bounding.left+" top:"+bounding.top)
			display_in_infobox("event-coords"," eventX:"+event.clientX+" eventY:"+event.clientY)
			if (drawing){
				//var x = isTouch ? event.clientX : event.clientX - bounding.left;
				//the last division is just to compensate for intuitive drawing - we want the drawn pixel to be in the m i d d l e of the pen tip
				var x = event.clientX - bounding.left - SCALE_MULTIPLIER/2
				//var y = isTouch ? event.clientY : event.clientY - bounding.top;
				var y = event.clientY - bounding.top - SCALE_MULTIPLIER/2
				if (x>X) {
					x = x-X
				} 
				if (y>Y) {
					y = y-Y
				} 
				display_in_infobox("final-coords"," x:"+x+" y:"+y)
				ctx.fillStyle = COLOR;
				var scaled_x=Math.round(x/SCALE_MULTIPLIER)
				var scaled_y=Math.round(y/SCALE_MULTIPLIER)
				display_in_infobox("scaled-coords"," x scaled:" + scaled_x + "y scaled:"+scaled_y);
				ctx.fillRect(scaled_x, scaled_y, 1, 1);
				const pattern = board_ctx.createPattern(canvas, "repeat");
				//clearing only necessary when doing translucent stuff though
				board_ctx.clearRect(0, 0, board_canvas.width, board_canvas.height);
				board_ctx.fillStyle = pattern;
				board_ctx.fillRect(0, 0, 270, 270);

			}
			//return rgbColor;
		}
		//canvas.addEventListener("mousemove", (event) => draw(event, hoveredColor));
		//canvas.addEventListener("click", (event) => draw(event, selectedColor));
		canvas.addEventListener("mousedown", (event) => drawing=true);
		canvas.addEventListener("mouseup", (event) => drawing=false);
		canvas.addEventListener("mousemove", (event) => draw(event, hoveredColor));
// Set up touch events for mobile, etc
		canvas.addEventListener("touchstart", function (e) {
			if (e.target == canvas) {
				isTouch=true
				e.preventDefault();
			}
			//window.alert("hello "+ "x:"+getTouchPos(canvas, e).x+ " y:"+ getTouchPos(canvas, e).y)

			mousePos = getTouchPos(canvas, e);
			var touch = e.touches[0];
			var mouseEvent = new MouseEvent("mousedown", {
				clientX: mousePos.x,
				clientY: mousePos.y
			});
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

		

// Get the position of a touch relative to the canvas
		function getTouchPos(canvasDom, touchEvent) {
			var rect = canvasDom.getBoundingClientRect();
			return {
				x: touchEvent.touches[0].clientX - rect.left,
				y: touchEvent.touches[0].clientY - rect.top
			};
		}
		ctx.fillStyle = COLOR;
		ctx.fill();
	}
	
}


//from https://pixeljoint.com/forum/forum_posts.asp?TID=12795
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


window.addEventListener("load", draw_pattern);

window.addEventListener("load", draw_board);

window.addEventListener("load", create_palette);

function create_palette() {
	element =document.getElementById("palette-table")
	el = document.createElement("div")
	palette.forEach( (color,i) => {
		let R=color[0].toString(16)
		let G = color[1].toString(16)
		let B=color[2].toString(16)
		let swatch = document.createElement("div")
		swatch.className="swatch"
		swatch.style.backgroundColor = "#" + R+G+B 
		swatch.style.color = "#" + R+G+B
		swatch.innerText="■"
		swatch.style.padding="10px"
		swatch.addEventListener(("click"), function() {COLOR="rgba("+color[0]+", "+color[1]+", "+color[2]+", 0.75)";console.log("colored","rgba("+color[0]+", "+color[1]+", "+color[2]+", 0.75)")} )
		el.appendChild(swatch)
		if (!((i+1)%4)) {
			element.appendChild(el)
			el =document.createElement("div")
		}
	}

	)
}


function display_in_infobox(infoClass,info) {
	el = document.getElementById(infoClass)
	el.lastChild.textContent=info
}





function downloadCanvas() {
  // Convert the canvas to a data URL (default is PNG)
	canvas = document.getElementById("pattern")
	canvas.toBlob(function(blob) {
                // Create a link element
		const link = document.createElement('a');
                link.download = 'canvas_image.png'; // File name
                link.href = URL.createObjectURL(blob); // Create a URL for the blob

                // Trigger the download
                link.click();

                // Clean up by revoking the object URL
                URL.revokeObjectURL(link.href);
              }, 'image/png');
}

        // Add event listener to the button
document.getElementById('download').addEventListener('click', downloadCanvas);

function downloadBoard() {
  // Convert the canvas to a data URL (default is PNG)
	canvas = document.getElementById("board")
	canvas.toBlob(function(blob) {
                // Create a link element
		const link = document.createElement('a');
                link.download = 'canvas_image.png'; // File name
                link.href = URL.createObjectURL(blob); // Create a URL for the blob

                // Trigger the download
                link.click();

                // Clean up by revoking the object URL
                URL.revokeObjectURL(link.href);
              }, 'image/png');
}

        // Add event listener to the button
document.getElementById('download-board').addEventListener('click', downloadBoard);



/* 
// example for checking supported code
if (canvas.getContext) {
  const ctx = canvas.getContext("2d");
  // drawing code here
} else {
  // canvas-unsupported code here
}

*/