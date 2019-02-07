var canvas = document.getElementById("canvas");
canvas.font = "48px serif";
var gc = canvas.getContext("2d");
var lastDate = new Date();
var timeSinceLastTick = 0;
var TIMEBETWEENTICKS  = 0;

var circles = [];

var radius = 5;
var numberOfCircles = 500;
var maxSpeed = 10;
var epsilon = 0.5;
var massBigCircle = 500;
var massSmallCircle = 100;

var artificialIntelligence = true;
var allAI = false;

var key_a = false, key_d = false, key_w = false, key_s = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

if(parseInt(prompt("Show Settings? 1 = Yes, 0 = No", "1")) === 1){
    numberOfCircles = parseInt(prompt("How many circles?", "500"));
    allAI = parseInt(prompt("Should all circles have an AI? 1 = Yes, 0 = No", "0")) === 1;
    epsilon = parseInt(prompt("Springiness? e.g. -1 = no, 0 = low, 1 = high, >1 unrealistic", "0.5"));
    massBigCircle = parseInt(prompt("Mass of your Circle?", "500"));
    massSmallCircle = parseInt(prompt("Mass of any other Circle?", "100"));
}


function randomNumber(range){
    return Math.random() * range;
}

function randomColor() {
    var letters = "0123456789ABCDEF".split('');
    var color = "#";
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


function Circle(x, y, radius){
    
    this.mass = 1;
    this.speedx = 0;
    this.speedy = 0;
    
    this.color = randomColor();
    
    this.x = x;
    this.y = y;
    this.radius = radius;
    
    //ARTIFICIAL INTELLIGENCE
    this.aiNextLeft = randomNumber(100);
    this.aiNextRight = randomNumber(100);
    this.aiNextUp = randomNumber(100);
    this.aiNextDown = randomNumber(100);
    this.aiStepsLeft = 0;
    this.aiStepsRight = 0;
    this.aiStepsUp = 0;
    this.aiStepsDown = 0;
}

circles[0] = new Circle(100, 100, 20);
circles[0].mass = massBigCircle;
//circles[0].color = "white";

for(var i = 1; i<numberOfCircles; i++){
    var r = radius;
    var x = randomNumber(canvas.width - 2 * r) + r;
    var y = randomNumber(canvas.height - 2 * r) + r;
    
    circles[i] = new Circle(x, y, r);
    circles[i].mass = massSmallCircle;
}


function updateLoop(){
    var thisDate = new Date();
    var deltaTime = (thisDate.getTime() - lastDate.getTime()) / 1000;
    lastDate = thisDate;
    
    timeSinceLastTick += deltaTime;
    
    if(timeSinceLastTick > TIMEBETWEENTICKS){
        timeSinceLastTick = 0;
        
        /**
        if(key_w) circles[0].speedy -= 0.25;
        if(key_s) circles[0].speedy += 0.25;
        if(key_a) circles[0].speedx -= 0.25;
        if(key_d) circles[0].speedx += 0.25;
        **/

        
        var totalSpeed = 0;
        
        gc.fillStyle = "#000000";
        gc.fillRect(0, 0, canvas.width, canvas.height);
        
        if(key_w) circles[0].speedy -= 0.25;
        if(key_s) circles[0].speedy += 0.25;
        if(key_a) circles[0].speedx -= 0.25;
        if(key_d) circles[0].speedx += 0.25;

        for(var i = 0; i<circles.length; i++){
            var c = circles[i];
            
            
            c.speedx *= 0.98;
            c.speedy *= 0.98;
            
            //ARTIFICIAL INTELLIGENCE
            if(artificialIntelligence && ((!allAI && i == 0) || allAI)){
                
                c.aiNextLeft--;
                c.aiNextRight--;
                c.aiNextUp--;
                c.aiNextDown--;

                if(c.aiNextLeft <= 0){
                    c.aiStepsLeft = parseInt(randomNumber(20) + 5, 10);
                    c.aiNextLeft = parseInt(randomNumber(90) + 30, 10)
                    //console.log("AI Move! Direction: Left, Steps: " + c.aiStepsLeft);
                }
                if(c.aiNextRight <= 0){
                    c.aiStepsRight = parseInt(randomNumber(20) + 5, 10);
                    c.aiNextRight = parseInt(randomNumber(90) + 30, 10)
                    //console.log("AI Move! Direction: Right, Steps: " + c.aiStepsRight);
                }
                if(c.aiNextUp <= 0){
                    c.aiStepsUp = parseInt(randomNumber(20) + 5, 10);
                    c.aiNextUp = parseInt(randomNumber(90) + 30, 10)
                    //console.log("AI Move! Direction: Up, Steps: " + c.aiStepsUp);
                }
                if(c.aiNextDown <= 0){
                    c.aiStepsDown = parseInt(randomNumber(20) + 5, 10);
                    c.aiNextDown = parseInt(randomNumber(90) + 30, 10)
                    //console.log("AI Move! Direction: Down, Steps: " + c.aiStepsDown);
                }


                if(c.aiStepsLeft > 0){
                    c.aiStepsLeft--;
                    c.speedx -= 0.25;
                }
                if(c.aiStepsRight > 0){
                    c.aiStepsRight--;
                    c.speedx += 0.25;
                }
                if(c.aiStepsUp > 0){
                    c.aiStepsUp--;
                    c.speedy -= 0.25;
                }
                if(c.aiStepsDown > 0){
                    c.aiStepsDown--;
                    c.speedy += 0.25;
                }

            }
            
            //Wall collision
            if(c.x < c.radius){
                c.x = c.radius;
                c.speedx *= -1;
            }
            if(c.x > canvas.width - c.radius){
                c.x = canvas.width - c.radius;
                c.speedx *= -1;
            }      
            if(c.y < c.radius){
                c.y = c.radius;
                c.speedy *= -1;
            }
            if(c.y > canvas.height - c.radius){
                c.y = canvas.height - c.radius;
                c.speedy *= -1;
            }
            
            
            //Circle collision
            for(var k = 0; k<circles.length; k++){
                if(i == k)continue;
                var c1 = c;
                var c2 = circles[k];
                
                var absX = c1.x - c2.x;
                var absY = c1.y - c2.y;
                var abs = absX * absX + absY * absY;
                if(abs <= (c1.radius + c2.radius) * (c1.radius + c2.radius)){
                    var normalx = c2.x - c1.x;
                    var normaly = c2.y - c1.y;
                    var length = Math.sqrt(normalx * normalx + normaly * normaly);
                    normalx /= length;
                    normaly /= length;
                    
                    var overlapplength = c2.radius + c1.radius - length;
                    var masses = c1.mass + c2.mass;
                    c1.x += -normalx * overlapplength * c2.mass / masses;
                    c1.y += -normaly * overlapplength * c2.mass / masses;
                    c2.x += +normalx * overlapplength * c1.mass / masses;
                    c2.y += +normaly * overlapplength * c1.mass / masses;
                    
                    
                    var f = (-(1+epsilon)*((c2.speedx-c1.speedx)*normalx+(c2.speedy-c1.speedy)*normaly))/(1/c1.mass+1/c2.mass);
                    
                    var oldspeedxc1 = c1.speedx;
                    var oldspeedyc1 = c1.speedy;
                    var oldspeedxc2 = c2.speedx;
                    var oldspeedyc2 = c2.speedy;
                    
                    c1.speedx = oldspeedxc1 - f/c1.mass * normalx;
                    c1.speedy = oldspeedyc1 - f/c1.mass * normaly;
                    
                    c2.speedx = oldspeedxc2 + f/c2.mass * normalx;
                    c2.speedy = oldspeedyc2 + f/c2.mass * normaly;
                }
            }
            
            c.x += c.speedx;
            c.y += c.speedy;
            
            
            gc.beginPath();
            gc.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, false);
            gc.fillStyle = c.color;
            gc.fill();
             if(i == 0){
                gc.lineWidth = 5;
                gc.strokeStyle = '#FFFFFF';
                gc.stroke();
            }
        }
            
        
        
        //console.log(totalSpeed);
        
        
        gc.fillStyle = "#FFFFFF";
        gc.font = "30px serif";
        gc.fillText("Move the big ball with WASD!", 20, 30);
    }
    
}




//EVENTS
document.addEventListener("keydown", function(event){
    var key = event.keyCode;
    if(key == 65)key_a = true;
    if(key == 87)key_w = true;
    if(key == 68)key_d = true;
    if(key == 83)key_s = true;
    if(key == 65 || key == 87 || key == 68 || key == 83)artificialIntelligence = false;
});

document.addEventListener("keyup", function(event){
    if(event.keyCode == 65)key_a = false;
    if(event.keyCode == 87)key_w = false;
    if(event.keyCode == 68)key_d = false;
    if(event.keyCode == 83)key_s = false;
});



window.setInterval(updateLoop, 1);
