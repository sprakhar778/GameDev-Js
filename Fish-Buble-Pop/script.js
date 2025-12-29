
//----------------------------------------------------------------------------------------
//1.Canvas setup
const canvas= document.getElementById('canvas1');
const ctx= canvas.getContext('2d');

canvas.width= 800;
canvas.height= 500;

let score= 0;
//help to add preodic events
let gameFrame= 0;
ctx.font= '50px Georgia';


//----------------------------------------------------------------------------------------
//2.Mouse interactivity

const mouse={
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}

canvas.addEventListener("mousedown", function(event){
    mouse.click= true ;
    mouse.x= event.x-this.offsetLeft ;
    mouse.y= event.y-this.offsetTop ;
    console.log("Mouse clicked at: "+ mouse.x +", "+ mouse.y);
});

canvas.addEventListener("mouseup", function(event){
    mouse.click= false ;
});

//Add touch support for mobile devices
canvas.addEventListener("touchstart", function(event){
    mouse.click= true ;
    mouse.x= event.touches[0].clientX - this.offsetLeft ;
    mouse.y= event.touches[0].clientY - this.offsetTop ;
});

canvas.addEventListener("touchend", function(event){
    mouse.click= false ;
});



//----------------------------------------------------------------------------------------
//3.Player
class Player{
    constructor(){
        this.x=canvas.width/2 ;
        this.y=canvas.height/2 ;

        this.radius=50;
        this.angle=0;

        this.frameX=0;
        this.frameY=0;
        this.frame=0;

        this.spriteWidth=498;
        this.spriteHeight=327;
    }

    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        if (mouse.x != this.x){
            this.x -= dx/20 ;
        }
        if (mouse.y != this.y){
            this.y -= dy/20 ;
        }
    }

    //Draw player

    draw(){
        if (mouse.click){
            ctx.lineWidth= 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle= 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
}


//----------------------------------------------------------------------------------------
//4.Bubbles
const bubbleArray= [];


class Bubbles
{ 
    constructor(){
        //Porperties of bubbles
        this.x= Math.random() * canvas.width ;
        this.y= canvas.height+100 ;
        this.radius=50;
        this.speed= Math.random() *5 +1 ;
        this.distance=0;
        this.counted= false ;
        this.sound= Math.random()<=0.5? 'sound1' : 'sound2';

    }

    update(){
        this.y -= this.speed ;
        const dx=this.x-player.x;
        const dy=this.y-player.y;

        this.distance=Math.sqrt(dx*dx+dy*dy);

}
    draw(){
        ctx.fillStyle= 'blue';
        ctx.beginPath();
        //args(x,y,radius,startAngle,endAngle)
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
}

const bubbleSound1=document.createElement("audio");
bubbleSound1.src="data/bubbles-single1.wav"

const bubbleSound2=document.createElement("audio");
bubbleSound2.src="data/bubbles-single2.wav"

function handleBubbles() {
    if (gameFrame % 50 === 0) {
        bubbleArray.push(new Bubbles());
    }

    for (let i = 0; i < bubbleArray.length; i++) {

        const bubble = bubbleArray[i];

        bubble.update();
        bubble.draw();

        // remove off-screen bubbles
        if (bubble.y < 0-2*bubble.radius) {
            bubbleArray.splice(i, 1);
            i--;
           
        }

        // collision detection
        if (bubble.distance < bubble.radius + player.radius) {
            score++;
            bubbleArray.splice(i, 1);
            if (bubble.sound=="sound1")
            {
                bubbleSound1.play();
            }
            else{
                bubbleSound2.play();
            }
            i--;
        }
    }
}

//----------------------------------------------------------------------------------------
//5.Animation loop
const player= new Player();

function animate(){
    //clear canvas
    ctx.clearRect(0,0,canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle= 'black';
    ctx.fillText('Score: '+ score,10,50);

    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

//----------------------------------------------------------------------------------------