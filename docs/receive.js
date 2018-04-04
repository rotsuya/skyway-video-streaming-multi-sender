window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const argObj = { audioCtx };

function workAroundAsync(argObj) {
    return new Promise((resolve, reject) => {
        const dummyPeer = new Peer({ key: APIKEY });
        dummyPeer.on('open', () => {
            const dummyRoom = dummyPeer.joinRoom(ROOM, {
                mode: 'sfu'
            });
            dummyRoom.on('close', () => {
                dummyPeer.disconnect();
                resolve(argObj);
            });
            dummyRoom.on('open', () => {
                dummyRoom.close();
            });
        });
    });
}

function streamAsync(argObj) {
    return new Promise((resolve, reject) => {
        const room = argObj.room;
        const regExp = new RegExp('^' + PARENT + '\-');

        room.on('stream', remoteStream => {
            if (!regExp.test(remoteStream.peerId)) {
                return;
            }
            const _argObj = argObj;
            console.log('onStream', remoteStream.peerId);
            _argObj.remoteStream = remoteStream;

            const video = document.createElement('video');
            video.classList.add('video');
            video.muted = true;
            video.playsinline = true;
            video.autoplay = true;
            video.id = remoteStream.peerId;
            document.getElementById('videos').appendChild(video);

            _argObj.video = video;

            tapScreenAsync(_argObj)
                .then(getAudioSourceAsync)
                .then(argObj => {
                    html.classList.remove('waitingUserAction');
                    html.classList.add('monitoring');

                    const source = argObj.source;
                    const audioCtx = argObj.audioCtx;
                    source.connect(audioCtx.destination);
                })
                .catch(error => {
                    console.error(error);
                    alert('Error has occurred. (' + error + ')');
                    location.href = './';
                });

        });
        room.on('peerLeave', remotePeerId => {
            if (!regExp.test(remotePeerId)) {
                return;
            }
            console.log('onPeerLeave', remotePeerId);
            // alert('Camera was closed.');
            // location.href = './';
            const _video = document.getElementById(remotePeerId);
            document.getElementById('videos').removeChild(_video);
        });
        resolve(argObj);
    });
}

function tapScreenAsync(argObj) {
    return new Promise((resolve, reject) => {
        html.classList.remove('waitingRemoteStream');
        html.classList.add('waitingUserAction');

        const remoteStream = argObj.remoteStream;
        const video = argObj.video;
        video.srcObject = remoteStream;

        const ua = window.navigator.userAgent.toLowerCase();

        if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
            const btnPlay = document.getElementById('btnPlay');
            btnPlay.addEventListener('click', () => {
                resolve(argObj);
            });
            return;
        }
        resolve(argObj);
    });
}

function getAudioSourceAsync(argObj) {
    return new Promise((resolve, reject) => {
        const remoteStream = argObj.remoteStream;
        const audioCtx = argObj.audioCtx;
        if (navigator.userAgent.search(/Chrome/) !== -1) {
            const audio = new Audio();
            audio.srcObject = remoteStream;
            audio.addEventListener('loadedmetadata', () => {
                argObj.source = audioCtx.createMediaStreamSource(remoteStream);
                resolve(argObj);
            });
            return;
        }
        argObj.source = audioCtx.createMediaStreamSource(remoteStream);
        resolve(argObj);
    });
}

newPeerAsync(argObj)
    .then(newPeerAsync)
    .then(joinRoomAsync)
    .then(streamAsync)
    .then(workAroundAsync);
