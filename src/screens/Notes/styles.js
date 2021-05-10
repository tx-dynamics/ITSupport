import {StyleSheet} from 'react-native';
import theme from '../../theme';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  LoginContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'tomato',
  },
  or: {
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.gray,
    marginTop: 20,
    marginLeft: 20,
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
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    borderColor: 'white',
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: 10,
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
  input: {
    margin: 10,
    backgroundColor: 'white',
    // paddingLeft: 10,
    borderRadius: 10,
    // width: '75%',
    // fontFamily: 'geometriaBold',
    // alignSelf: 'center',
    elevation: 10,
  },
});
export default styles;
