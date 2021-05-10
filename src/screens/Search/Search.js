import React, {Component} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
// import {Calendar} from 'react-native-calendars';
import styles from './styles';
import Moment from 'moment';

import theme from '../../theme';
import {Header, SearchBar} from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: '',
      dat: [],
      data: [],
      search: '',
      isAdmin: '',
    };
  }
  updateSearch = search => {
    this.setState({search});
    let text = search.toLowerCase();
    let data = this.state.dat;
    const newData = data.filter(srch => {
      return srch.name.toLowerCase().match(text);
    });
    console.log(newData);
    this.setState({data: newData});
  };
  componentDidMount() {
    var curuser = auth().currentUser;
    console.log(curuser.providerData);
    this.setState({currentUser: curuser}, () => {
      const userData = database().ref('Requests');
      userData.on('value', userData => {
        var li = [];
        userData.forEach(child => {
          if (child.val().id === curuser.uid) {
            li.push({
              id: child.key,
              title: child.val().Title,
              mes: child.val().Problem,
              status: child.val().Status,
              submittedTime: child.val().Kpi,
              date: child.val().CreatedAt,
              time: child.val().Time,
              kpi: child.val().Kpi,
              completed: child.val().Completed,
              name: curuser.displayName,
            });
            this.setState({dat: li});
          }
        });

        console.log('LI ====>', this.state.dat);
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
        });
      });
      this.setState({dat: data});
      // console.log('Admin Data=====> \n', data);
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.largeText}>{item.name}</Text>
          <AntDesign
            name="right"
            color={theme.colors.gray}
            size={20}
            style={{alignSelf: 'center'}}
          />
        </View>
        <Text style={styles.mediumText}>{item.mes}</Text>
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
            <Text
              style={{
                marginLeft: 15,
                color: theme.colors.redColor,
              }}>
              {item.completed}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Header
          backgroundColor={theme.colors.primary}
          containerStyle={{borderBottomWidth: 0, alignItems: 'center'}}
          leftComponent={
            <View
              style={{
                // backgroundColor: 'tomato',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => this.props.navigation.navigate('Profile')}>
                <EvilIcons name="user" color="white" size={35} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Home')}>
                <Text
                  style={{
                    fontSize: 20,
                    color: 'white',
                    // backgroundColor: 'tomato',
                    width: '200%',
                    marginLeft: 15,
                  }}>
                  Dashboard
                </Text>
              </TouchableOpacity>
            </View>
          }
          rightComponent={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => this.props.navigation.navigate('Search')}>
                <EvilIcons name="search" color="white" size={35} />
              </TouchableOpacity>
              {/* <TouchableOpacity style={{marginLeft: 5}}>
                <AntDesign name="filter" color="white" size={35} />
              </TouchableOpacity> */}
              {this.state.isAdmin === 'user' ? (
                <TouchableOpacity
                  style={{marginLeft: 5}}
                  onPress={() => this.props.navigation.navigate('NewRequest')}>
                  <Ionicons name="add" color="white" size={35} />
                </TouchableOpacity>
              ) : (
                <Text></Text>
              )}
            </View>
          }
        />
        <View>
          <SearchBar
            placeholder="Search"
            value={this.state.search}
            onClear={() => this.setState({data: []})}
            containerStyle={styles.searchContainer}
            inputContainerStyle={styles.inputStyle}
            onChangeText={search => {
              this.updateSearch(search);
            }}
          />
        </View>
        <FlatList
          data={this.state.data}
          extraData={this.state.dat}
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

export default Search;
