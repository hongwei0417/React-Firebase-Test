import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem } from 'native-base'
import * as firebase from 'firebase';


var data = []

export default class User2 extends React.Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      listViewData: data,
      newContact: ""
    }

    this.showData.bind(this);

  }

  
  showData(data, newData) {
    console.log('data is\n')
    console.log(data)
    console.log('data val is\n')
    console.log(data.val())
    console.log('key is\n')
    console.log(data.key)
    console.log('List is\n')
    console.log(newData)
  }

  componentDidMount() {

    var that = this

    firebase.database().ref('/contacts').on('value', function(data) {
      console.log('onValue')
      console.log(data)
      console.log(data.val())
      console.log(data.key)
    })

    firebase.database().ref('/contacts').on('child_added', function (data) {
      
      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData })

      console.log('ref.on----------------\n')
      that.showData(data, newData)
    })

  }

  addRow(data) {
    
    var key = firebase.database().ref('/contacts').push().key
    firebase.database().ref('/contacts').child(key).set({ name: data })

    console.log('add----------------\n')
    console.log('data is\n')
    console.log(data)
    console.log('List is\n')
    console.log(this.state.listViewData)
  }

  async deleteRow(secId, rowId, rowMap, data) {

    
    await firebase.database().ref('contacts/' + data.key).set(null)

    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData });

    console.log('deletd-----------------\n')
    this.showData(data, newData)
  }

  

  showInformation() {

  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ marginTop: StatusBar.currentHeight }}>
          <Content>
            <Item>
              <Input
                onChangeText={(newContact) => this.setState({ newContact })}
                placeholder="Add name"
              />
              <Button onPress={() => this.addRow(this.state.newContact)}>
                <Icon name="add" />
              </Button>
            </Item>
          </Content>
        </Header>

        <Content>
          <List
            enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem>
                <Text> {data.val().name}</Text>
              </ListItem>
            }
            renderLeftHiddenRow={data =>
              <Button full onPress={() => this.addRow(data)} >
                <Icon name="information-circle" />
              </Button>
            }
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon name="trash" />
              </Button>

            }

            leftOpenValue={-75}
            rightOpenValue={-75}

          />

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
});