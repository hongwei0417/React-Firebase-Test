import * as firebase from "firebase"
import React from 'react'
import { createStackNavigator } from 'react-navigation';
import user from './User'
import login from './Login'
import { firebaseConfig } from './Firebase.config'

export default class App extends React.Component{
  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        console.log(user)
      }
    })
  }
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