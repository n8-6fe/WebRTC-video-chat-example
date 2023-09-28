// create two variables for the camera/audio streams from useres
let localStream;
let remoteStream;
let peerConnection;

// stun server answers a req for your ip, for ICE candidates
let servers = {
    iceServers: [
        {
            urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}



// init gets called as soon as user loads the page
let init = async () => {
    // get users audio/video and display to DOM 
    // getUserMedia() method prompts the user for permission to use a media input 
    //  which produces a MediaStream with tracks containing the requested types of media
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});

    document.getElementById('user-1').srcObject = localStream;
}

let createPeerConnection = async (sdpType) => {
    // this represents a webrtc connection b/w local and remote
    peerConnection = new RTCPeerConnection()

    remoteStream = new MediaStream();
    document.getElementById('user-2').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        })
    }

    // when offer is created we make reqs to STUN server, ice candidates will be generated
    peerConnection.onicecandidate = async (event) => {
        if(event.candidate) {
            document.getElementById(sdpType).value = JSON.stringify(peerConnection.localDescription);
        }
    } 


}


// create offer
let createOffer = async () => {

    createPeerConnection('offer-sdp');
    // peerConnection will always have local desc and remote desc
    // here we add the offer/first/local SDP to peerConnection
    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    document.getElementById('offer-sdp').value = JSON.stringify(offer);
}


let createAnswer = async () => {

    createPeerConnection('answer-sdp');
    let offer = document.getElementById('offer-sdp').value;
    if(!offer) {
        return alert("Get offer from other first.")
    }
    offer = JSON.parse(offer);
    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    document.getElementById('answer-sdp').value = JSON.stringify(answer)
}

let addAnswer = async () => {
    let answer = document.getElementById('answer-sdp').value
    if(!answer) {
        return alert("Get answer from other first.")
    }

    answer = JSON.parse(answer);

    if(!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
    }
}

init();

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswer);
document.getElementById('add-answer').addEventListener('click', addAnswer);



