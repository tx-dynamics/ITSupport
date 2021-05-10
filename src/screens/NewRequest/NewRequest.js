import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  PermissionsAndroid,
} from 'react-native';
import styles from './styles';
import Moment from 'moment';
import {Header} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import Button from 'react-native-button';
import DocumentPicker from 'react-native-document-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

export default class NewRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      problem: '',
      imageuri: '',
      imgName: '',
      isLoading: false,
      uid: '',
      cat: 'Pending',
      email: '',
      load: false,
    };
  }

  imgePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState(
        {imageuri: res.uri, imgName: res.name},
        this.uploadmultimedia,
        // this.viewFile(res.uri),
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
    // console.log(this.state.imageuri);
    this.setState({load: true});
    // this.setState({loading: true});
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
    var imageRef = storage()
      .ref()
      .child(`users/Requests/` + timestamp + `/`);
    return imageRef
      .put(blob)
      .then(() => {
        blob.close();
        return imageRef.getDownloadURL();
      })
      .then(dwnldurl => {
        console.log(dwnldurl);
        this.setState({imageuri: dwnldurl, load: false});
      });
  }
  async clickRegister() {
    const user = auth().currentUser;

    const {title, imageuri, imgName, problem} = this.state;

    var myDate = new Date();
    var newDate = Moment(myDate);

    var splittedDate = {
      year: newDate.get('year'),
      month: newDate.get('month'),
      date: newDate.get('date'),
      hour: newDate.get('hour'),
      minute: newDate.get('minute'),
      second: newDate.get('second'),
      millisecond: newDate.get('millisecond'),
    };

    var regData = {
      id: user.uid,
      name: user.displayName,
      Title: title,
      Image: imageuri,
      ImageName: imgName,
      Problem: problem,
      createdAt: `${splittedDate.date},${splittedDate.month},${splittedDate.year}`,
      Kpi: '00:30',
      Status: 'Submitted',
      Completed: '0%',
      Time: `${splittedDate.hour}:${splittedDate.minute} pm`,
      cat: this.state.cat,
      solution: 'No',
      email: user.email,
      Sol: 'No solution right now',
    };

    const Uid = auth().currentUser.uid;
    console.log('auth().currentUser=>>>', Uid);
    console.log('regData====>', regData);

    database()
      .ref('Requests/')
      .push(regData)
      .then(res => {
        this.setState({isLoading: false}, () =>
          this.props.navigation.navigate('Home'),
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
  requestPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Files Permission',
          message:
            'App needs access to your files ' + 'so you can see the file.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('We can now read files');
        this.imgePicker();
      } else {
        console.log('File read permission denied');
      }
      return granted;
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    return (
      <View style={styles.main}>
        <Header
          backgroundColor={theme.colors.primary}
          containerStyle={{borderBottomWidth: 0}}
          leftComponent={
            <View
              style={{
                // backgroundColor: 'tomato',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => this.props.navigation.goBack()}>
                <Ionicons
                  name="arrow-back"
                  color="white"
                  size={25}
                  //   style={{margin: 10}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  // backgroundColor: 'tomato',
                  width: '350%',
                  marginLeft: 15,
                }}>
                Add New Request
              </Text>
            </View>
          }
          rightComponent={
            <View style={{flexDirection: 'row'}}>
              {/* <TouchableOpacity style={{marginLeft: 5}}> */}
              <Entypo name="attachment" color="white" size={28} />
              {/* </TouchableOpacity> */}
            </View>
          }
        />
        <View
          style={{
            marginTop: 20,
            alignSelf: 'center',
            width: '95%',
            // backgroundColor: 'tomato',
          }}>
          <Text style={styles.largeText}> Title * </Text>
          <TextInput
            style={styles.body}
            // placeholder="Enter phone number"
            onChangeText={text => this.setState({title: text})}
            value={this.state.title}
            placeholderTextColor={theme.colors.gray}
            underlineColorAndroid="transparent"
          />
          <Text style={styles.mediumText}> Describe Problem * </Text>
          <TextInput
            style={styles.body}
            // placeholder="Enter phone number"
            onChangeText={text => this.setState({problem: text})}
            value={this.state.problem}
            placeholderTextColor={theme.colors.gray}
            underlineColorAndroid="transparent"
          />
        </View>
        <Text
          style={{
            width: '95%',
            alignSelf: 'center',
            marginTop: 15,
            fontWeight: 'bold',
            fontSize: 16,
          }}>
          Attachment :
        </Text>
        {this.state.load ? (
          <ActivityIndicator
            animating
            color={theme.colors.primary}
            style={{
              marginLeft: 25,
              // backgroundColor: 'tomato',
              alignSelf: 'flex-start',
              // width: '95%',
              padding: 10,
              marginTop: 10,
              marginBottom: 10,
            }}
          />
        ) : this.state.imageuri ? (
          <View>
            <ImageBackground
              source={{uri: this.state.imageuri}}
              style={{
                borderRadius: 10,
                //   padding: 4,
                height: 100,
                width: 100,
                //   alignSelf: 'center',
                margin: 10,
              }}>
              <MaterialIcons
                style={{alignSelf: 'flex-end'}}
                name="cancel"
                size={20}
                color={theme.colors.redColor}
                onPress={() => this.setState({imageuri: ''})}
              />
            </ImageBackground>
            <Text
              style={{
                marginLeft: 5,
                color: theme.colors.gray,
                width: '95%',
                alignSelf: 'center',
              }}>
              {this.state.imgName}
            </Text>
          </View>
        ) : (
          <View style={{margin: 15}}>
            <TouchableOpacity
              style={{marginLeft: 5}}
              onPress={this.requestPermission}>
              <Entypo name="attachment" color={theme.colors.gray} size={28} />
            </TouchableOpacity>
          </View>
        )}

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
              this.setState({loading: true});
              this.clickRegister();
            }}>
            Submit
          </Button>
        )}
      </View>
    );
  }
}
