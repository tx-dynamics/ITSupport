import {StyleSheet, Dimensions} from 'react-native';
import theme from '../../theme';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexGrow: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  splashStyle: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  buttonStyle: {
    margin: 10,
    backgroundColor: theme.colors.secondary,
    padding: 15,
    borderRadius: 10,
    // marginLeft:15,
    width: '75%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Input: {
    margin: 10,
    backgroundColor: 'white',
    // paddingLeft: 10,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    fontFamily: 'geometriaBold',
    alignSelf: 'center',
    textAlign: 'left',
    padding: 10,
    justifyContent: 'center',
    color: '#404041',
  },
  loginContainer: {
    width: '50%',
    backgroundColor: 'black',
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    borderColor: 'white',
    borderWidth: 1,
  },
  backArrow: {
    height: 25,
    width: 25,
    borderRadius: 50,
    margin: 10,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImgStyle: {
    height: 130,
    width: 130,
    // borderRadius: 65,
    alignSelf: 'center',
    margin: 5,
    justifyContent: 'flex-end',
  },
  textStyle: {
    fontSize: 20,
    marginTop: 10,
    color: 'white',
    // textAlign: 'center',
  },
});
export default styles;
