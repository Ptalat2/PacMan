const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


canvas.width = innerWidth/1.5;
canvas.height = innerHeight;
let score =0;

class Boundary  {
    static width = 40;
    static height = 40;
    constructor({position, image}) {
        this.position = position;
        this.width = 40;
        this.height = 40; 
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image,this.position.x, this.position.y);
    }
}

class Player {
    constructor({position,velocity}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.rate = .12;
        this.rotation =0;
    }

    draw() {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation);
      ctx.translate(-this.position.x, -this.position.y);
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y,this.radius,0 + this.radians,Math.PI*2 - this.radians);
      ctx.lineTo(this.position.x, this.position.y);
      ctx.fillStyle = 'yellow';
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }

    update() {
        this.draw();
        this.position.x += (this.velocity.x);
        this.position.y += this.velocity.y;
        if(this.radians <0 || this.radians > .75) {
          this.rate= -this.rate;
        }

        this.radians += this.rate;
    }


}



class ghost {
  static speed = 2;
  constructor({position,velocity, color='red'}) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 16;
    this.color = color;
    this.prevC = [];
    this.speed = 2;
    this.scared = false;
}

draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y,this.radius,0,Math.PI*2);
    ctx.fillStyle =  this.scared ? 'blue' : this.color;
    ctx.fill();
    ctx.closePath();
}

update() {
    this.draw();
    this.position.x += (this.velocity.x);
    this.position.y += this.velocity.y;
}

}

class Piece {
    constructor({position,velocity}) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y,this.radius,0,Math.PI*2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }

}

class PowerUp {
  constructor({position,velocity}) {
      this.position = position;
      this.radius = 8;
  }

  draw() {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y,this.radius,0,Math.PI*2);
      ctx.fillStyle = 'green';
      ctx.fill();
      ctx.closePath();
  }

}




const pieces = [];
const boosters = [];

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', '.', '.', '.', '.', '.', '.', ' ', '.', '|'],
    ['|', '.', 'b', ' ', '[', '7', ']', ' ', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', ' ', '.', ' ', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', ' ', '.', '.', '^', '.', '.', '.', ' ', '|'],
    ['|', '.', 'b', ' ', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', ' ', '.', '.', '_', ' ', ' ', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', ' ', '.', ' ', '^', ' ', '.', '.', '.', '|'],
    ['|', ' ', 'b', ' ', '[', '5', ']', '.', 'b', ' ', '|'],
    ['|', '.', '.', '.', '.', ' ', '.', ' ', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]


const boundaries = [];
const ghosts = [
  new ghost({
    position: {x: Boundary.width *6 + Boundary.width/2, y: Boundary.height+Boundary.height/2},
    velocity:{x:2,y:0},
}),
new ghost({
  position: {x: Boundary.width *6 + Boundary.width/2, y: Boundary.height*7+Boundary.height/2},
  velocity:{x:2,y:0},
  color:'pink'
})
];

const player = new Player({
position: {x: Boundary.width + Boundary.width/2, y: Boundary.height+Boundary.height/2},
velocity: {x: 0, y: 0}
});

function makeImage(string) {
    const image = new Image();
    image.src = string;
    return image;
}




const keys = {
    ArrowUp: {pressed:false},
    ArrowDown: {pressed:false},
    ArrowLeft: {pressed:false},
    ArrowRight: {pressed:false}
}

let lastKey ='';



