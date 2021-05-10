import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import MainNav from './src/navigation';
import messaging from '@react-native-firebase/messaging';
console.disableYellowBox = true;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
        // setLoading(false);
      });
  }

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <MainNav />
      </SafeAreaView>
    );
  }
}

export default App;
