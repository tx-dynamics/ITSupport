import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import styles from './styles';
import Snackbar from 'react-native-snackbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DocumentPicker from 'react-native-document-picker';
import auth from '@react-native-firebase/auth';
import Entypo from 'react-native-vector-icons/Entypo';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import theme from '../../theme';
import Button from 'react-native-button';
import {Header} from 'react-native-elements';
import {dp} from '../../assets/images';
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pNo: '',
      password: '',
      fName: '',
      CompName: '',
      lName: '',
      email: '',
      Uid: '',
      imageuri: '',
      isLoading: false,
      currentemail: '',
      uri:
        'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png',
    };
  }
  componentDidMount() {
    const fname = this.props.navigation.getParam('fname');
    const lname = this.props.navigation.getParam('lname');
    const mail = this.props.navigation.getParam('email');
    const cell = this.props.navigation.getParam('cell');
    const img = this.props.navigation.getParam('img');
    console.log(fname, cell, lname, mail, img);
    this.setState({
      fName: fname,
      lName: lname,
      email: mail,
      pNo: cell,
      imageuri: img,
      currentemail: mail,
    });
  }
  imgePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState(
        {imageuri: res.uri, imgName: res.name},
        this.uploadmultimedia,
      );

      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };
  async uploadmultimedia() {
    console.log(this.state.imageuri);
    this.setState({loading: true});
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed')); // error occurred, rejecting
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', this.state.imageuri, true); // fetch the blob from uri in async mode
      xhr.send(null); // no initial data
    });

    var timestamp = new Date().getTime();
    var imageRef = storage().ref(`users/Dp/` + timestamp + '/');

    return imageRef
      .put(blob)
      .then(() => {
        blob.close();
        return imageRef.getDownloadURL();
      })
      .then(dwnldurl => {
        console.log(dwnldurl);
        this.setState({imageuri: dwnldurl});
      });
  }
  reauthenticate = currentPassword => {
    var user = auth().currentUser;
    var cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };
  async clickRegister() {
    const {
      fName,
      lName,
      email,
      pNo,
      password,
      imageuri,
      currentemail,
    } = this.state;
    const Password = await AsyncStorage.getItem('password');
    console.log(JSON.parse(Password));

    if (currentemail !== email) {
      this.reauthenticate(JSON.parse(Password))
        .then(() => {
          var user = auth().currentUser;
          user
            .updateEmail(email)
            .then(() => {
              console.log('Email updated!');
            })
            .catch(error => {
              console.log(error);
              return;
            });
        })
        .catch(error => {
          console.log(error);
          return;
        });
    }
    this.setState({loading: true});
    var regData = {
      firstName: fName,
      lastName: lName,
      email: email,
      Phone: pNo,
      Dp: imageuri,
    };
    const Uid = auth().currentUser.uid;
    this.setState({Uid});
    console.log('auth().currentUser=>>>', Uid);
    console.log('regData====>', regData);

    database()
      .ref('users/' + Uid)
      .update(regData)
      .then(res => {
        console.log('====>>>', res);
        this.setState({isLoading: false}, () =>
          this.props.navigation.navigate('Profile'),
        );
      })
      .catch(error => {
        var errorMessage = error.message;
        console.log(errorMessage);
        this.setState({loading: false}, () => {
          alert(errorMessage, 'HERe');
        });
      });
  }
  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        <Header
          backgroundColor={theme.colors.primary}
          containerStyle={{borderBottomWidth: 0}}
          leftComponent={
            <TouchableOpacity
              style={styles.backArrow}
              onPress={() => this.props.navigation.goBack()}>
              <Ionicons name="ios-arrow-back" size={20} color="white" />
            </TouchableOpacity>
          }
          centerComponent={<Text style={styles.textStyle}>Edit Profile</Text>}
        />

        <View
          style={{
            flex: 0.9,
            marginTop: 20,
            // backgroundColor: 'skyblue',
            // justifyContent: 'center',
          }}>
          <ImageBackground
            source={this.state.imageuri ? {uri: `${this.state.imageuri}`} : dp}
            borderRadius={65}
            style={styles.userImgStyle}>
            <TouchableOpacity onPress={this.imgePicker}>
              <Entypo name="edit" size={30} style={{alignSelf: 'flex-end'}} />
            </TouchableOpacity>
          </ImageBackground>
          <TextInput
            style={styles.Input}
            placeholder="First Name"
            onChangeText={text => this.setState({fName: text.trim()})}
            value={this.state.fName}
            placeholderTextColor={theme.colors.gray}
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.Input}
            placeholder="Last Name"
            onChangeText={text => this.setState({lName: text.trim()})}
            value={this.state.lName}
            placeholderTextColor={theme.colors.gray}
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={styles.Input}
            placeholder="Phone No "
            keyboardType={'number-pad'}
            value={this.state.pNo}
            placeholderTextColor="gray"
            onChangeText={pNo =>
              this.setState({pNo: pNo.replace(/\s/g, '')}, () => {
                console.log(this.state.pNo);
              })
            }
          />
          <TextInput
            style={styles.Input}
            placeholder="Email"
            keyboardType="default"
            // secureTextEntry={true}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            value={this.state.email}
            placeholderTextColor="gray"
            underlineColorAndroid="transparent"
            onChangeText={text => {
              this.setState({email: text.trim()});
            }}
          />
          {this.state.isLoading ? (
            <ActivityIndicator
              animating
              color={'white'}
              style={styles.buttonStyle}
            />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.buttonStyle}
              onPress={() =>
                this.setState({isLoading: true}, () => this.clickRegister())
              }>
              <Text style={{color: 'white', fontSize: 16}}>Save</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }
}

export default EditProfile;
