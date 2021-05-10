import React, {Component} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  AsyncStorage,
} from 'react-native';
import theme from '../../theme';
import {user} from '../../assets/images';
import Moment from 'moment';
import {Header} from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {sendNotificationFirebaseAPI} from '../../RequestPushMsg';

class ChatDetail extends Component {
  //create the instance for your interval

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      sending: false,
      show: false,
      recieverId: '',
      email: '',
      id: '',
      adminid: '1234',
      userId: '',
      singleConversation: [],
      isAdmin: '',
      token: '',
      adminUid: '08ZBWjsjTbYutcvs39pMPyQrztS2',
      usertoken: '',
      name: '',
      token2: '',
      token3: '',
      adminUid2: 'QnzlUCplLYNXHvluFdSMFg03sHr2',
      adminUid3: 'jQa6YtgO8PTNEP8fc53ShRPkS2h2',
    };
  }

  componentDidMount = async () => {
    var isAdmin = this.props.navigation.getParam('isAdmin');
    var userId = this.props.navigation.getParam('userId');
    var name = this.props.navigation.getParam('name');
    console.log('isAdmin=>>', isAdmin, '\n', name);
    if (isAdmin === 'admin') {
      var data = database().ref('users/' + auth().currentUser.uid);
      console.log('Admin UID', auth().currentUser.uid);
    } else var data = database().ref('users/' + this.state.adminUid);
    var userdata = database().ref('users/' + userId);

    //user token
    userdata.on('value', user => {
      if (user.val()) {
        console.log('user==>', user.val().pushToken && user.val().pushToken);
      }
      this.setState({usertoken: user.val().pushToken});
    });
    //admin tokens
    data.on('value', user => {
      if (user.val()) {
        console.log('Admin', user.val().pushToken && user.val().pushToken);
      }
      this.setState({token: user.val().pushToken});
    });

    this.setState({isAdmin, userId, name});
    this.getData(userId);
  };

  getData(id) {
    console.log('id here naa \n', id);
    const user = database().ref('Chat/' + id);
    user.on('value', msg => {
      var chat = [];
      msg.forEach(child => {
        chat.push({
          content: child.val().content,
          recieverId: child.val().recieverId,
          send_id: child.val().send_id,
          id: child.key,
          ri: child.val().ri,
        });
      });
      this.setState({singleConversation: chat});
    });
  }

  sendmsg = async () => {
    const {
      usertoken,
      token2,
      token3,
      name,
      message,
      userId,
      adminid,
      singleConversation,
      isAdmin,
      token,
    } = this.state;

    var today = new Date();
    if (isAdmin === 'admin') {
      var item = {
        content: message,
        recieverId: userId,
        send_id: adminid,
        ri: Moment(today.getHours()) + ':' + Moment(today.getMinutes()),
      };
      this.setState({
        singleConversation: [...this.state.singleConversation, item],
      });
    } else {
      var item = {
        content: message,
        recieverId: adminid,
        send_id: userId,
        ri: Moment(today.getHours()) + ':' + Moment(today.getMinutes()),
      };
      this.setState({
        singleConversation: [...this.state.singleConversation, item],
      });
    }

    await database()
      .ref('Chat/' + userId)
      .push(item)
      .then(res => {
        this.setState({
          sending: false,
          message: '',
        });
        isAdmin === 'admin'
          ? sendNotificationFirebaseAPI(usertoken, 'Admin', message)
          : sendNotificationFirebaseAPI(token, name, message, token2, token3);
      })
      .catch(error => {
        var errorMessage = error.message;
        console.log(errorMessage);
        this.setState({loading: false}, () => {
          alert(errorMessage, 'HERe');
        });
      });
  };

  renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1}} key={index}>
        <View
          style={
            (styles.messageContainer,
            {
              borderColor: 'white',
              borderWidth: 1,
              padding: 10,
              marginTop: 5,
              borderRadius: 10,
              alignSelf:
                this.state.isAdmin === 'admin'
                  ? this.state.adminid === item.send_id
                    ? 'flex-end'
                    : 'flex-start'
                  : this.state.userId === item.send_id
                  ? 'flex-end'
                  : 'flex-start',
              backgroundColor:
                this.state.isAdmin === 'admin'
                  ? this.state.adminid === item.send_id
                    ? theme.colors.primary
                    : 'lightgray'
                  : this.state.userId === item.send_id
                  ? theme.colors.primary
                  : 'lightgray',
            })
          }>
          <Text
            style={{
              textAlign:
                this.state.isAdmin === 'admin'
                  ? this.state.adminid === item.send_id
                    ? 'right'
                    : 'left'
                  : this.state.userId === item.send_id
                  ? 'right'
                  : 'left',
              color: 'white',
            }}>
            {item.content}
          </Text>
        </View>
        <Text
          style={{
            textAlign: 'right',
            color: 'grey',
            fontSize: 12,
            // padding: 10,
            margin: 15,
            marginTop: 0,
          }}>
          {item.ri}
        </Text>
      </View>
    );
  };

  render() {
    const {message} = this.state;

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          backgroundColor={theme.colors.primary}
          centerComponent={
            <Text style={{color: 'white', fontSize: 20}}>Chat</Text>
          }
        />
        <FlatList
          style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            padding: 15,
            backgroundColor: 'white',
            elevation: 10,
            shadowColor: '#BDBDBD',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowRadius: 5,
            shadowOpacity: 1.0,
            // borderWidth: 1,
            borderColor: theme.colors.lightGray,
            borderRadius: 10,
          }}
          data={this.state.singleConversation}
          extraData={this.state}
          renderItem={this.renderItem}
          extraData={this.state}
          keyExtractor={(item, index) => {
            item + index.toString();
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            backgroundColor: 'white',
          }}>
          <TextInput
            style={{
              width: '75%',
              marginTop: 10,
              marginLeft: 7,
              marginBottom: 5,
              marginRight: 7,
              padding: 15,
              backgroundColor: 'white',
              elevation: 10,
              shadowColor: '#BDBDBD',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowRadius: 5,
              shadowOpacity: 1.0,
              // borderWidth: 1,
              borderColor: theme.colors.lightGray,
              borderRadius: 10,
              color: 'black',
            }}
            placeholder={'I am .....................'}
            value={message}
            onChangeText={text => this.setState({message: text})}
          />
          <TouchableOpacity
            onPress={() => {
              this.setState({sending: true}, () => {
                this.sendmsg();
              });
            }}
            activeOpacity={0.7}
            // disabled={message === '' ? true : false}
            style={{
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            {this.state.sending ? (
              <ActivityIndicator
                animating
                color={'white'}
                style={{
                  //   marginLeft: 5,
                  borderRadius: 7,
                  backgroundColor: theme.colors.primary,
                  padding: 12,
                  color: 'white',
                  // fontFamily: Fonts.FontAwesome,
                }}
              />
            ) : (
              <Text
                style={{
                  //   marginLeft: 5,
                  borderRadius: 7,
                  backgroundColor: theme.colors.primary,
                  padding: 12,
                  color: 'white',
                  // fontFamily: Fonts.FontAwesome,
                }}>
                send
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  messageContainer: {
    margin: 5,
    padding: 5,
    flexWrap: 'wrap',
  },
});

export default ChatDetail;
