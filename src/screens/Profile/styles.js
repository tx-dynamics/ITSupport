import {StyleSheet} from 'react-native';
import theme from '../../theme';
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  userImgStyle: {
    height: 130,
    width: 130,
    borderRadius: 65,
    alignSelf: 'center',
    margin: 5,
  },
  InputContainer: {
    width: '90%',
    marginTop: 25,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B3B3BA',
    borderRadius: 4,
    marginLeft: 10,
    // borderBottomWidth: '70%',
  },
  picback: {
    flex: 0.3,
    backgroundColor: theme.colors.primary,
  },
  edit: {
    alignItems: 'flex-end',
    marginRight: 20,
    top: 10,
  },
  body: {
    padding: 10,
    // paddingLeft: 20,
    // paddingRight: 20,
    color: '#404041',
  },
  mediumText: {
    fontSize: 14,
    color: '#2C88BF',
    marginLeft: 5,
    // alignSelf: 'center',
  },
  LoginContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default style;
