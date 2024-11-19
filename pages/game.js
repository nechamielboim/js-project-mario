
//------------------ משתנים גלובליים -----------------//

let level = parseInt(new URLSearchParams(location.search).get("level"));
if(level==1)
{
    if(localStorage.getItem('topHard')==null)
    {
        localStorage.setItem('topHard',0);
    }
}
else{
    if(localStorage.getItem('topEasy')==null)
    {
        localStorage.setItem('topEasy',0);
    }
}
let jumpHeight=window.innerHeight/3;


let canvas = document.querySelector("#gameCanvas");
let ctx = canvas.getContext('2d');
let backgroundImage = new Image();
backgroundImage.src = "../images/background.png";
let backgroundX = -canvas.width;
let speed = 2.5;
let trees = [];
let treeImages = ["../images/trees/1.png", "../images/trees/2.png", "../images/trees/3.png", "../images/trees/4.png", "../images/trees/5.png"];
let player = document.querySelector("#player");
let index = 0;
let isJumping = false;
let jumpStartTime = 0;
let gravity = 0;
let jumpDuration = 700;
let sequence = level;
let timer=60;
let jumpAudio = document.querySelector("#jump");
let failAudio = document.querySelector("#fail");
let winAudio = document.querySelector("#win");
let coinAudio = document.querySelector("#coin");
let isGameActive = true;
let isGamePaused = false;
let srcCoin="../images/coin.png";
let coins=[];
let numCoins=0;
let start=1;
//--------------------------------------------//



//------------------פונקציית סטופר-----------------//
function stopper() {
    if (!isGameActive) return;
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    let time="0"+minutes+":";
    if(seconds<10)
    {
    time+="0";
    }
    time+=seconds;
   
    if(timer<=10)
    {
        document.querySelector("#screenTimer").style.color="#ff0000";
        setTimeout(off,500);
        setTimeout(on,1000);

    }
    else{
        document.querySelector("#screenTimer").style.color="#696e6a";
    }
    document.querySelector("#screenTimer").innerHTML = time;
    timer--;
    if (timer == 0) {
        if(level==1)
        {
            if(numCoins>=localStorage.getItem('topHard'))
                {
                    localStorage.setItem('topHard',numCoins)
                    let topGif = document.querySelector("#topGif");
                    topGif.style.display = "block";
                }
                else{
                    let winGif = document.querySelector("#winGif");
                    winGif.style.display = "block";
                }
        }
        else{
            if(numCoins>=localStorage.getItem('topEasy'))
                {
                    localStorage.setItem('topEasy',numCoins)
                    let topGif = document.querySelector("#topGif");
                    topGif.style.display = "block";
                }

            else{
                let winGif = document.querySelector("#winGif");
                winGif.style.display = "block";
            }
        }         
        if (winAudio) {
            winAudio.play();
        }
        finishGame();
    }
}
function off()
{
    document.querySelector("#screenTimer").style.display = "none";

}
function on()
{
    document.querySelector("#screenTimer").style.display = "block";

}
let timerInterval = setInterval(stopper, 1000);
//--------------------------------------------//



//------------------הוזזת הרקע והעצים-----------------//
function update() 
{
    if(start)
    {
       start=0;   
       if(level==1)
       {
          document.querySelector("#top").innerHTML="top:"+localStorage.getItem('topHard');
       }
       else
       {
          document.querySelector("#top").innerHTML="top:"+localStorage.getItem('topEasy');
       }
    }
    if (!isGameActive) return; 
    backgroundX += speed;
    if (backgroundX >= 0) {
        backgroundX = -canvas.width;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);
    drawTrees();
    moveTrees();
    if(coins)
    {
        drawCoins();
        moveCoins();
    }    
    updatePlayerPosition();
    checkTrees();
    checkCoins();
    if (isGameActive) {
        requestAnimationFrame(update);
    }
}
//--------------------------------------------//



//------------------החלפת תמונות השחקן-----------------//
function switchImage() {
    if (!isGameActive) return;

    if (index == 0) {
        player.src = "../images/1.png";
        index = 1;
    } else {
        player.src = "../images/2.png";
        index = 0;
    }
}
//--------------------------------------------//



//----------------------------------------------עצים----------------------------------------------//

//------------------יצירת עץ-----------------//
function createTree() {
    let srcTree = treeImages[Math.floor(Math.random() * treeImages.length)];
    let h = Math.floor(Math.random() * 35) + 20;
    let newTree = {
        image: new Image(),
        x: -100,
        y: canvas.height - h,
        height: h,
        width: 0
    };
    newTree.image.src = srcTree;
    newTree.image.onload = () => {
        newTree.width = (newTree.image.naturalWidth / newTree.image.naturalHeight) * newTree.height;
        trees.push(newTree);
    }
    setTimeout(createCoin,sequence*3*1000/2);
}
//--------------------------------------------//



//------------------הוזזת עץ-----------------//
function moveTrees() {
    for (let i = 0; i < trees.length; i++) {
        trees[i].x += speed;
        if (trees[i].x > canvas.width) {
            trees.splice(i, 1);
            i--;
        }
    }
}
//--------------------------------------------//



//------------------ציור העצים על המסך-----------------//
function drawTrees() {
    for (let tree of trees) {
        ctx.drawImage(tree.image, tree.x, tree.y, tree.width, tree.height);
    }
}
//--------------------------------------------//



