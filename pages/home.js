Array.from(document.querySelectorAll(".button_level")).forEach((b)=>{
    b.onclick=(e)=>{
    let level;
    if(b.innerText=="Hard")
        level=1;
    else
    {
        level=2;
    }
    location.href="game.html"+"?"+"level="+level;
    }
    });
   