const word = document.getElementById('word');
const btnSendVideo = document.getElementById('btnSendVideo');
const btnSendAudio = document.getElementById('btnSendAudio');
const btnReceive = document.getElementById('btnReceive');
const storedWord = localStorage.word;

function getHash() {
    const formValue = word.value;
    const encoded = encodeURIComponent(formValue);
    return encoded.replace(/[^A-Za-z0-9_-]/g, '');
}

function launchApp(url) {
    localStorage.word = word.value;
    const hash = getHash();
    location.href = url + '#' + hash;
}

function enableButton() {
    const hash = getHash();
    if (hash.length > 0) {
        btnSendVideo.disabled = false;
        btnSendAudio.disabled = false;
        btnReceive.disabled = false;
    } else {
        btnSendVideo.disabled = true;
        btnSendAudio.disabled = true;
        btnReceive.disabled = true;
    }
}

if (storedWord) {
    word.value = storedWord;
    enableButton();
}

btnSendVideo.addEventListener('click', () => {
    launchApp('send-video.html');
});

btnSendAudio.addEventListener('click', () => {
    launchApp('send-audio.html');
});

btnReceive.addEventListener('click', () => {
    launchApp('receive.html');
});

word.addEventListener('input', enableButton);
