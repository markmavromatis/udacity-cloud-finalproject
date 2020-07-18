import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'

const qs = require('qs');


interface CreateEditPropertyDetailsProps {
  match: {
    params: {
      propertyId: string
    }
  }
  auth: Auth,
  addressDetailsInQuery: string
}

interface CreateEditPropertyDetailsState {
    address: string,
    price: number,
    tax: number,
    fees: number,
    isCreateMode: boolean
}

export class CreateEditPropertyDetails extends React.PureComponent<
    CreateEditPropertyDetailsProps,
    CreateEditPropertyDetailsState> {
  state: CreateEditPropertyDetailsState = {
    address: "",
    price: 0,
    tax: 0,
    fees: 0,
    isCreateMode: false
    }

    constructor(props : CreateEditPropertyDetailsProps) {
        super(props)
        if (props.addressDetailsInQuery == "") {
          // We are creating a new property.
          this.state.isCreateMode = true
        } else {
          this.state.isCreateMode = false
          const addressParameters = qs.parse(props.addressDetailsInQuery);
          this.state.address = addressParameters["address"];
          this.state.price = addressParameters["price"];
          this.state.tax = addressParameters["tax"];
          this.state.fees = addressParameters["fees"];
        }

        // console.log("***** " + this.state.address);
    }
    

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Update DB here
  }


  render() {
    return (
      <div>
        <h1>{this.state.isCreateMode ? "Create New Property" : "Edit Property Details"}</h1>

        <Form onSubmit={this.handleSubmit}>
          <label>Address</label><input value={this.state.address}></input>
          <label>Price</label><input value={this.state.price}></input>
          <label>Fees</label><input value={this.state.fees}></input>
          <label>Tax</label><input value={this.state.tax}></input>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }
}
