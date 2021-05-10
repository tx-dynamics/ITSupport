import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Picker,
  ImageBackground,
  PermissionsAndroid,
} from 'react-native';
import Moment from 'moment';
import Button from 'react-native-button';
import styles from './styles';
import {Header} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import theme from '../../theme';
import database from '@react-native-firebase/database';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
export default class Notes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      pic: false,
      load: false,
      title: 'integeration respose 404',
      device: 'From IOS Device',
      createdBy: 'Bahwaya Ghusai',
      createdAt: '3/18/2021 2:37 PM',
      Accountable: 'Sumit Joshi',
      AssignTo: 'Brett Hungerford',
      kpi: '00:31',
      completed: '100%',
      Close: '3/18/2021 2:37 PM',
      cat: 'Pending',
      Sol: 'I am here',
      pre: 'Yes',
      isAdmin: '',
      stores: [
        {id: 'Select Category', no: 'Select Category'},
        {id: 'Resolved', no: 'Resolved'},
        {id: 'In Progress', no: 'In Progress'},
        {id: 'Pending', no: 'Pending'},
      ],
      storeArr: [],
      category: '',
      sol: [
        {id: 'Select Option', no: 'Select Option'},
        {id: 'Yes', no: 'Yes'},
        {id: 'No', no: 'No'},
        {id: 'Maybe', no: 'Maybe'},
      ],
      solution: '',
      storeSol: [],
      loading: false,
      id: '',
      tim: '',
      img: '',
      newimage: '',
      userId: '',
    };
  }
  componentDidMount() {
    // const name = auth().currentUser.displayName;
    const item = this.props.navigation.getParam('item');
    const isAdmin = this.props.navigation.getParam('isAdmin');
    this.setState({
      title: item.title,
      createdAt: item.createdAt,
      kpi: item.kpi,
      completed: item.completed,
      Close: item.createdAt,
      createdBy: item.name,
      isAdmin,
      id: item.id,
      cat: item.cat,
      Sol: item.Sol,
      solution: item.solution,
      category: item.cat,
      tim: item.time,
      email: item.email,
      img: item.image,
      userId: item.userId,
      name: item.name,
    });
    console.log('========>', item.name);
  }
  setInput = value => {
    this.setState({storeArr: Array(value).fill(''), category: value});
    console.log('Value====>', this.state.category);
  };
  setSol = value => {
    this.setState({storeSol: Array(value).fill(''), solution: value});

    console.log('Value====>', this.state.solution);
  };
  update() {
    const data = {
      cat: this.state.category,
      solution: this.state.solution,
      Sol: this.state.Sol,
      Image: this.state.newimage,
    };
    console.log(data.cat);
    database()
      .ref('Requests/')
      .child(this.state.id)
      .update(data)
      .then(res => {
        console.log('====>>>', res);
        this.setState({isLoading: false}, () =>
          this.props.navigation.navigate('Home'),
        );
      })
      .catch(error => {
        var errorMessage = error.message;
        console.log(errorMessage);
        this.setState({loading: false}, () => {
          alert(errorMessage);
        });
      });
  }
  viewFile(img) {
    if (img) {
      const localFile = `${
        RNFS.DocumentDirectoryPath
      }/${new Date().toISOString()}.jpg`.replace(/:/g, '-');
      const options = {
        fromUrl: img,
        toFile: localFile,
      };
      RNFS.downloadFile(options)
        .promise.then(() =>
          FileViewer.open(localFile)
            .then(() => {
              this.setState({pic: false});
              console.log('Image show');
            })
            .catch(error => {
              // error
              this.setState({pic: false});
            }),
        )
        .then(() => {
          this.setState({pic: false});
          // success
        })
        .catch(error => {
          this.setState({pic: false});
          // error
        });
    } else {
      this.setState({pic: false});
      alert('Image Not Found');
    }
  }
  imgePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      this.setState(
        {newimage: res.uri},
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
    console.log(this.state.newimage, '\n', 'here');
    this.setState({load: true});
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response); // when BlobModule finishes reading, resolve with the blob
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed')); // error occurred, rejecting
      };
      xhr.responseType = 'blob'; // use BlobModule's UriHandler
      xhr.open('GET', this.state.newimage, true); // fetch the blob from uri in async mode
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
        this.setState({newimage: dwnldurl, load: false});
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
    const {
      userId,
      name,
      id,
      pic,
      img,
      device,
      title,
      createdAt,
      createdBy,
      Accountable,
      AssignTo,
      kpi,
      cat,
      completed,
      Close,
      Sol,
      pre,
      isAdmin,
    } = this.state;
    return (
      <ScrollView style={styles.container}>
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
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={{right: 10}}
                onPress={() =>
                  this.props.navigation.navigate('ChatDetail', {
                    isAdmin,
                    userId,
                    name,
                  })
                }>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  color="white"
                  size={28}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => {
                  this.setState({pic: true});
                  this.viewFile(img);
                }}>
                {pic ? (
                  <ActivityIndicator
                    animating
                    color={'white'}
                    // style={styles.loginContainer}
                  />
                ) : (
                  <Entypo name="attachment" color="white" size={28} />
                )}
              </TouchableOpacity>
            </View>
          }
        />
        <Text style={styles.title}> Title * </Text>
        <Text
          style={{
            marginLeft: 20,
            fontSize: 16,
            fontWeight: 'bold',
            marginTop: 10,
          }}>
          {title}
        </Text>
        <Text
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: 5,
            color: 'skyblue',
            fontSize: 12,
          }}>
          Request Describe
        </Text>
        <Text
          style={{
            width: '90%',
            alignSelf: 'center',
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 20,
          }}>
          {device}
        </Text>
        <View
          style={{
            borderTopWidth: 5,
            marginTop: 15,
            // backgroundColor: 'tomato',
            width: '90%',
            alignSelf: 'center',
            borderColor: theme.colors.gray,
            borderBottomWidth: 5,
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text style={{color: theme.colors.gray}}>Created By:</Text>
            <Text style={{color: 'black'}}>{createdBy}</Text>
          </View>
          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text style={{color: theme.colors.gray}}>Email:</Text>
            <Text style={{color: 'black'}}>{this.state.email}</Text>
          </View>
          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text style={{color: theme.colors.gray}}>Created At:</Text>
            <Text style={{color: 'black'}}>
              {`${Moment(createdAt).format('L')}  ${this.state.tim}`}
            </Text>
          </View>

          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text style={{color: theme.colors.gray}}>Assigned To:</Text>
            <Text style={{color: 'black'}}>{AssignTo}</Text>
          </View>

          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 10,
            }}>
            <Text style={{color: theme.colors.gray}}>Request Close Date:</Text>
            <Text style={{color: 'black'}}>{`${Moment(createdAt).format(
              'L',
            )}  ${this.state.tim}`}</Text>
          </View>
          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
        </View>
        {this.state.isAdmin === 'admin' ? (
          this.state.load ? (
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
          ) : this.state.newimage ? (
            <View>
              <ImageBackground
                source={{uri: this.state.newimage}}
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
                  onPress={() => this.setState({newimage: ''})}
                />
              </ImageBackground>
            </View>
          ) : (
            <View style={{margin: 15}}>
              <TouchableOpacity
                style={{marginLeft: 5}}
                onPress={this.requestPermission}>
                <Entypo name="attachment" color={theme.colors.gray} size={28} />
              </TouchableOpacity>
            </View>
          )
        ) : (
          <Text></Text>
        )}

        <View
          style={{
            //   justifyContent: 'space-between',
            // flexDirection: 'row',
            marginTop: 10,
            width: '90%',
            alignSelf: 'center',
          }}>
          <Text style={{color: theme.colors.gray, fontSize: 16}}>
            Category:
          </Text>

          {this.state.isAdmin === 'admin' ? (
            <View
              style={[
                styles.input,
                {
                  //padding: 8,
                  // backgroundColor: theme.colors.primary,
                },
              ]}>
              <Picker
                selectedValue={this.state.category}
                style={{
                  width: '100%',
                  borderRadius: 5,
                  height: 35,
                  color: 'black',
                }}
                // prompt={'Select No of stores'}
                placeholder={'Select Stores'}
                onValueChange={value => {
                  this.setState({category: value}, () => {
                    this.setInput(value);
                  });
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
          ) : (
            <Text style={{color: 'black', marginTop: 5}}>{cat}</Text>
          )}
          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
          <Text style={{color: theme.colors.gray, fontSize: 16}}>
            Solution:
          </Text>
          {this.state.isAdmin === 'admin' ? (
            <TextInput
              style={{
                color: 'black',
                borderRadius: 10,
              }}
              onChangeText={text => this.setState({Sol: text})}
              value={Sol}
              placeholder="Solution"
              placeholderTextColor={'black'}
              underlineColorAndroid="transparent"
            />
          ) : (
            <Text style={{color: 'black', marginTop: 5}}>{Sol}</Text>
          )}

          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
          <Text style={{color: theme.colors.gray, fontSize: 16}}>
            Will the solution prevent the issue from happening again?
          </Text>
          {this.state.isAdmin === 'admin' ? (
            <View style={[styles.input]}>
              <Picker
                selectedValue={this.state.solution}
                style={{
                  width: '100%',
                  borderRadius: 5,
                  height: 35,
                  color: 'black',
                }}
                // prompt={'Select No of stores'}
                // placeholder={'Select Stores'}
                onValueChange={itemValue => {
                  this.setState({solution: itemValue}, () => {
                    this.setSol(itemValue);
                  });
                }}>
                {this.state.sol &&
                  this.state.sol.map((item, index) => {
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
          ) : (
            <Text style={{color: 'black', marginTop: 5}}>{pre}</Text>
          )}
          <Text
            style={{
              borderBottomWidth: 1,
              borderColor: theme.colors.gray,
            }}></Text>
        </View>
        {this.state.isAdmin === 'admin' ? (
          this.state.loading ? (
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
                this.update();
              }}>
              Update
            </Button>
          )
        ) : (
          <Text></Text>
        )}
      </ScrollView>
    );
  }
}
