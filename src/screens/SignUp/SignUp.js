import React, {Component, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import theme from '../../theme';
import Snackbar from 'react-native-snackbar';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {Header} from 'react-native-elements';
import {fcmService} from '../../service/FCMService';
import {localNotificationService} from '../../service/LocalNotificationService';
class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pNo: '',
      fName: '',
      lname: '',
      email: '',
      password: '',
      cnfrmPswrd: '',
      isLoading: false,
      isSigningUp: false,
    };
  }
  componentDidMount() {
    if (auth().currentUser) {
      console.log(auth().currentUser);
      this.props.navigation.push('Home');
    } else {
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
    }
  }

  onSignup = async () => {
    const {uName, email, password, cnfrmPswrd, lname} = this.state;
    console.log(uName, email, password, cnfrmPswrd, lname);

    if (
      uName !== '' &&
      email !== '' &&
      password !== '' &&
      cnfrmPswrd !== '' &&
      lname !== ''
    ) {
      if (password === cnfrmPswrd) {
        try {
          // AsyncStorage.setItem('email', JSON.stringify(email));
          AsyncStorage.setItem('password', JSON.stringify(password));
          console.log('email======>', email, '\n password====>', password);
        } catch (error) {
          console.log(error.message);
        }
        this.clickRegister();

        try {
        } catch (err) {
          Snackbar.show({
            text: JSON.stringify(err.message),
            backgroundColor: 'black',
          });
        }
      } else {
        Snackbar.show({
          text: 'Passwords did not match',
          backgroundColor: 'black',
        });
      }
      // this.props.navigation.navigate('Login');
    } else {
      this.setState({isLoading: false});
      Snackbar.show({
        text: 'Kindly Fill the Fields for Sign Up',
        backgroundColor: 'black',
      });
    }
  };

  async clickRegister() {
    const {fName, lname, password, email, pNo} = this.state;

    var credential = auth.EmailAuthProvider.credential(email, password);
    console.log('credential', credential);
    var token = await AsyncStorage.getItem('token');

    var regData = {
      firstName: fName,
      lastName: lname,
      email: email,
      usertype: 'user',
      Phone: pNo,
      createdAt: new Date().toISOString(),
      pushToken: token,
    };
    console.log('auth().currentUser', auth().currentUser);
    console.log('registration data===>', regData);

    //  Registration part
    if (auth().currentUser) {
      //console.log(firebase.auth().currentUser)
      // var credential = auth.EmailAuthProvider.credential(email, password);
      alert('User Already Registered Kindly Sign In');
    } else {
      console.log('I am here');
      auth()
        .createUserWithEmailAndPassword(email, password)
        .then(newUser => {
          if (newUser) {
            auth()
              .currentUser.updateProfile({
                displayName: regData.firstName + ' ' + regData.lastName,
              })
              .then(() => {
                database()
                  .ref('users/')
                  .child(auth().currentUser.uid)
                  .set(regData)
                  .then(() => {
                    auth()
                      .signInWithEmailAndPassword(email, password)
                      .then(res => {
                        console.log(auth().currentUser);
                        this.props.navigation.navigate('Home');
                      })
                      .catch(res => {
                        alert(res.message);
                      });
                  });
              });
          }
        })
        .catch(error => {
          var errorMessage = error.message;
          console.log(errorMessage);
          this.setState({loading: false}, () => {
            alert(errorMessage, 'HERe');
          });
        });
    }
  }

  render() {
    const {pNo, password, email, cnfrmPswrd, fName, lname} = this.state;
    return (
      <ScrollView style={styles.container}>
        <Header
          backgroundColor={'white'}
          containerStyle={{borderBottomWidth: 0}}
        />

        <View style={styles.LoginContainer}>
          <Text
            style={[
              styles.largeText,
              {
                color: 'black',
                fontSize: 26,
                marginBottom: 15,
                alignSelf: 'center',
              },
            ]}>
            IT SUPPORT
          </Text>
          <Text style={[styles.title, styles.leftTitle]}>Sign Up</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="First Name*"
              onChangeText={text => this.setState({fName: text.trim()})}
              value={fName}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Last Name*"
              onChangeText={text => this.setState({lname: text.trim()})}
              value={lname}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Email*"
              onChangeText={text => this.setState({email: text.trim()})}
              value={email}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Phone Number*"
              onChangeText={text => this.setState({pNo: text})}
              value={pNo}
              keyboardType="phone-pad"
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Password*"
              secureTextEntry={true}
              onChangeText={text => this.setState({password: text})}
              value={password}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="Confirm Password*"
              onChangeText={text => this.setState({cnfrmPswrd: text})}
              value={cnfrmPswrd}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          {this.state.isLoading ? (
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
                this.setState({isLoading: true}, () => {});
                this.onSignup();
              }}>
              Sign Up
            </Button>
          )}
          <View
            style={{
              flexDirection: 'row',
              // alignSelf: 'center',
            }}>
            <Text style={[styles.mediumText, {color: 'black', fontSize: 13}]}>
              Have an acccount?
            </Text>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}>
              <Text
                style={[
                  styles.mediumText,
                  {color: 'black', fontWeight: 'bold'},
                ]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default SignUp;
