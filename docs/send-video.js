const mediaConstraints = {
    audio: true,
    video: true
};
if (isMobile) {
    mediaConstraints.video = {
        advanced: [
            { facingMode: 'environment' }
        ]
    };
}

const video = document.getElementById('video');

const argObj = { localPeerId: generatePeerId(PARENT), mediaConstraints };

gUMAsync(argObj)
    .then(newPeerAsync)
    .then(joinRoomAsync)
    .then(() => {
        html.classList.remove('waitingLocalStream');
        html.classList.add('shooting');
    })
    .catch(error => {
        console.error(error);
        alert('Error has occurred. (' + error + ')');
        location.href = './';
    });
