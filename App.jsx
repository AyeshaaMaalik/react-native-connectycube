import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import { mediaDevices, RTCPeerConnection, RTCView } from 'react-native-webrtc';

const CREDENTIALS = {
  appId: 8011, 
  authKey: 'U-Htqg5RVjK-j3S', 
  authSecret: 'Uqtb4xpWjuTUbwv', 
};

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const App = () => {
  const [localStream, setLocalStream] = useState(null);
  const peerConnection = useRef(new RTCPeerConnection(configuration));

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Camera and Audio permission granted');
          return true;
        } else {
          console.log('Permission denied');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; 
  };

  useEffect(() => {
    ConnectyCube.init(CREDENTIALS);

    requestPermissions().then((granted) => {
      if (granted) {
        mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
          },
        })
        .then(stream => {
          setLocalStream(stream);
          stream.getTracks().forEach(track => peerConnection.current.addTrack(track, stream));
        })
        .catch(error => {
          console.error('Error accessing media devices:', error);
        });
      }
    });
  }, []);

  const startCall = async () => {
    try {
      const sessionDescription = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(sessionDescription);
    } catch (error) {
      console.error('Error starting the call:', error);
    }
  };

  return (
    <View>
      <Text>Welcome to ConnectyCube App</Text>
      {localStream && (
        <RTCView streamURL={localStream.toURL()} style={{ width: '100%', height: 400 }} />
      )}
      <Button title="Start Call" onPress={startCall} />
    </View>
  );
};

export default App;
