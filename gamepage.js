let c = document.querySelector("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;

let ctx = c.getContext("2d");

var gotkey = false,lockopened= false,Checkkey = true;  // boolean to check whether the keys are took and the lock opened?
var xBall = 40,yBall =  10,radius = 30,gravity = 3 ,x_velocity=0,y_velocity=0;   // Ball details
var xpaddle = 550, ypaddle = 0,  paddleWidth = 100, paddleHeight = 160,xpaddleSpeed = 1;ypaddleSpeed = 1;  // centre paddledetails
var xbarrier1 = 800, ybarrier1 = 0,barrier1Width = 80,barrier1Height = 70, b1XSpeed = 1,b1YSpeed = 1;      // right floor 1st barrier details
var xbarrier2 = 1000, ybarrier2 = 260,barrier2Width = 80,barrier2Height = 70, b2XSpeed = 1,b2YSpeed = 1;   // right floor 2nd barrier details
var leftbarrier_x = 300,leftbarrier_y = 390, leftbarrierWidth = 80,leftbarrierHeight = 70,xSpeed = 1,ySpeed = 1;//Left barrier details

function ShowGameResult(displayModalId,closeButtonId,soundName){  // Function to show the GameResult in a modal box.
    $(displayModalId).modal('show');                              // Displaying the Modal box after the unlock.
    document.getElementById(closeButtonId).addEventListener("click",function() {
      window.location.replace("index.html");                      // Takes us to the homepage when close button is clicked. 
    });                                   
    clearInterval(interval);
    soundName.play();                                             // plays Sound according to the GameResult (Won/lose)
}

let drawCircle = (x,y,r,s,e) => {  // function to draw Circle with canvas.
    ctx.arc(x,y,r,s,e);               
    ctx.fillStyle = "rgb(0, 142, 255)";          
    ctx.fill();
    ctx.stroke(); 
}

let drawrectangle = (x,y,w,h) => {   // function to draw rectangle with canvas.
    ctx.beginPath();                                 
    ctx.fillRect(x,y,w,h);
    ctx.fillStyle = "#FF8C00";
    ctx.strokeStyle = "rgb(0, 142, 255)";
    ctx.stroke();
}               

var controller = {      // function to check which key is pressed by the player. 
    left:false, right:false,
    keyListener:function(event) {
      var key_state = (event.type == "keydown")?true:false;
      switch(event.keyCode) {
        case 37:// left key
          controller.left = key_state;
          break;
        case 39:// right key
          controller.right = key_state;
          break;
      }
    }
}; 

function sound(src) {                   //sound function to play sound when Game ends
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    };
    this.stop = function () {
      this.sound.pause();
    };
}; 

