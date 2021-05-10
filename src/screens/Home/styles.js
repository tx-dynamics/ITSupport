import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  categoryContainer: {
    flex: 0.5,
    // justifyContent: 'center',
    padding: 10,

    // alignItems: 'center',
    // marginTop: 10,
  },
  largeText: {
    color: 'white',
    // textAlign: 'justify',
    fontSize: 16,
    padding: 0,
  },
  mediumText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 3,
    alignSelf: 'center',
  },
});
export default styles;
