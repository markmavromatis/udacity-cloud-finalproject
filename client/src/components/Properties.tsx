import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createProperty, deleteProperty, getProperties, patchProperty } from '../api/properties-api'
import Auth from '../auth/Auth'
import { Property } from '../types/Property'

const mortgageCalculate = require('mortgage-calculate');

interface PropertiesProps {
  auth: Auth
  history: History
}

interface PropertiesState {
  properties: Property[]
  newTodoName: string
  loadingProperties: boolean
}

export class Properties extends React.PureComponent<PropertiesProps, PropertiesState> {
  state: PropertiesState = {
    properties: [],
    newTodoName: '',
    loadingProperties: true
  }

//   handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     this.setState({ newTodoName: event.target.value })
//   }

onEditDetailsButtonClick = (propertyId: string, address: string, price: number, tax: number, fees: number) => {
  this.props.history.push(`/properties/${propertyId}/editDetails?address=${address}&price=${price}&tax=${tax}&fees=${fees}`)
}

onEditImageButtonClick = (propertyId: string) => {
    this.props.history.push(`/properties/${propertyId}/editImage`)
  }

//   onTodoCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
//     try {
//       const dueDate = this.calculateDueDate()
//       const newTodo = await createTodo(this.props.auth.getIdToken(), {
//         name: this.state.newTodoName,
//         dueDate
//       })
//       this.setState({
//         todos: [...this.state.todos, newTodo],
//         newTodoName: ''
//       })
//     } catch {
//       alert('Todo creation failed')
//     }
//   }

  onPropertyDelete = async (propertyId: string) => {
    try {
      await deleteProperty(this.props.auth.getIdToken(), propertyId)
      this.setState({
        properties: this.state.properties.filter(property => property.propertyId != propertyId)
      })
    } catch {
      alert('Property deletion failed')
    }
  }

//   onTodoCheck = async (pos: number) => {
//     try {
//       const todo = this.state.todos[pos]
//       await patchTodo(this.props.auth.getIdToken(), todo.todoId, {
//         name: todo.name,
//         dueDate: todo.dueDate,
//         done: !todo.done
//       })
//       this.setState({
//         todos: update(this.state.todos, {
//           [pos]: { done: { $set: !todo.done } }
//         })
//       })
//     } catch {
//       alert('Todo deletion failed')
//     }
//   }

  async componentDidMount() {
    try {
      const properties = await getProperties(this.props.auth.getIdToken())
      this.setState({
        properties,
        loadingProperties: false
      })
      console.log("*** PROPERTIES")
      console.log(JSON.stringify(properties));
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Properties</Header>

        {this.renderProperties()}
      </div>
    )
  }

//   renderCreateTodoInput() {
//     return (
//       <Grid.Row>
//         <Grid.Column width={16}>
//           <Input
//             action={{
//               color: 'teal',
//               labelPosition: 'left',
//               icon: 'add',
//               content: 'New task',
//               onClick: this.onTodoCreate
//             }}
//             fluid
//             actionPosition="left"
//             placeholder="To change the world..."
//             onChange={this.handleNameChange}
//           />
//         </Grid.Column>
//         <Grid.Column width={16}>
//           <Divider />
//         </Grid.Column>
//       </Grid.Row>
//     )
//   }

  renderProperties() {
    if (this.state.loadingProperties) {
      return this.renderLoading()
    }

    return this.renderPropertiesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Properties...
        </Loader>
      </Grid.Row>
    )
  }

  renderPropertiesList() {
    return (
      <Grid padded>
        {this.state.properties.map((property, pos) => {
          return (
            <Grid.Row key={property.propertyId}>
              <Grid.Column width={1} verticalAlign="middle">
                {/* <Checkbox
                  onChange={() => this.onTodoCheck(pos)}
                  checked={todo.done}
                /> */}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {property.address}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle">
                {property.neighborhood}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {property.price}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {property.fees}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {property.tax}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {Math.round(mortgageCalculate(
                  {loanAmount: 100000, APR: 4.7, termYears: 30}
                  ).monthlyPayment * 100) / 100}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditDetailsButtonClick(property.propertyId, property.address, property.price, property.tax, property.fees)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditImageButtonClick(property.propertyId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPropertyDelete(property.propertyId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {property.attachmentUrl && (
                <Image src={property.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
