# WebRTC-video-chat-example

A real time video chatting example using WebRTC. This was to learn how WebRTC/Real-Time works in general. Users have to manually input offer and answer SDP's, no signaling. 

## Description

Used this as a way to learn how WebRTC works. Basically, one peer (local) sends offer SDP (Session Description Protocol) that is like an offer to connect. 
The second peer (remote) agrees and sends their answer SDP.
This creates a Peer to Peer connection but they also both make calls to STUN servers and send each other their IP's. 
Then data is sent to one another, in this case, the user media which is video.


### Source Materal 
* This example was followed by Dennis Ivy's series on YouTube. 
