import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { RTCPeerConnection, RTCIceCandidate, RTCSessionDescription, mediaDevices, MediaStream, RTCView } from 'react-native-webrtc';
import io from 'socket.io-client';

const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

const App: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pc = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:5000'); 

    pc.current = new RTCPeerConnection(configuration);

    pc.current.onaddstream = (event) => {
      setRemoteStream(event.stream);
    };

    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', event.candidate);
      }
    };

    socket.on('candidate', (candidate) => {
      pc.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('offer', (offer) => {
      pc.current?.setRemoteDescription(new RTCSessionDescription(offer));
    });

    socket.on('answer', (answer) => {
      pc.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    return () => {
      socket.disconnect();
      pc.current?.close();
    };
  }, []);

  const startCall = async () => {
    const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
    setLocalStream(stream);
    stream.getTracks().forEach(track => pc.current?.addTrack(track, stream));

    pc.current?.createOffer()
      .then(offer => {
        pc.current?.setLocalDescription(offer);
        io('http://localhost:5000').emit('offer', offer); // actualiza esta URL con la de tu servidor
      });
  };

  const answerCall = () => {
    pc.current?.createAnswer()
      .then(answer => {
        pc.current?.setLocalDescription(answer);
        io('http://localhost:5000').emit('answer', answer); // actualiza esta URL con la de tu servidor
      });
  };

  const endCall = () => {
    pc.current?.getSenders().forEach((sender: any) => pc.current?.removeTrack(sender));
    setLocalStream(null);
    setRemoteStream(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {localStream && <RTCView streamURL={localStream.toURL()} />}
      {remoteStream && <RTCView streamURL={remoteStream.toURL()} />}
      <Button onPress={startCall} title="Start Call" />
      <Button onPress={answerCall} title="Answer Call" />
      <Button onPress={endCall} title="End Call" />
    </View>
  );
};

export default App;
