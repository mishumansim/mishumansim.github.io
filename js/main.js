function TMain()
{
var carriedChemodanID = "";
var carriedChemodanOffset = [];
var chumadans = [];
var left_scale = {};
var right_scale = {};
var floorTop = 600;
var gravityAccel = 0.3;
var scaleBounciness = 0.5; // more will make scales flex further before contracting
var currentOrder = 0;
document.getElementById("Reset").addEventListener("click", init);
document.getElementById("displayWeighs").addEventListener("click", optionsDisplayWeighs);
document.getElementById("scaleArrow").addEventListener("click",optionsDisplayArrow);

init();
setInterval(tick, 30);

function init() {
		// Randomize initial bag positions by using array shuffle.
	var positionArr = [0,1,2,3,4,5,6,7,8,9,10,11];
	var counter = 12;
	var index;
	var temp;
	while (counter > 0) {
		counter--;
		index = Math.floor(Math.random() * counter);
		temp = positionArr[counter];
        positionArr[counter] = positionArr[index];
        positionArr[index] = temp;
	}
		// Init bags objects and update bag positions on page.
	for (var i = 0 ; i < 12 ; i++) {
		var id = "bag"+i;
		var left = 360 + 30*positionArr[i];
		chumadans[i] = {
			"weight" : 10+10*i,
			"speed"  : 0,
			"id"     : id,
			"top"    : 400,
			"left"   : left,
			"width"  : 25,
			"height" : 35,
			"right"  : left + 25,
			"bottom" : 435,
			"zIndex" : 0,
			"boundTo": "none"
		}
		document.getElementById(id).style.left = chumadans[i].left + "px";
	}

	setIndicator("lightgrey", "|");

	left_scale = {
		"id" : "left_scale",
		"left"        : 200,
		"right"       : 450,
		"top"         : 300,
		"bottom"      : 335,
		"totalWeight" : 0,
		"flexForce"   : -scaleBounciness,
		"flexOffset"  : 0,
	}
	right_scale = {
		"id"          : "right_scale",
		"left"        : 600,
		"right"       : 850,
		"top"         : 300,
		"bottom"      : 335,
		"totalWeight" : 0,
		"flexForce"   : -scaleBounciness,
		"flexOffset"  : 0,
	}
	optionsDisplayArrow();
}

function tick(){
	for (var i = 0 ; i < 12 ; i++) {
		var id = "bag"+i;
		var che = chumadans[i];
		che.speed += gravityAccel;
		che.bottom = che.top+che.height;
		che.right = che.left+che.width;
			// Check if bag hits floor or both scales. If not, continue accelerating.
		if (che.bottom + che.speed >= floorTop) {
			che.top = floorTop - che.height;
			che.speed = 0;
		}
		else if (che.bottom + che.speed >= left_scale.top && che.right > left_scale.left && che.left < left_scale.right && che.top < left_scale.top) {
			if (che.bottom != left_scale.top) {
				updateScale("left",che.weight,che);
				console.log("LEFT - " + left_scale.totalWeight);
			}
			che.top = left_scale.top - che.height;
			che.speed = 0;
		}
		else if (che.bottom + che.speed >= right_scale.top && che.right > right_scale.left && che.left < right_scale.right && che.top < right_scale.top) {
			if (che.bottom != right_scale.top) {
				updateScale("right",che.weight,che);
				console.log("RIGHT - " + right_scale.totalWeight);
			}
			che.top = right_scale.top - che.height;
			che.speed = 0;
		}
		else {
			che.top += che.speed;
		}
		document.getElementById(id).style.top = che.top + "px";
	}
		// Check if scales are in mid-bounce and add a temporary offset going from 0 to scaleBounciness and back to 0 to scale and bags that are on it. 
	if (left_scale.flexForce > -scaleBounciness) {
		left_scale.flexOffset += left_scale.flexForce;
		var tempTop = left_scale.top + left_scale.flexOffset;
		document.getElementById("left_scale").style.top = tempTop + "px";
		for (var i = 0 ; i < 12 ; i++) {
			if (chumadans[i].boundTo == "left") {
				tempTop = left_scale.top + left_scale.flexOffset - chumadans[i].height;
				document.getElementById(chumadans[i].id).style.top = tempTop + "px";
			}
		}
		left_scale.flexForce -= scaleBounciness/15
	}
	else if (left_scale.flexOffset != 0) {
		left_scale.flexOffset = 0;
		document.getElementById("left_scale").style.top = left_scale.top + "px";
		for (var i = 0 ; i < 12 ; i++) {
			if (chumadans[i].boundTo == "left") {
				document.getElementById(chumadans[i].id).style.top = chumadans[i].top + "px";
			}
		}
	}
		// repeat above for right scale
	if (right_scale.flexForce > -scaleBounciness) {
		right_scale.flexOffset += right_scale.flexForce;
		var tempTop = right_scale.top + right_scale.flexOffset;
		document.getElementById("right_scale").style.top = tempTop + "px";
		for (var i = 0 ; i < 12 ; i++) {
			if (chumadans[i].boundTo == "right") {
				tempTop = right_scale.top + right_scale.flexOffset - chumadans[i].height;
				document.getElementById(chumadans[i].id).style.top = tempTop + "px";
			}
		}
		right_scale.flexForce -= scaleBounciness/15
	}
	else if (right_scale.flexOffset != 0) {
		right_scale.flexOffset = 0;
		document.getElementById("right_scale").style.top = right_scale.top + "px";
		for (var i = 0 ; i < 12 ; i++) {
			if (chumadans[i].boundTo == "right") {
				document.getElementById(chumadans[i].id).style.top = chumadans[i].top + "px";
			}
		}
	}
}

function optionsDisplayWeighs() {
	if (document.getElementById("displayWeighs").checked) {
		for (var i = 0; i < chumadans.length; i++) {
			document.getElementById("bag"+i).innerHTML = chumadans[i].weight;
		}
	}
	else {
		for (var i = 0; i < chumadans.length; i++) {
			document.getElementById("bag"+i).innerHTML = "";
		}
	}
}

function optionsDisplayArrow() {
	if (document.getElementById("scaleArrow").checked ) 
		document.getElementById("indicatorText").style.visibility = "visible";
	else 
		document.getElementById("indicatorText").style.visibility = "hidden";
}

function setIndicator(color, indicatorText="") {
	document.getElementById("indicator").style.backgroundColor = color;
	document.getElementById("indicatorText").innerHTML = indicatorText;
	optionsDisplayArrow();
}

function updateScale(whichScale, cheWeight, chumadan) {
	if (whichScale=="left") { 
		left_scale.totalWeight += cheWeight;
	}
	if (whichScale=="right") { 
		right_scale.totalWeight += cheWeight;
	}
	
	if (right_scale.totalWeight == 0 && left_scale.totalWeight == 0) { 
		setIndicator("lightgrey", "|");
	}
	else if	(left_scale.totalWeight == right_scale.totalWeight) {
		setIndicator("limegreen", "="); 
	}
	else if (left_scale.totalWeight > right_scale.totalWeight) {
		setIndicator("red", "<"); 
	}
	else {
		setIndicator("red", ">"); 
	}
	
	if (cheWeight > 0) {
		chumadan.boundTo = whichScale;
		animateScale(whichScale)
	}
	else
	{
		chumadan.boundTo = "none";
	}
}

function animateScale(whichScale) {
	if (whichScale == "left") {
		left_scale.flexForce = scaleBounciness;
	}
	else {
		right_scale.flexForce = scaleBounciness;
	}
}

	// DOCUMENT EVENTS
	// Bag drag event
document.ondragstart = function(event) {
	carriedChemodanID = event.target.id;
	var carriedChemodan;
	for (var i = 0; i < 12; i++) {
		if (chumadans[i].id == event.target.id) {
			carriedChemodan = chumadans[i]; 
		}
	}
	carriedChemodanOffset = [event.clientX - carriedChemodan.left, event.clientY - carriedChemodan.top]
	if (carriedChemodan.top + carriedChemodan.height == left_scale.top) {
		if (carriedChemodan.right > left_scale.left && carriedChemodan.left < left_scale.right) {
			updateScale("left",-carriedChemodan.weight, carriedChemodan);
			console.log("LEFT - " + left_scale.totalWeight);
		}
	}

	if (carriedChemodan.top + carriedChemodan.height == right_scale.top) {
		if (carriedChemodan.right > right_scale.left && carriedChemodan.left < right_scale.right) {
			updateScale("right",-carriedChemodan.weight, carriedChemodan);
			console.log("RIGHT - " + right_scale.totalWeight);
		}
	}
}
	// Page drag events
document.ondragover = function(event) {
	event.preventDefault();
}
document.ondrop = function(event) {
	event.preventDefault();
	if (event.target.id == "left_scale" || event.target.id == "right_scale") {
		console.log("drop not allowed")
	}
	else {
		for (var i = 0 ; i < chumadans.length; i++) {
			if (carriedChemodanID == chumadans[i].id) {
				chumadans[i].left = event.clientX - carriedChemodanOffset[0];
				chumadans[i].top = event.clientY - carriedChemodanOffset[1];
				chumadans[i].zIndex = currentOrder++;
				document.getElementById(carriedChemodanID).style.left = event.clientX - carriedChemodanOffset[0] + "px";
				document.getElementById(carriedChemodanID).style.top = event.clientY - carriedChemodanOffset[1] + "px";
				document.getElementById(carriedChemodanID).style.zIndex = chumadans[i].zIndex;
			}
		}
		carriedChemodanID = "";
	}
}

}