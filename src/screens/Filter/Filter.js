import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  Picker,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  FlatList,
} from 'react-native';
import styles from './styles';
import {Header} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../theme';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';
import Moment from 'moment';
export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dat: [],
      isAdmin: '',
      admin: [],
      stores: [
        {id: 'Search By Filter', no: 'Search By Filter'},
        {id: 'Fixed', no: 'Fixed'},
        {id: 'Resolving', no: 'Resolving'},
        {id: 'Pending', no: 'Pending'},
      ],
      storeArr: [],
      filter: '',
      filterData: [],
    };
  }
  componentDidMount() {
    var curuser = auth().currentUser;
    const user = database().ref('users/' + curuser.uid);
    user.on('value', user => {
      this.setState({isAdmin: user.val().usertype && user.val().usertype});
    });
    console.log('USer id', curuser.uid);
    this.setState({currentUser: curuser, name: curuser.displayName}, () => {
      const userData = database().ref('/Requests');
      userData.on('value', userData => {
        if (this.state.isAdmin === 'user') {
          var li = [];
          userData.forEach(child => {
            if (child.val().id === curuser.uid)
              li.push({
                id: child.val().id,
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
              });
            this.setState({dat: li, filterData: li});
          });

          console.log('User ====>', li);
        }
      });
    });
    this.adminData();
  }
  adminData() {
    var curuser = auth().currentUser;

    const add = database().ref('Requests');
    add.on('value', snapshot => {
      if (this.state.isAdmin === 'admin') {
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
            cat: child.val().cat,
          });
        });
        this.setState({filterData: data, admin: data});
        console.log('Admin Data=====> \n', this.state.admin);
      }
      //
    });

    // const data = this.state.admin
  }
  setInput = value => {
    this.setState({filter: value});
    const data =
      this.state.isAdmin === 'admin' ? this.state.admin : this.state.dat;
    console.log('Value====>', value);

    const newData = data.filter(srch => {
      return srch.cat.toLowerCase().match(value.toLowerCase());
    });

    console.log('Filter Data====>', newData);
    console.log('user Data====>', this.state.dat);
    this.setState({filterData: newData});
  };
  renderPosts = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          flex: 1,
          margin: 10,
          borderBottomWidth: 2,
          borderColor: theme.colors.lightGray,
          //   flexDirection: 'row',
        }}>
        <TouchableOpacity
          //   onPress={() => this.props.navigation.navigate('Notes')}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: 'blue',
          }}>
          <Text style={styles.largeText}>{item.name}</Text>
          <Text
            style={{
              alignSelf: 'center',
              marginTop: 20,
            }}>{`${Moment(item.date).format('L')} ${item.time}`}</Text>
        </TouchableOpacity>
        <Text style={{marginTop: 10}}>{item.status}</Text>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.conatiner}>
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
                  //   backgroundColor: 'tomato',
                  width: '190%',
                  marginLeft: 15,
                }}>
                Notes
              </Text>
            </View>
          }
          rightComponent={
            <View style={{marginRight: 10}}>
              <Entypo name="attachment" color="white" size={28} />
            </View>
          }
        />

        <View
          style={{
            width: '90%',
            // backgroundColor: 'blue',
            alignSelf: 'center',
            borderBottomWidth: 2,
            borderColor: theme.colors.primary,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <Picker
            selectedValue={this.state.filter}
            style={{
              width: '100%',
              borderRadius: 5,
              height: 35,
              color: 'black',
            }}
            // prompt={'Select No of stores'}
            placeholder={'Select Stores'}
            onValueChange={value => {
              this.setState(
                {
                  filterData:
                    this.state.isAdmin === 'admin'
                      ? this.state.admin
                      : this.state.dat,
                  filter: value,
                },
                () => {
                  this.setInput(value);
                },
              );
            }}>
            {this.state.stores &&
              this.state.stores.map((item, index) => {
                switch (item.id) {
                  case item.id === '0':
                    return (
                      <Picker.Item
                        key={index}
                        label={item.no}
                        value={item.id}
                      />
                    );
                  default:
                    return (
                      <Picker.Item
                        key={index}
                        label={item.no}
                        value={item.id}
                      />
                    );
                }
              })}
          </Picker>
        </View>
        <FlatList
          data={this.state.filterData}
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
