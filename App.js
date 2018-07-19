import * as firebase from "firebase"
import React from 'react'
import { createStackNavigator } from 'react-navigation';
import user from './User'
import login from './Login'
import User2 from './User2'
import { firebaseConfig } from './Firebase.config'
import Expo from 'expo'

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged((user) => {
  if(user) {
    console.log(user)
  }
})

export default class App extends React.Component{

  render() {
    return(
      <RootStack />
    )
  }
}

const RootStack = createStackNavigator({
    Login: {
        screen: login
    },
    User: {
        screen: user
    }
},
{
  initialRouteName: 'Login'
});