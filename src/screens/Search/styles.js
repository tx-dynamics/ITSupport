import {StyleSheet} from 'react-native';
import theme from '../../theme';
const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'lightgrey',
    fontSize: 16,
  },
  largeText: {
    color: 'black',
    // textAlign: 'justify',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    alignSelf: 'center',
    // padding: 0,
  },
  mediumText: {
    fontSize: 16,
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
  searchContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 0,
    padding: 10,
    // padding: 0,
  },
  inputStyle: {
    backgroundColor: 'white',
    elevation: 5,
    height: 37,
    alignSelf: 'center',
    width: '90%',

    // borderColor: theme.colors.primary,
  },
});
export default styles;