map.forEach((row, index) => {
row.forEach((symbol,j)=>{
    switch(symbol) {
        case '-':
            boundaries.push(new Boundary({
                position: {
                    x:Boundary.width *j,
                    y:Boundary.height *index },

                image: makeImage('./img/pipeHorizontal.png')
            })
        )
            break;
            case '|':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * index
                    },
                    image: makeImage('./img/pipeVertical.png')
                  })
                )
                break
              case '1':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * index
                    },
                    image: makeImage('./img/pipeCorner1.png')
                  })
                )
                break
              case '2':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * index
                    },
                    image: makeImage('./img/pipeCorner2.png')
                  })
                )
                break
              case '3':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * index
                    },
                    image: makeImage('./img/pipeCorner3.png')
                  })
                )
                break
              case '4':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * index
                    },
                    image: makeImage('./img/pipeCorner4.png')
                  })
                )
                break
              case 'b':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: Boundary.width * j,
                      y: Boundary.height * index
                    },
                    image: makeImage('./img/block.png')
                  })
                )
                break
              case '[':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    image: makeImage('./img/capLeft.png')
                  })
                )
                break
              case ']':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    image: makeImage('./img/capRight.png')
                  })
                )
                break
              case '_':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    image: makeImage('./img/capBottom.png')
                  })
                )
                break
              case '^':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    image: makeImage('./img/capTop.png')
                  })
                )
                break
              case '+':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    image: makeImage('./img/pipeCross.png')
                  })
                )
                break
              case '5':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    color: 'blue',
                    image: makeImage('./img/pipeConnectorTop.png')
                  })
                )
                break
              case '6':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    color: 'blue',
                    image: makeImage('./img/pipeConnectorRight.png')
                  })
                )
                break
              case '7':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: index * Boundary.height
                    },
                    color: 'blue',
                    image: makeImage('./img/pipeConnectorBottom.png')
                  })
                )
                break
              case '8':
                boundaries.push(
                  new Boundary({
                    position: {
                      x: j * Boundary.width,
                      y: i * Boundary.height
                    },
                    image: makeImage('./img/pipeConnectorLeft.png')
                  })
                )
                break
              case '.':
                pieces.push(
                  new Piece({
                    position: {
                      x: j * Boundary.width + Boundary.width / 2,
                      y: index * Boundary.height + Boundary.height / 2
                    }
                  })
                )
                break

              case 'p':
                boosters.push(
                  new PowerUp({
                    position: {
                      x: j * Boundary.width + Boundary.width / 2,
                      y: index * Boundary.height + Boundary.height / 2
                    }
                  })
                )
                break

    }
})

})

function colliding(player,boundary) {
  const padding = Boundary.width/2 - player.radius-1;
    return (player.position.y-player.radius + player.velocity.y <= boundary.position.y + boundary.height +padding && player.position.x +player.radius+ player.velocity.x >= boundary.position.x -padding && player.position.y + player.radius +player.velocity.y >= boundary.position.y - padding && player.position.x- player.radius +player.velocity.x <=boundary.position.x+boundary.width + padding);
    
}

function openNav() {
  document.querySelector(".Snackbar").style.width = "20%";
  document.querySelector(".overlay").style.display = "block";
}

function closeNav() {
  document.querySelector(".Snackbar").style.width = "0%";
  console.log( document.querySelector(".overlay"));
  document.querySelector(".overlay").stye.display = "none";
}

function randomHelper(ghost) {
  if(ghost.velocity.x >0) {
    ghost.prevC.push('right');

  } else if(ghost.velocity.x <0) {
    ghost.prevC.push('left');

  } else if(ghost.velocity.y >0) {
    ghost.prevC.push('down');

  } else if(ghost.velocity.y <0) {
    ghost.prevC.push('up');
  }
}

function ChangeDirection(way, ghost) {
  switch(way) {
    case 'down':
      ghost.velocity.y = ghost.speed;
      ghost.velocity.x =0;
      break;
    
    case 'up':
      ghost.velocity.y = -ghost.speed;
      ghost.velocity.x =0;
      break;

    case 'right':
      ghost.velocity.y =0;
      ghost.velocity.x = ghost.speed;
      break;

    case 'left':
      ghost.velocity.y =0;
      ghost.velocity.x = -ghost.speed;
      break;
  }

  ghost.prevC = [];

}

function condition() {
    if(keys.ArrowUp.pressed && lastKey=== 'ArrowUp') {
        for(let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i];
            if(colliding({...player, velocity:{x:0,y:-ghost.speed}},boundary)) {
                player.velocity.y=0;
                break;
    
            }else {
                player.velocity.y=-2; 
            }
        }
       

       
    }  else if(keys.ArrowLeft.pressed && lastKey=== 'ArrowLeft') {
        for(let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i];
            if(colliding({...player, velocity:{x:-ghost.speed,y:0}},boundary)) {
                player.velocity.x=0;
                break;
    
            }else {
                player.velocity.x=-2; 
            }
        }
    } else if(keys.ArrowDown.pressed && lastKey=== 'ArrowDown') {
        for(let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i];
            if(colliding({...player, velocity:{x:0,y:ghost.speed}},boundary)) {
                player.velocity.y=0;
                break;
    
            }else {
                player.velocity.y=2; 
            }
        }
    } else if(keys.ArrowRight.pressed && lastKey=== 'ArrowRight') {
        for(let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i];
            if(colliding({...player, velocity:{x:ghost.speed,y:0}},boundary)) {
                player.velocity.x=0;
                break;
    
            }else {
                player.velocity.x=2; 
            }
        }
    }

}

