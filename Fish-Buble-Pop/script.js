//----------------------------------------------------------------------------------------
//1.Canvas setup
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

// canvas.width= 800;
// canvas.height= 500;

let score = 0;
//help to add preodic events
let gameFrame = 0;
let gameSpeed = 1;
let gameOver = false;
const gameOverSound = document.createElement("audio");
gameOverSound.src = "data/game_over.mp3";

ctx.font = "50px Georgia";

//----------------------------------------------------------------------------------------
//2.Mouse interactivity

function getPointerPos(event) {
  //give canvas position cordinate (top ,left)
  const rect = canvas.getBoundingClientRect();

  if (event.touches) {
    return {
      x: event.touches[0].clientX - rect.left,
      y: event.touches[0].clientY - rect.top,
    };
  } else {
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
}

const mouse = {
  x: 0,
  y: 0,
  click: false,
};

canvas.addEventListener("mousedown", (e) => {
  mouse.click = true;
  const pos = getPointerPos(e);
  mouse.x = pos.x;
  mouse.y = pos.y;
});

canvas.addEventListener("mousemove", (e) => {
  if (!mouse.click) return;
  const pos = getPointerPos(e);
  mouse.x = pos.x;
  mouse.y = pos.y;
});

canvas.addEventListener("mouseup", () => {
  mouse.click = false;
});

/* Touch */
canvas.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    mouse.click = true;
    const pos = getPointerPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
  },
  { passive: false }
);

canvas.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    if (!mouse.click) return;
    const pos = getPointerPos(e);
    mouse.x = pos.x;
    mouse.y = pos.y;
  },
  { passive: false }
);

canvas.addEventListener("touchend", () => {
  mouse.click = false;
});

//----------------------------------------------------------------------------------------
//3.Player
const playerleftImage = new Image();
playerleftImage.src = "data/fish_left_flip.png";

const playerrightImage = new Image();
playerrightImage.src = "data/fish_right_flip.png";

class Player {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    this.radius = 50;
    this.angle = 0;

    this.frameX = 0;
    this.frameY = 0;
    this.frameTimer = 0;
    this.frameInterval = 8; // speed of animation
    this.maxFrame = 3; // number of frames in row

    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    this.angle = Math.atan2(dy, dx);

    this.x -= dx / 20;
    this.y -= dy / 20;

    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameX++;
      if (this.frameX > this.maxFrame) this.frameX = 0;
      this.frameTimer = 0;
    }
  }

  //Draw player

  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    // ctx.fillStyle = "red";
    // ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    //args(image,sx,sy,swidth,sheight,x,y,width,height)
    if (this.x <= mouse.x) {
      ctx.drawImage(
        playerrightImage,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        -60,
        -45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    } else {
      ctx.drawImage(
        playerleftImage,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        -60,
        -45,
        this.spriteWidth / 4,
        this.spriteHeight / 4
      );
    }
    ctx.restore();
  }
}

//----------------------------------------------------------------------------------------
//4.Bubbles
const bubbleArray = [];

const bubble1 = new Image();
bubble1.src = "data/bubble1.png";

class Bubbles {
  constructor() {
    //Porperties of bubbles
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance = 0;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }

  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;

    this.distance = Math.sqrt(dx * dx + dy * dy);
  }
  draw() {
    // ctx.fillStyle = "blue";
    // ctx.beginPath();
    // //args(x,y,radius,startAngle,endAngle)
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
    ctx.drawImage(
      bubble1,
      this.x - 65,
      this.y - 75,
      this.radius * 2.5,
      this.radius * 2.5
    );
  }
}

const bubbleSound1 = document.createElement("audio");
bubbleSound1.src = "data/bubbles-single1.wav";

const bubbleSound2 = document.createElement("audio");
bubbleSound2.src = "data/bubbles-single2.wav";

