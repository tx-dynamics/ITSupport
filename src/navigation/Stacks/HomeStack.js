import {createStackNavigator} from 'react-navigation-stack';
//screens
import Home from '../../screens/Home';
// import ServeyDetail from '../../screens/SurveyDetail';
import Archived from '../../screens/Archived';
import Profile from '../../screens/Profile';
import NewRequest from '../../screens/NewRequest';
import Search from '../../screens/Search';
import Notes from '../../screens/Notes';
import EditProfile from '../../screens/EditProfile';
import Filter from '../../screens/Filter';
import ChatDetail from '../../screens/ChatDetail';
//HomeStack
const homeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        headerShown: false,
      },
    },
    Archived: {
      screen: Archived,
      navigationOptions: {
        headerShown: false,
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerShown: false,
      },
    },
    NewRequest: {
      screen: NewRequest,
      navigationOptions: {
        headerShown: false,
      },
    },
    Search: {
      screen: Search,
      navigationOptions: {
        headerShown: false,
      },
    },
    Notes: {
      screen: Notes,
      navigationOptions: {
        headerShown: false,
      },
    },
    EditProfile: {
      screen: EditProfile,
      navigationOptions: {
        headerShown: false,
      },
    },
    Filter: {
      screen: Filter,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChatDetail: {
      screen: ChatDetail,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default homeStack;
