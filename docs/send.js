const platform = navigator.platform;
const isIos = platform === 'iPhone' || platform === 'iPad' || platform === 'iPod';
const isAndroid = /Android/.test(navigator.userAgent);
const isMobile = isIos || isAndroid;

function generatePeerId(prefix) {
    const time = Date.now().toString(36);
    const random = Math.floor(Math.random() * Math.pow(36, 4)).toString(36);
    return [PARENT, time, random].join('-');
}

function gUMAsync(argObj) {
    return new Promise((resolve, reject) => {
        const mediaConstraints = argObj.mediaConstraints;
        navigator.mediaDevices.getUserMedia(mediaConstraints)
            .then(localStream => {
                video.srcObject = localStream;
                argObj.localStream = localStream;
                resolve(argObj);
            })
            .catch(error => {
                reject(error);
            })
    });
}

