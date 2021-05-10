import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styles from './styles';
import {Header} from 'react-native-elements';
import Archived from '../Archived';
import Active from '../Active';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import database from '@react-native-firebase/database';
// const initialLayout = {width: Dimensions.get('window').width};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {Active: true, Archived: false, isAdmin: false};
  }
  componentDidMount() {
    var curuser = auth().currentUser;

    const user = database().ref('users/' + curuser.uid);
    console.log(user);

    user.on('value', user => {
      this.setState({isAdmin: user.val().usertype && user.val().usertype});
    });
  }

  changeTab = index => {
    if (index === 1) {
      this.setState({
        Active: true,
        Archived: false,
      });
    }
    if (index === 2) {
      this.setState({
        Active: false,
        Archived: true,
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
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
                onPress={() => this.props.navigation.navigate('Profile')}>
                <EvilIcons name="user" color="white" size={35} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  // backgroundColor: 'tomato',
                  width: '170%',
                  marginLeft: 15,
                }}>
                Dashboard
              </Text>
            </View>
          }
          rightComponent={
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => this.props.navigation.navigate('Search')}>
                <EvilIcons name="search" color="white" size={35} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={() => this.props.navigation.navigate('Filter')}>
                <AntDesign name="filter" color="white" size={35} />
              </TouchableOpacity>
              {this.state.isAdmin === 'admin' ? (
                <Text></Text>
              ) : (
                <TouchableOpacity
                  style={{marginLeft: 5}}
                  onPress={() => this.props.navigation.navigate('NewRequest')}>
                  <Ionicons name="add" color="white" size={35} />
                </TouchableOpacity>
              )}
            </View>
          }
        />

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.changeTab(1);
            }}
            style={[
              styles.categoryContainer,
              {
                backgroundColor: theme.colors.primary,
                borderBottomWidth: this.state.Active ? 3 : 0,
                borderColor: this.state.Active ? 'white' : theme.colors.primary,
              },
            ]}>
            <Text style={[styles.mediumText, {color: 'white'}]}>ACTIVE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              this.changeTab(2);
            }}
            style={[
              styles.categoryContainer,
              {
                backgroundColor: theme.colors.primary,
                borderBottomWidth: this.state.Archived ? 3 : 0,
                borderColor: this.state.Archived
                  ? 'white'
                  : theme.colors.primary,
              },
            ]}>
            <Text style={[styles.mediumText, {color: 'white'}]}>Archived</Text>
          </TouchableOpacity>
        </View>

        {this.state.Active && <Active navigation={this.props.navigation} />}
        {this.state.Archived && <Archived navigation={this.props.navigation} />}
      </View>
    );
  }
}

export default Home;