let animationId;

function animation() {

   animationId = requestAnimationFrame(animation);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = "40px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, canvas.width/2+200, canvas.height/2);

    for(let i = boosters.length-1; 0<=i; i--) {
      const booster = boosters[i];
      booster.draw();
      if(Math.hypot(booster.position.x-player.position.x,booster.position.y-player.position.y)< booster.radius+ player.radius) {
        boosters.splice(i,1);
        ghosts.forEach(ghost => {
          ghost.scared = true;
          setTimeout(() => {
            ghost.scared = false;
          }, 5000);
        })
      }

    }
    for(let i = pieces.length-1; 0<=i;i--) {
        const piece = pieces[i];
        piece.draw();
        if(Math.hypot(piece.position.x-player.position.x,piece.position.y-player.position.y)< piece.radius+ player.radius) {
            pieces.splice(i,1);
            score+=1;
        }

    }


    if(pieces.length ==0) {
      // alert("WON GAME");
      document.querySelector("#writer").innerText = "YOU WON !";
      //document.querySelector("#button").style.display = "none";
      openNav();
       
        var audio = new Audio("mixkit-male-voice-cheer-2010.wav");
        audio.play();
      cancelAnimationFrame(animationId);
  
    }

  
    condition();   
    boundaries.forEach((boundary) => {
        boundary.draw();
        if(colliding(player,boundary)) {
            console.log("we are colliding");
            player.velocity.x=0;
            player.velocity.y=0;

        }
        
        
        });
       player.update();
        ghosts.forEach((ghost) => {
          ghost.update();
          let condition = ghost.scared;
          if( !condition && ( Math.hypot(ghost.position.x-player.position.x,ghost.position.y-player.position.y)< ghost.radius+ player.radius)) {
            document.querySelector("#writer").innerText = "YOU LOST !";
            //document.querySelector("#button").style.display = "block";
            openNav();
          
              var audio = new Audio("mixkit-player-losing-or-failing-2042.wav");
              audio.play();
            cancelAnimationFrame(animationId);
            // here add code to switch pages
            // alert("LOST GAME");
           
            // closeNav();
            // openNav();
            
          }
          
         const collisions = [];
          boundaries.forEach((boundary) => {
            if(colliding({...ghost, velocity:{x:5,y:0}},boundary) && (!collisions.includes("right"))) {
              collisions.push('right');
            }
            if(colliding({...ghost, velocity:{x:-5,y:0}},boundary) &&(!collisions.includes("left"))) {
              collisions.push('left');
            }
            if(colliding({...ghost, velocity:{x:0,y:-5}},boundary) && (!collisions.includes("up"))) {
              collisions.push('up');
            }
            if(colliding({...ghost, velocity:{x:0,y:5}},boundary)&&(!collisions.includes("down"))) {
              collisions.push('down');
            }
          })
          if(collisions.length > ghost.prevC.length) {
             ghost.prevC = collisions;
          }

          if(JSON.stringify(collisions) != JSON.stringify(ghost.prevC)) {
            
            randomHelper(ghost); // 

           const pathways = ghost.prevC.filter(collision => {
            return !collisions.includes(collision);
           });
          //  console.log({pathways});
          //  console.log(collisions);
          let index = Math.floor(Math.random() * pathways.length);
          const direction = pathways[index];

          ChangeDirection(direction,ghost);

          }
          


        });
       
       if(player.velocity.x >0) {
        player.rotation =0;
       } else if(player.velocity.x <0) {
        player.rotation = Math.PI;
       } else if(player.velocity.y <0) {
         player.rotation = Math.PI*1.5;
       } else if(player.velocity.y >0) {
         player.rotation = Math.PI/2;
       }
}

animation();


window.addEventListener('keydown',({key}) => {
    
    switch(key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed=true;
            lastKey = 'ArrowUp';
            break;

        case 'ArrowDown':
            keys.ArrowDown.pressed=true;
            lastKey = 'ArrowDown';
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true;
            lastKey = 'ArrowLeft';
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed=true;
            lastKey = 'ArrowRight';

            break;
    }
});

window.addEventListener('keyup',({key}) => {
    console.log(key);
    switch(key) {
        case 'ArrowUp':
            keys.ArrowUp.pressed=false;
            break;

        case 'ArrowDown':
            keys.ArrowDown.pressed=false;

            break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false;
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed=false;

            break;
    }
})

document.querySelector("#button").addEventListener("click", ()=> {
  window.location.reload();
})