function handleBubbles() {
  if (gameFrame % 50 === 0) {
    bubbleArray.push(new Bubbles());
  }

  for (let i = 0; i < bubbleArray.length; i++) {
    const bubble = bubbleArray[i];

    bubble.update();
    bubble.draw();

    // remove off-screen bubbles
    if (bubble.y < 0 - 2 * bubble.radius) {
      bubbleArray.splice(i, 1);
      i--;
    }

    // collision detection
    if (bubbleArray[i] && bubble.distance < bubble.radius + player.radius) {
      score++;
      bubbleArray.splice(i, 1);
      if (bubble.sound == "sound1") {
        bubbleSound1.play();
      } else {
        bubbleSound2.play();
      }
      i--;
    }
  }
}
//5.Background----------------------------------------------------------------------------------------
const background1 = new Image();
background1.src = "data/background1.jpg";

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  width: canvas.width,
  height: canvas.height,
};

function handleBackground() {
  // BG.x1 -= gameSpeed;
  // if (BG.x1<-BG.width) BG.x1= BG.width;
  // BG.x2 -= gameSpeed;
  // if (BG.x2<-BG.width) BG.x2= BG.width;

  ctx.drawImage(background1, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(background1, BG.x2, BG.y, BG.width, BG.height);
}
//Responsive canvas
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;
  BG.width = canvas.width;
  BG.height = canvas.height;
  BG.x1 = 0;
  BG.x2 = canvas.width;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

//6.Enemy----------------------------------------------------------------------------------------
const enemy_img1 = new Image();
enemy_img1.src = "data/enemy_fish.png";

class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 60;
    this.speed = Math.random() * 2 + 2;

    this.frameX = 0;
    this.frameY = 0;
    this.frameTimer = 0;
    this.frameInterval = 8;
    this.maxFrame = 3;

    this.angle = 0;
    this.distance = 0;

    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  update() {
    this.x -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);

    //means if enemy goes off screen
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 2;
    }

    //animation
    this.frameTimer++;
    if (this.frameTimer >= this.frameInterval) {
      this.frameX++;
      if (this.frameX > this.maxFrame) this.frameX = 0;
      this.frameTimer = 0;
    }
  }
  draw() {
    ctx.drawImage(
      enemy_img1,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 70,
      this.y - 50,
      this.spriteWidth / 3,
      this.spriteHeight / 3
    );
  }
}

const enemy1 = new Enemy();

function handleEnemies() {
  enemy1.update();
  enemy1.draw();
  //collision detection
  if (enemy1.distance < enemy1.radius + player.radius) {
    gameOver = true;
    enemy1.x = canvas.width + 200;
    enemy1.y = Math.random() * (canvas.height - 150) + 90;
  }
}
//-----------------------------------------------------------------------------------------------
//7.Animation loop
const player = new Player();

function animate() {
  //clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  handleBubbles();
  player.update();
  player.draw();
  handleEnemies();
  ctx.save();

  // Font
  ctx.font = "bold 32px Georgia";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  // Shadow
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Text outline
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  ctx.strokeText("Score: " + score, 20, 20);

  // Fill text
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 20, 20);

  ctx.restore();

  gameFrame++;
  if (!gameOver) {
    requestAnimationFrame(animate);
  } else {
    ctx.save();
    gameOverSound.play();
    // Background overlay (optional but nice)
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Main Game Over text
    ctx.fillStyle = "white";
    ctx.font = "bold 60px Georgia";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "black";
    ctx.shadowBlur = 10;

    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);

    // Score text
    ctx.font = "bold 32px Georgia";
    ctx.shadowBlur = 0;

    ctx.fillText(
      "Your Score: " + score,
      canvas.width / 2,
      canvas.height / 2 + 30
    );

    ctx.restore();
    if (gameOver) {
      canvas.addEventListener("pointerdown", () => {
        window.location.reload();
      });
    }
  }
}
animate();

//----------------------------------------------------------------------------------------
