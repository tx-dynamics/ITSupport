import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from '../Login/styles';
import Button from 'react-native-button';
import {Header} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import theme from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
class ForgetPass extends Component {
  constructor(props) {
    super(props);
    this.state = {loading: false, email: '', password: ''};
  }
  //   passwordReset(email) {
  //     return
  //   }
  login = () => {
    const {email, password} = this.state;
    const user = auth().currentUser;
    if (email !== '') {
      auth()
        .sendPasswordResetEmail(email)
        .then(res => {
          this.setState({loading: false}, () =>
            this.props.navigation.navigate('Login'),
          );
          Snackbar.show({
            text: 'Password Reset link is sent on your email',
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
          <Text style={[styles.title, styles.leftTitle]}>Forget Password</Text>
          <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              placeholder="Email"
              onChangeText={text => this.setState({email: text})}
              value={this.state.email}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View>
          {/* <View style={styles.InputContainer}>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={text => this.setState({password: text})}
              value={this.state.password}
              placeholderTextColor={theme.colors.gray}
              underlineColorAndroid="transparent"
            />
          </View> */}
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
              Send Email
            </Button>
          )}
        </View>
      </View>
    );
  }
}

export default ForgetPass;
