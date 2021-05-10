import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import styles from './styles';
import {Header} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import style from './styles';
import {dp} from '../../assets/images';
import theme from '../../theme';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: 'IT',
      lname: 'Support',
      cname: 'Technobrave',
      cell: '+9231300000',
      email: 'itsupport@email.com',
      img: '',
      currentUser: '',
    };
  }
  componentDidMount = async () => {
    this.data();
  };
  data = async () => {
    var curuser = auth().currentUser;
    console.log(curuser.providerData);

    let url = await storage()
      .ref()
      .child(`users/` + `/Dp/`)
      .getDownloadURL();
    console.log('URL=======>', url);
    // this.setState({img: url});
    this.setState({currentUser: curuser}, () => {
      const userData = database().ref('users/' + this.state.currentUser.uid);
      userData.on('value', userData => {
        if (userData.val()) {
          console.log(userData.val().Dp);
          // var str = userData.val().location.add;
          // var tempAdd = str.split(',')[3] + ',' + str.split(',')[4];

          this.setState({
            fname: userData.val().firstName,
            lname: userData.val().lastName,
            email: userData.val().email,
            cell: userData.val().Phone,
            img: userData.val().Dp,
          });
          console.log('img here', this.state.img);
        }
      });
    });
  };
  signout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log(' sign out!');
        this.setState({loading: false}, () =>
          this.props.navigation.navigate('SignUp'),
        );
        Snackbar.show({
          text: `Bye ${this.state.currentUser.displayName} `,
          backgroundColor: 'black',
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  render() {
    const {fname, lname, cname, cell, email} = this.state;
    return (
      <ScrollView style={style.container}>
        <Header
          backgroundColor={theme.colors.primary}
          containerStyle={{borderBottomWidth: 0}}
        />
        <View style={style.picback}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              color="white"
              size={30}
              style={{margin: 10}}
            />
          </TouchableOpacity>
          <Image
            source={this.state.img ? {uri: `${this.state.img}`} : dp}
            style={style.userImgStyle}
          />
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('EditProfile', {
                fname: fname,
                lname,
                email,
                cell,
                img: this.state.img,
              })
            }>
            <View style={style.edit}>
              <FontAwesome5 name="user-edit" color="black" size={35} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={style.InputContainer}>
          <Text style={style.mediumText}>First Name*</Text>
          <Text style={style.body}>{fname}</Text>
        </View>
        <View style={style.InputContainer}>
          <Text style={style.mediumText}>Last Name*</Text>
          <Text style={style.body}>{lname}</Text>
        </View>
        <View style={style.InputContainer}>
          <Text style={style.mediumText}>Email*</Text>
          <Text style={style.body}>{email}</Text>
        </View>

        <View style={style.InputContainer}>
          <Text style={style.mediumText}>Mobile no*</Text>
          <Text style={style.body}>{cell}</Text>
        </View>
        <TouchableOpacity
          style={{flexDirection: 'row', margin: 15}}
          onPress={this.signout}>
          <MaterialIcons name="logout" size={30} />
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 20,
              marginLeft: 5,
              fontWeight: 'bold',
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
