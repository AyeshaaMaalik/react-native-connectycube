import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import ConnectyCube from 'react-native-connectycube';

const CREDENTIALS = {
  appId: 8011, 
  authKey: 'U-Htqg5RVjK-j3S', 
  authSecret: 'Uqtb4xpWjuTUbwv', 
};

const App = () => {
  useEffect(() => {
    ConnectyCube.init(CREDENTIALS);
  }, []);

  return (
    <View>
      <Text>Welcome to ConnectyCube App</Text>
    </View>
  );
};

export default App;
