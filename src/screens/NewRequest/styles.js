import {StyleSheet} from 'react-native';
import theme from '../../theme';
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16,
  },
  body: {
    height: 52,
    paddingLeft: 20,
    paddingRight: 20,
    color: 'black',
    borderBottomWidth: 1,
    width: '80%',
    // alignSelf: 'center',
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
  largeText: {
    color: theme.colors.gray,
    // textAlign: 'justify',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    // alignSelf: 'center',
    // padding: 0,
  },
  loginText: {color: 'white', fontWeight: 'bold', fontSize: 20},
  loginContainer: {
    width: '50%',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    borderColor: 'white',
    borderWidth: 1,
    alignSelf: 'center',
  },
  mediumText: {
    fontSize: 10,
    color: theme.colors.gray,
    marginLeft: 3,
    fontWeight: 'bold',
    // alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.gray,
    // marginTop: 20,
    // marginBottom: 20,
  },
  leftTitle: {
    // alignSelf: 'stretch',
    // textAlign: 'left',
    alignSelf: 'center',
    fontSize: 20,
  },
});
export default styles;