function animate() {     // function to call for every movement.
    ctx.clearRect(0,0,innerWidth,innerHeight); 
    ctx.beginPath();
    ctx.fillStyle = "#FF8C00"; 
    drawrectangle(xpaddle,ypaddle,paddleWidth,paddleHeight);  //function called for drawing a centre paddle.
    if((ypaddle + ypaddleSpeed) > 300 ||( ypaddle + ypaddleSpeed) < -20)
        ypaddleSpeed = -ypaddleSpeed;                                   // centre paddle movement
    if((ybarrier1 + b1YSpeed) >= 260 || (ybarrier1 + b1YSpeed) <= -20)
        b1YSpeed = -b1YSpeed;                                           // right floor first barrier movement
    if((ybarrier2 + b2YSpeed) >= 260 || (ybarrier2 + b2YSpeed) <= -20)
        b2YSpeed = -b2YSpeed;                                           // right floor second barrier movement
    if((leftbarrier_y + ySpeed) >= 390 || (leftbarrier_y + ySpeed) <= 200)
        ySpeed = -ySpeed;                                              // Left barrier movement

    if((xBall+radius >= 800 && xBall+radius <= 940 && ybarrier1>= 200 && ybarrier1 <= 250))  //If the ball hits the right first barrier.
        ShowGameResult('#lose',"loseclose",mySound);
    if(xBall+radius >= 1000 && xBall+radius <= 1140 && ybarrier2 >= 200 && ybarrier2 <= 250) // If the ball hits the right second barrier.
        ShowGameResult('#lose',"loseclose",mySound);
    if(xBall+radius >= 290 && xBall+radius <= 440 && leftbarrier_y >= 320 && leftbarrier_y <= 390 && yBall >= 310) // If the ball hits the left barrier.
        ShowGameResult('#lose',"loseclose",mySound);

    leftbarrier_y += ySpeed;
    ybarrier2 += b2YSpeed;
    ybarrier1 += b1YSpeed;
    ypaddle += ypaddleSpeed; 

    drawrectangle(0,200,500,10);   //left 1st floor
    drawrectangle(700,330,600,10); //right 1st floor
    drawrectangle(0,450,500,10);   // left 2nd floor
    drawrectangle(xbarrier1,ybarrier1,barrier1Width,barrier1Height); // right 1st floor 1st huddle
    drawrectangle(xbarrier2,ybarrier2,barrier2Width,barrier2Height); // right 1st floor 2nd huddle    
    drawrectangle(leftbarrier_x,leftbarrier_y, leftbarrierWidth,leftbarrierHeight);
    drawCircle(xBall,yBall,radius,0,Math.PI * 2);

    if(controller.right && xBall <= innerWidth - 100)
        xBall += 4;                                       // To move the ball right 
    if(controller.left && xBall >= 50)
        xBall -= 4;                                      // To move the ball left 
    if(yBall > 450)
        yBall += gravity;                               // If the ball goes beyond 450 it should reach the ground
    else if(yBall <= 450 && yBall >= 210 &&  xBall <= 510)
        yBall = 450 - radius;                         // To stop the ball in the left 2nd floor
    else if(yBall >= 210 && yBall <= 330 && xBall >= 700){
        yBall = 330 - radius;
        if(xBall > 1150) {    
            xBall -= 4;                              // To stop the ball in the right floor
            yBall = 330 - radius;
        } 
    }
    else if(yBall + radius >= 200 && xBall  <= 510)
        yBall = 200 - radius;                        // To stop the ball in the left 1st floor
    else
        yBall += gravity;   // Ball should fall in gravity if its not standing in the floors.

    if(xBall >= 1100 && yBall >= 300){
        document.getElementById("key").style.visibility = "hidden";       // To hide the key when the ball reaches the innerwidth
        gotkey = true;
        if(Checkkey) {
          bonussound.play();
          Checkkey = false;
        }
    }
    if(xBall > 510 && xBall <= 520 &&  yBall <= 200 && ypaddle+paddleHeight >= 100 && ypaddle <= 250) // paddle stoping the ball from moving(left)
       xBall = 500;
    if(xBall >= 690 && xBall <= 700 && ypaddle+paddleHeight >= 330 && ypaddle <= 480)  // paddle stoping the ball from moving(right)
       xBall = 710;
    if( gotkey && xBall <= 100 && yBall >= 410){
       document.getElementById("lock").style.visibility = "hidden";       // To hide the lock when the ball reaches the end
       lockopened = true;
    }
    if(lockopened && xBall <= 50) {
        ShowGameResult("#won",'wonclose',wonsound);           // Calling function to display Game Result.
        ShowGameResult("#won",'stopplaying',wonsound);
    }
    if(xBall <= 100 && !lockopened && yBall >= 410)  //single star displayed when user reaches end without the key
        ShowGameResult("#singlestar",'singlestarclose',keysound);
    if(yBall + radius >= innerHeight)  // Displaying the Modal before winning(ball reaches the ground).
        ShowGameResult('#lose',"loseclose",mySound);

    ctx.clearRect(300,560,700, 600);
    drawCircle(xBall,yBall,radius,0,Math.PI * 2);
}
window.addEventListener("keydown", controller.keyListener); 
window.addEventListener("keyup", controller.keyListener);
let interval = setInterval(animate, 10);   //calling the animate function.
var mySound  =  new sound("audio/gameover.wav");
var wonsound = new sound("audio/gamewon.mp3");
var keysound = new sound("audio/keysound.mp3");
var bonussound = new sound("audio/bonus.mp3");