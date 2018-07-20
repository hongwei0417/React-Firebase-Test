import React from 'react';
import Expo from 'expo'
import { StyleSheet, Text, View, TextInput } from 'react-native'
import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base'
import * as firebase from "firebase"


export default class login extends React.Component {
    static navigationOptions = {
      title: "Firebase Login"
    }
    componentDidMount() {
        
    }

    async signUp(email, pass) {
        let message = ""
        try {
          await firebase.auth().createUserWithEmailAndPassword(email, pass);

          message = "Account created"
          console.log(message)
          this.showMessage(message)

        } catch (error) {
          message = error.toString()
          console.log(message)
          this.showMessage(message)
        }
    }

    async login(email, pass) {
        
        try {
          await firebase.auth().signInWithEmailAndPassword(email, pass);
          console.log("Logged In!");
          this.showMessage("Logged In!")
          console.log(firebase.auth().currentUser)
          this.props.navigation.navigate('User')
          // Navigate to the Home page

        } catch (error) {
          console.log(error.toString())
          this.showMessage(error.toString())
        }

    }
    
    async loginWithFacebook() {

      try {
        const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('200208223955724', { permissions: ['email'] })
      
        if(type == 'success') {
          const credential = firebase.auth.FacebookAuthProvider.credential(token)
          
          await firebase.auth().signInAndRetrieveDataWithCredential(credential)
          this.showMessage("Login With Facebook\nSuccess!")
          this.props.navigation.navigate('User')
        }
      }
      catch(e) {
        console.log(e.toString())
        this.showMessage(e.toString())
      }
      
    }

    async loginWithGoogle() {
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId: "126188651936-j1k8ic9em32ogj7vlkeouhsi1l3q56nh.apps.googleusercontent.com",
          iosClientId: "126188651936-43152mu68h7bsr3qdiou9030lgra7ior.apps.googleusercontent.com",
          scopes: ['profile', 'email'],
        });

        if (result.type === 'success') {
          const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)

          await firebase.auth().signInAndRetrieveDataWithCredential(credential)
          this.showMessage("Login With Google\nSuccess!")
          this.props.navigation.navigate('User')

        } else {
          return {cancelled: true};
        }
      } catch(e) {
        console.log(e.toString())
        this.showMessage(e.toString())
      }
    }

    nextPage() {
        this.props.navigation.navigate('User')
    }

    showMessage(message) {
        this.setState({
          message
        })
    }

    constructor(props) {
        super(props)
        
        this.state = {
          email: "",
          password: "",
          message: ""
        }
    }
    render() {
      return (
        <Container style={styles.container}>
          <Label style={{ color: 'red', fontSize: 30, textAlign: 'center'}}>{this.state.message}</Label>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(email) => this.setState({email})}
              />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={(password) => this.setState({password})}
              />
            </Item>
            <Button style={{ marginTop: 10 }} 
            full 
            rounded 
            success
            onPress={() => this.login(this.state.email, this.state.password)}
            >
              <Text style={{ color: 'white'}}>Login</Text>
            </Button>
            <Button style={{ marginTop: 10 }} 
            full
            rounded 
            warning
            onPress={() => this.signUp(this.state.email, this.state.password)}
            >
              <Text style={{ color: 'white'}}>Sign Up</Text>
            </Button>
            <Button style={{ marginTop: 10 }} 
            full 
            rounded 
            primary
            onPress={this.loginWithFacebook.bind(this)}
            >
              <Text style={{ color: 'white'}}>Facebook</Text>
            </Button>
            <Button style={{ marginTop: 10 }} 
            full 
            rounded 
            danger
            onPress={this.loginWithGoogle.bind(this)}
            >
              <Text style={{ color: 'white'}}>Google</Text>
            </Button>
          </Form>
        </Container>
      );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      padding: 10,
    },
});