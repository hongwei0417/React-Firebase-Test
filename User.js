import React from 'react';
import { StyleSheet, Text, View, TextInput, StatusBar, ListView } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem } from 'native-base'
import * as firebase from "firebase";



export default class User extends React.Component {
    static navigationOptions = {
      header: null
    }

    constructor(props) {
        super(props)
        
        this.ds = new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        })

        this.state = {
          listViewData: [],
          newTodo: "",
          message: "",
          userId: ""
        }
    }
    async componentDidMount() {
        try {
            // Get User Credentials
            let user = await firebase.auth().currentUser;
            this.setState({
                userId: user.uid //取得登入用戶Id
            })

            let todoRef = await firebase.database().ref('/Users')
            console.log(todoRef)
            
            todoRef.on('value',
            (data) => {
              if(data.child(this.state.userId).exists()) {
                this.setState({
                  listViewData: data.child(this.state.userId + '/todo').val()
                })
              }
              else {
                this.setState({
                  listViewData: []
                })
              }
              console.log(data)
              console.log(data.key)
              console.log(data.val())
              console.log(data.child(this.state.userId).exists())
            }
            )
            
            
        }
        catch(e) {
            console.log(e.toString())
        }
    }
    
    async logout() {

      try {
        await firebase.auth().signOut();
        this.showMessage("Sign out!")
        // Navigate to login view
        this.props.navigation.goBack()

      } catch (error) {
        console.log(error.toString())
        this.showMessage(error.toString())
      }

    }

    showMessage(message) {
        this.setState({
          message
        })
    }
    
    async addRow(data) {
      try {
        let newList = [...this.state.listViewData, data]
        await firebase.database().ref('/Users/' + this.state.userId).set({todo: newList})
        
        this.showMessage("Add Success!")
      }
      catch(e) {
        this.showMessage(e.toString())
      }
    }

    async deleteRow(secId, rowId, rowMap, data) {

      try {
        rowMap[`${secId}${rowId}`].props.closeRow()
        let newList = [...this.state.listViewData]
        newList.splice(rowId, 1) //從rowId那一列向後刪除一個
        
        let ref = await firebase.database().ref('/Users/' + this.state.userId )
        ref.update({todo: newList});
      }
      catch(e) {
        console.log(e.toString())
      }
      

      console.log(newList)
    }

    render() {
        return(
            <Container style={styles.container}>
              <Header style={{ marginTop: StatusBar.currentHeight}}>
                <Content>
                  <Item>
                    <Input
                      onChangeText={(newTodo) => this.setState({newTodo})}
                      placeholder="輸入代辦事項"
                    />
                    <Button onPress={() => this.addRow(this.state.newTodo)}>
                      <Icon name='add'/>
                    </Button>
                  </Item>
                </Content>
              </Header>
              <Content>
                <List
                  enableEmptySections
                  dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                  renderRow={(data) => 
                    <ListItem>
                      <Text style={{ textAlign: 'center' }}>{data}</Text>
                    </ListItem>  
                  }
                  renderLeftHiddenRow={(data)=>
                    <Button full onPress={() => this.addRow(data)}>
                      <Icon name='information-circle'/>
                    </Button>
                  }
                  renderRightHiddenRow={(data, secId, rowId, rowMap)=>
                    <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)} >
                      <Icon name='trash'/>
                    </Button>
                  }

                  leftOpenValue={-75}
                  rightOpenValue={-75}
                />
              </Content>
              <Label style={{ color: 'red', fontSize: 30, textAlign: 'center'}}>{this.state.message}</Label>
              <Button style={{ margin: 10 }} 
              full 
              rounded 
              primary
              onPress={() => this.logout()}
              >
                <Text style={{ color: 'white'}}>Logout</Text>
              </Button>
            </Container>
        )
    }
} 


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    }
});