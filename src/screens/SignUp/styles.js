import {StyleSheet} from 'react-native';
import theme from '../../theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    // flexGrow: 1,
  },
  LoginContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'tomato',
    marginTop: '20%',
    justifyContent: 'center',
  },
  largeText: {
    fontSize: 16,
    fontWeight: '300',
  },
  or: {
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
  },
  mediumText: {
    fontSize: 15,
    padding: 5,
    alignSelf: 'center',
    // fontFamily: Fonts.FontAwesome,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    // alignSelf: 'stretch',
    // textAlign: 'left',
    alignSelf: 'center',
    fontSize: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: 14,
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
  loginText: {color: 'white', fontWeight: 'bold', fontSize: 20},
  placeholder: {
    color: 'gray',
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
  InputContainer: {
    margin: 10,
    backgroundColor: 'white',
    // paddingLeft: 10,
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    fontFamily: 'geometriaBold',
    // alignSelf: 'center',
    textAlign: 'left',
    padding: 3,
    // justifyContent:'center',
    // alignItems:'center'
  },
  body: {
    height: 52,
    paddingLeft: 20,
    paddingRight: 20,
    color: '#404041',
  },
});
export default styles;