//----------------------------------------------מטבעות----------------------------------------------//
//------------------יצירת מטבע-----------------//
function createCoin() 
{
    let place = Math.floor(Math.random() * (canvas.height - 80)) + 30; 
    let newCoin = {
        image: new Image(),
        x: -100,
        y: canvas.height -place,
        width:8,
        height:8
    };
    newCoin.image.src = srcCoin;
    newCoin.image.onload = () => {    
        coins.push(newCoin);
    }
}
//--------------------------------------------//



//------------------הוזזת מטבע-----------------//
function moveCoins() {
    for (let i = 0; i < coins.length; i++) {
        coins[i].x += speed;
        if (coins[i].x > canvas.width) {
            coins.splice(i, 1);
            i--;
        }
    }
}
//--------------------------------------------//



//------------------ציור המטבעות על המסך-----------------//
function drawCoins() {
    for (let coin of coins) {
        ctx.drawImage(coin.image, coin.x, coin.y, coin.width, coin.height);
    }
}
//--------------------------------------------//



backgroundImage.onload = update;
let s = setInterval(switchImage, 150);
let c = setInterval(createTree, sequence * 1000);



//------------------הקפצת השחקן והחזרתו למשטח-----------------//
document.addEventListener('keydown', function(event) {
    if (!isGameActive) return;

    if ((event.code === 'Space' || event.code === 'ArrowUp') && !isJumping) {
        startJump();
    }
});

function startJump() {
    if (jumpAudio) {
        jumpAudio.play();
    }
    isJumping = true;
    jumpStartTime = Date.now();
}

function updatePlayerPosition() {
    if (isJumping) {
        let passedTime = Date.now() - jumpStartTime;
        let jumpProgress = passedTime / jumpDuration;
        let height = +4 * jumpHeight * (jumpProgress - jumpProgress * jumpProgress);

        if (passedTime >= jumpDuration) {
            height = 0;
            isJumping = false;
        }

        player.style.bottom = height + "px";
    } else {
        player.style.bottom = "0px";
    }
}
//--------------------------------------------//



//------------------בדיקה האם השחקן נתקל בעץ-----------------//
function checkTrees() {
    if (!isGameActive) return; 

    let newPlayer = {
        x: canvas.width * 0.92,
        y: canvas.height - parseInt(player.style.bottom) - player.offsetHeight * 0.25,
        width: player.offsetWidth * 0.25,
        height: player.offsetHeight * 0.25,
    };

    for (let tree of trees) {
        let newTree = {
            x: tree.x,
            y: tree.y,
            width: tree.width,
            height: tree.height,
        };

        if (newPlayer.x < newTree.x + newTree.width &&
            newPlayer.x + newPlayer.width > newTree.x &&
            newPlayer.y < newTree.y + newTree.height &&
            newPlayer.y + newPlayer.height > newTree.y) {
            fail();
            break;
        }
    }
}
//--------------------------------------------//



//------------------בדיקה האם השחקן נתקל במטבע-----------------//
function checkCoins() {
    if (!isGameActive) return; 

    let newPlayer = {
        x: canvas.width * 0.88,
        y: canvas.height - parseInt(player.style.bottom) - player.offsetHeight * 0.25,
        width: player.offsetWidth * 0.25,
        height: player.offsetHeight * 0.25,
    };

    for (let i = 0; i < coins.length; i++) {
        let newCoin = {
            x: coins[i].x,
            y: coins[i].y,
            width: coins[i].width,
            height: coins[i].height,
        };
        let distance;
        if(level==1)
        {
            distance = 5; 
        }
        else
        {
            distance = 20; 
        }
        if (
            newPlayer.x < newCoin.x + newCoin.width + distance &&
            newPlayer.x + newPlayer.width > newCoin.x - distance &&
            newPlayer.y < newCoin.y + newCoin.height + distance &&
            newPlayer.y + newPlayer.height > newCoin.y - distance
        ) {
            catchCoin(i); 
            break;
        }
    }
}
//--------------------------------------------//



//------------------כשלון-----------------//
function fail() {
    if (failAudio) {
        failAudio.play();
    }
    setTimeout(finishGame, 500);
    let endGif = document.querySelector("#endGif");
    endGif.style.display = "block";
    isJumping = true;
    if (jumpAudio) {
        jumpAudio.remove();
    }
}
//--------------------------------------------//



//------------------תפיסת מטבע-----------------//

function catchCoin(coinIndex) {
    numCoins++;
    coins.splice(coinIndex, 1);
    if(numCoins>9)
    {
        document.querySelector("#numCoins").innerHTML = " X " + numCoins;
    }
    else{
        document.querySelector("#numCoins").innerHTML = "X " + numCoins;

    }
    document.querySelector("#numCoins").innerHTML = "X " + numCoins;
    document.querySelector("#numCoins").style.color = "#696e6a";
    if (coinAudio) coinAudio.play();
}
//--------------------------------------------//



//------------------סיום משחק-----------------//
function finishGame() {

    document.querySelector("#newGame").style.display="block";
    player.style.display="none";
    isGameActive = false; 
    speed = 0;
    clearInterval(s);
    clearInterval(c);
    clearInterval(timerInterval);
    if (failAudio) {
        failAudio.remove();
    }
   
   setTimeout(stopAudio,3000)

    document.removeEventListener('keydown', function(event) {
        if ((event.code === 'Space' || event.code === 'ArrowUp') && !isJumping) {
            startJump();
        }
    });
}
function stopAudio()
{
    if(winAudio)
        {
            winAudio.remove();
        }
}
//--------------------------------------------//
