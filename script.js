const inputSong = document.getElementById("inputSong");
const searchSong = document.getElementById("search-button");
const fancyResult = document.getElementById("fancy-result");
const singleLyrics = document.getElementById("single-lyrics");
const lyricsContainer = document.getElementById("lyrics");
const lyricsTitle = document.querySelector("#single-lyrics h2");
let songInfo = {};
// API Url
const apiURL = 'https://api.lyrics.ovh';


//search lyrcis by click button
searchSong.addEventListener("click", function() {
    getOutput();
});

//search lyrcis y enter key
inputSong.addEventListener('keypress', setQuery);

function setQuery(event) {
    if (event.keyCode == 13) {
        getOutput();
    }
}
// search input functionality
function getOutput() {
    if (inputSong.value == "") {
        alert("Please enter a song name");
    } else {
        fancyResult.innerHTML = "";
        fetchMusic(inputSong.value);
        toggleElement(singleLyrics, fancyResult);
        songInfo.inputSong = inputSong.value;
        inputSong.value = "";
    }
}
//Load lyrics from api
async function loadSongByTitle(searchValue) {
    const res = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await res.json();
    return data;
}

//display data into html body
function fetchMusic(searchValue) {
    const lyrics = loadSongByTitle(searchValue);
    lyrics.then((lyrics) => {
        const musicList = lyrics.data;
        for (let i = 0; i < 10; i++) {
            const lyricsElement = musicList[i];
            const artistName = lyricsElement.artist.name;
            const songTitle = lyricsElement.title;
            songInfo.cover = lyricsElement.album.cover;
            songInfo.songLink = lyricsElement.link;
            fancyResult.innerHTML += `<div class="single-result row align-items-center my-3 p-3">
                                <div class="col-md-3">
                                    <img src = '${songInfo.cover}' alt='cover' >
                                </div>
                                <div class="col-md-6">
                                    <h3 class="lyrics-name">${songTitle}</h3>
                                    <p class="author lead">songInfo by <span>${artistName}</span></p>
                                </div>
                                <div class="col-md-3 text-md-right text-center">
                                    <button onclick="getLyrics('${artistName}','${songTitle}')" class="btn btn-success">Get Lyrics</button>
                                </div>
                                </div>`;
        }
    });
}

//Load lyrics
async function loadLyrics(artistName, title) {
    const res = await fetch(`${apiURL}/v1/${artistName}/${title}`);
    const data = await res.json();
    return data;
}

//getLyrics by artistName and title
function getLyrics(artistName, title) {
    toggleElement(fancyResult, singleLyrics);
    const lyrics = loadLyrics(artistName, title);

    lyrics.then((lyric) => {
        if (lyric.lyrics) {
            lyricsContainer.innerHTML = lyric.lyrics;
        } else {
            lyricsContainer.innerHTML = "Sorry! Lyrics not available.";
        }
        lyricsTitle.innerHTML = title + " - " + artistName;
    });
}

//change Element display state
function toggleElement(hideElement, displayElement) {
    hideElement.style.display = "none";
    displayElement.style.display = "block";
}