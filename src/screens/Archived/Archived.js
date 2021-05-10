import React, {Component} from 'react';
import {View, Text, ScrollView, FlatList, TouchableOpacity} from 'react-native';
// import {Calendar} from 'react-native-calendars';
import styles from './styles';
import Moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';
import theme from '../../theme';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';
class Archived extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      name: '',
      dat: [],
      data: [],
      admin: [],
      isAdmin: '',
    };
  }
  componentDidMount() {
    var curuser = auth().currentUser;
    console.log(curuser.providerData);
    this.setState({currentUser: curuser, name: curuser.displayName}, () => {
      const userData = database().ref('/Requests');
      userData.on('value', userData => {
        var li = [];
        userData.forEach(child => {
          if (
            child.val().id === curuser.uid &&
            child.val().cat === 'Resolved'
          ) {
            li.push({
              id: child.key,
              userId: child.val().id,
              title: child.val().Title,
              mes: child.val().Problem,
              status: child.val().Status,
              submittedTime: child.val().Kpi,
              date: child.val().CreatedAt,
              time: child.val().Time,
              kpi: child.val().Kpi,
              completed: child.val().Completed,
              name: child.val().name,
              cat: child.val().cat,
              solution: child.val().solution,
              email: child.val().email,
              Sol: child.val().Sol,
              image: child.val().Image,
            });
          }
        });
        this.setState({dat: li});
        // console.log('LI ====>', this.state.dat);
      });
    });
    this.adminData();
  }
  adminData() {
    var curuser = auth().currentUser;
    const user = database().ref('users/' + curuser.uid);
    user.on('value', user => {
      this.setState({isAdmin: user.val().usertype && user.val().usertype});
    });
    const add = database().ref('Requests');
    add.on('value', snapshot => {
      var data = [];
      // data = snapshot.val();
      snapshot.forEach(child => {
        if (child.val().cat === 'Resolved') {
          data.push({
            id: child.key,
            title: child.val().Title,
            mes: child.val().Problem,
            status: child.val().Status,
            submittedTime: child.val().Kpi,
            date: child.val().CreatedAt,
            time: child.val().Time,
            kpi: child.val().Kpi,
            completed: child.val().Completed,
            name: child.val().name,
            cat: child.val().cat,
            solution: child.val().solution,
            email: child.val().email,
            Sol: child.val().Sol,
            image: child.val().Image,
            userId: child.val().id,
          });
        }
      });
      this.setState({admin: data});
      console.log('Admin Data=====> \n', data);
      //
    });

    // const data = this.state.admin
  }

  renderPosts = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          margin: 10,
          borderBottomWidth: 2,
          borderColor: theme.colors.lightGray,
        }}>
        <Text style={styles.title}>{Moment(item.date).format('L')}</Text>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Notes', {
              item,
              isAdmin: this.state.isAdmin,
            })
          }
          style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.largeText}>{item.title}</Text>
          <AntDesign
            name="right"
            color={theme.colors.gray}
            size={20}
            style={{alignSelf: 'center'}}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.mediumText,
            {
              width: '85%',
              textAlign: 'left',
              color: theme.colors.gray,
              fontSize: 16,
              marginTop: 10,
            },
          ]}>
          {item.mes}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          <Text>{item.time}</Text>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                marginRight: 5,
                textAlign: 'left',
                color: theme.colors.greenColor,
              }}>
              {item.status}
            </Text>
            <Text
              style={{
                marginLeft: 5,
                textAlign: 'left',
                color: theme.colors.redColor,
              }}>
              {item.submittedTime}
            </Text>
            <View
              style={{
                borderColor: 'red',
                // borderWidth: 1,
                marginLeft: 15,
                // backgroundColor: 'skyblue',
                // borderRadius: 100,
                alignSelf: 'center',
                // border,
              }}>
              <Text
                style={{
                  textAlign: 'left',
                  color: theme.colors.redColor,
                }}>
                {item.completed}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <FlatList
          data={
            this.state.isAdmin === 'user' ? this.state.dat : this.state.admin
          }
          extraData={this.state.data}
          contentContainerStyle={{
            flexDirection: 'column',
            // alignSelf: 'center',
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderPosts}
          keyExtractor={(item, index) => item + index.toString()}
        />
      </View>
    );
  }
}

export default Archived;
