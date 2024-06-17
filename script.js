console.log("Hello JavaScript")
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let responce = await a.text();
    // console.log(responce);
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    // console.log(a);
    let song = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split(`${folder}`)[1]);
        }

    }
    return song
}

// create function for play music

const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);
    currentsong.src = `${currFolder}` + track
    if (!pause) {
        currentsong.play()
        document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
        pause
        </span>`;
    }
    // currentsong.play();

    document.querySelector(".songinfo").innerHTML = `<b>${decodeURI(track)}</b>`;
    document.querySelector(".songtime").innerHTML = `<b>00:00 / 00:00</b>`;
}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let responce = await a.text();
    // console.log(responce);
    let div = document.createElement("div");
    div.innerHTML = responce;
    // console.log(div)
    let ancors = document.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".card-img-songs");
    let folders = [];
    Array.from(ancors).forEach(async (e) => {


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            //get the meta data of the and folders
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let responce = await a.json();
            // console.log(responce)

            cardcontainer.innerHTML = cardcontainer.innerHTML + ` <div data-folder="${folder}" class="card">

                        <div class="overlay-play-icon">
                            <img src="play.png" alt="Play">
                        </div>

                        <img src="/songs/${folder}/cover.jpeg"" alt="" id="card-img">
                        <h2>${responce.title}</h2>
                        <p>${responce.description}</p>
                    </div>`;


        }
    })
}




async function main() {
    // get the liat of all songs
    songs = await getsongs("/songs/cs");
    playmusic(songs[0], true)
    // console.log(songs)

    //Display all the albums on the songs
    displayAlbums();

    // show all the songs in the playlist
    let songurl = document.querySelector(".music-playlist").getElementsByTagName("ul")[0];
    songurl.innerHTML = "";
    for (const song of songs) {
        songurl.innerHTML = songurl.innerHTML + `    <li>
  <div><img src="mudic.png" alt="music"></div>
  <div class="info"><p>${song.replaceAll("%20", " ")}</p>
  <p><b><i> --  Shivam -- </i></b></p></div>
  <div><i class="fa-regular fa-circle-play"></i></div> </li>`;
    }

    // attach an each song

    Array.from(document.querySelector(".music-playlist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


    // attach an evant lisenaer to play , next and previews 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
            pause
            </span>`;
        }
        else {
            currentsong.pause()
            document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
            play_arrow
        </span>`;
        }
    })


    // attach eventistener to card to play song

    Array.from(document.querySelectorAll(".card")).forEach((e) => {

        e.addEventListener("click", () => {
            //attach eventlistener to card open left music bar for mobile divices
            document.querySelector(".left").style.left = "0";

            if (currentsong.paused) {
                currentsong.play()
                document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
            pause
            </span>`;
            }
            else {
                currentsong.pause()
                document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
        play_arrow
    </span>`;
            }
        })
    })


    // Attach an evantlistener to take a current time 

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circal").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // Attach addevent lisener to move seekbar curcle
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circal").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })

    //Add EventListener for Hamburger

    document.querySelector("#hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })



    // attach eventlistener overlay-play-icon (play icon) for click and play the song
    document.querySelector(".overlay-play-icon").addEventListener("click", () => {
        // console.lo("ha bhai mai chal rha hu")
        if (currentsong.paused) {
            currentsong.play()
            document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
            pause
            </span>`;
        }
        else {
            currentsong.pause()
            document.querySelector(".play").innerHTML = `<span class="material-symbols-outlined">
        play_arrow
    </span>`;
        }
    })

    // Attach EventLitener For close
    document.querySelector("#close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-200%";
    })

    //Attach an eveant listener to previews  
    document.querySelector(".previews").addEventListener("click", () => {
        currentsong.pause()
        // console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    //Attach an eveant listener to next  
    document.querySelector(".next").addEventListener("click", () => {
        // console.log("dfwdif")
        currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    // Attach Evant Listener to mute the volume

    document.querySelector("#img").addEventListener("click", (e) => {
        // console.log(e.target)
        if (e.target.src.includes("volume.png")) {
            e.target.src = e.target.src.replace("volume.png", "mute.png")
            currentsong.volume = 0;
            document.querySelector("input").value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.png", "volume.png")
            currentsong.volume = .10;
            document.querySelector("input").value = 50;
        }
    })


    // Attach EvantListener For Volume
    document.querySelector("input").addEventListener("change", (e) => {
        // console.log(e , e.target , e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    //Load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        // console.log(e)
        e.addEventListener("click", async (item) => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);

        })
    })




}
main();

// show the volume percentaeges 
let inputValue = document.querySelector("input");
inputValue.addEventListener("change", () => {
    // console.log(inputValue.value)
    document.querySelector("#volume-percentages").innerHTML = `${inputValue.value}%`;
    document.querySelector("#volume-percentages").style.color = "red";
    document.querySelector("#volume-percentages").style.fontWeight = "800";
    document.querySelector("#volume-percentages").style.fontSize = "18px";
})