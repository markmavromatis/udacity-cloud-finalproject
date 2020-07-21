import {calculateMonthlyPayment} from "../util/MortgageCalculator";
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
  interestRate: string
  downPayment: string
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

onEditDetailsButtonClick = (propertyId: string, address: string, neighborhood: string, price: number, tax: number, fees: number) => {
  this.props.history.push(`/properties/${propertyId}/editDetails?address=${address}&neighborhood=${neighborhood}&price=${price}&tax=${tax}&fees=${fees}`)
}

onEditImageButtonClick = (propertyId: string) => {
    this.props.history.push(`/properties/${propertyId}/editImage`)
  }

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

  async componentDidMount() {
    try {
      const properties = await getProperties(this.props.auth.getIdToken())
      this.setState({
        properties,
        loadingProperties: false
      })
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
      <Grid padded celled>
        <Grid.Row key="header">
          <Grid.Column width={4}>Address</Grid.Column>
          <Grid.Column width={4}>Neighborhood</Grid.Column>
          <Grid.Column width={2}>Price</Grid.Column>
          <Grid.Column width={1}>Fees</Grid.Column>
          <Grid.Column width={1}>Tax</Grid.Column>
          <Grid.Column width={1}>Monthly</Grid.Column>
          <Grid.Column width={3}></Grid.Column>
        </Grid.Row>
        {this.state.properties.map((property, pos) => {
          return (

            <Grid.Row key={property.propertyId}>
              <Grid.Column width={4} verticalAlign="top">
                {property.address}
                {property.attachmentUrl && (<br></br>)}
                {property.attachmentUrl && (
                <Image src={property.attachmentUrl} size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="top">
                {property.neighborhood}
              </Grid.Column>
              <Grid.Column width={2} floated="right">
                {property.price.toLocaleString()}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {property.fees.toLocaleString()}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {property.tax.toLocaleString()}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                {calculateMonthlyPayment(property, this.props.downPayment, this.props.interestRate).toLocaleString()}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditDetailsButtonClick(property.propertyId, property.address, property.neighborhood, property.price, property.tax, property.fees)}
                >
                  <Icon name="pencil" />
                </Button>
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditImageButtonClick(property.propertyId)}
                >
                  <Icon name="image" />
                </Button>
                <Button
                  icon
                  color="red"
                  onClick={() => this.onPropertyDelete(property.propertyId)}
                >
                  <Icon name="delete" />
                </Button>
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
