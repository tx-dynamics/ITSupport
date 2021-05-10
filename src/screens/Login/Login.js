import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  Platform,
} from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import {Header} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Snackbar from 'react-native-snackbar';
import theme from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {fcmService} from '../../service/FCMService';
import {localNotificationService} from '../../service/LocalNotificationService';
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, email: '', password: ''};
  }
  login = () => {
    const {email, password} = this.state;
    const user = auth().currentUser;
    if (email !== '' && password !== '') {
      try {
        // AsyncStorage.setItem('email', JSON.stringify(email));
        AsyncStorage.setItem('password', JSON.stringify(password));
        console.log('\n password====>', password);
      } catch (error) {
        console.log(error.message);
      }
      // return;
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          console.log('User account created & signed in!');
          this.setState({loading: false}, () => {
            this.onSendToken();
          });
          Snackbar.show({
            text: `Welcome Back `,
            backgroundColor: theme.colors.primary,
            duration: Snackbar.LENGTH_LONG,
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({loading: false});
          Snackbar.show({
            text: err.message,
            backgroundColor: 'black',
            duration: Snackbar.LENGTH_LONG,
          });
        });
    } else {
      this.setState({loading: false});
      Snackbar.show({
        text: 'Kindly Fill all the fields',
        backgroundColor: 'black',
      });
    }
  };
  componentDidMount = () => {
    try {
      fcmService.registerAppWithFCM();
      fcmService.register(onRegister, onNotification, onOpenNotification);
      localNotificationService.configure(onOpenNotification);

      function onRegister(token) {
        console.log(token);
        AsyncStorage.setItem('token', token);
      }

      function onNotification(notify) {
        console.log('[App] onNotification: ', notify);
        const options = {
          soundName: 'default',
          playSound: true, //,
          // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
          // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
        };
        localNotificationService.showNotification(
          0,
          notify.title,
          notify.body,
          notify,
          options,
        );
      }

      function onOpenNotification(notify) {
        console.log('[App] onOpenNotification: ', notify);
        () => this.props.navigation.navigate('Chat');
      }
      // this.onSendToken();
      return () => {
        console.log('[App] unRegister');
        fcmService.unRegister();
        localNotificationService.unregister();
      };
    } catch (err) {
      console.log(err);
    }
  };
  onSendToken = async () => {
    var token = await AsyncStorage.getItem('token');
    try {
      database()
        .ref('users/' + auth().currentUser.uid + '/')
        .update({
          pushToken: token,
          userPlatform: Platform.OS == 'ios' ? 'IOS' : 'ANDROID',
        });
      console.log('i am here');
      this.props.navigation.navigate('Home');
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={theme.colors.primary}
          containerStyle={{borderBottomWidth: 0}}
        />
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => this.props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <View style={styles.LoginContainer}>
          <Text
            style={[
              styles.largeText,
              {
                color: 'white',
                fontSize: 26,
                marginBottom: 15,
                alignSelf: 'center',
              },
            ]}>
            IT SUPPORT
          </Text>
          <Text style={[styles.title, styles.leftTitle]}>Login In</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Email"
              onChangeText={text => this.setState({email: text.trim()})}
              value={this.state.email}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          {this.state.loading ? (
            <ActivityIndicator
              animating
              color={'white'}
              style={styles.loginContainer}
            />
          ) : (
            <Button
              containerStyle={styles.loginContainer}
              style={styles.loginText}
              onPress={() => {
                this.setState(
                  {loading: true},
                  //  () =>
                  // this.props.navigation.navigate('Home'),
                );
                this.login();
              }}>
              Log in
            </Button>
          )}
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('ForgetPass')}>
              <Text style={[styles.title, {marginRight: 20}]}>
                Forget Password ?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
