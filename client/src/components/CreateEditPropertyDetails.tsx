import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { createProperty, patchProperty } from '../api/properties-api'

const qs = require('qs');


interface CreateEditPropertyDetailsProps {
  match: {
    params: {
      propertyId: string
    }
  }
  auth: Auth,
  history: History,
  addressDetailsInQuery: string
}

interface CreateEditPropertyDetailsState {
    address: string,
    neighborhood: string,
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
    neighborhood: "",
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
          this.state.neighborhood = addressParameters["neighborhood"];
          this.state.price = addressParameters["price"];
          this.state.tax = addressParameters["tax"];
          this.state.fees = addressParameters["fees"];
        }
        console.log("PROPERTY ID: " + props.match.params.propertyId);
        // console.log("***** " + this.state.address);
    }
    

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    // Validate fields
    const address : string = (document.getElementById("address") as HTMLInputElement).value;
    if (address.length == 0) {
      alert("Address is a required field!");
      return
    }
    const neighborhood : string = (document.getElementById("neighborhood") as HTMLInputElement).value;
    if (neighborhood.length == 0) {
      alert("Neighborhood is a required field!");
      return
    }
    const price = parseInt((document.getElementById("price") as HTMLInputElement).value);
    if (price == 0 || isNaN(price)) {
      alert("Price is a required field!");
    }
    const tax = parseInt((document.getElementById("tax") as HTMLInputElement).value);
    if (tax == 0 || isNaN(tax)) {
      alert("Tax is a required field!");
    }
    const fees = parseInt((document.getElementById("fees") as HTMLInputElement).value);
    if (fees == 0 || isNaN(fees)) {
      alert("Fees is a required field!");
    }

    console.log("Address: " + address);
    console.log("Neighborhood: " + neighborhood);
    console.log("Price: " + price);
    console.log("Tax: " + tax);
    console.log("Fees: " + fees);
    // console.log("Is blank? " + (address.length == 0));

    // Update DB here
    if (this.state.isCreateMode) {
      console.log("Creating new property...");
    } else {
      console.log("Editing existing property...");
      try {
        await patchProperty(this.props.auth.getIdToken(), this.props.match.params.propertyId, {
          address: address,
          neighborhood: neighborhood,
          price: price,
          fees: fees,
          tax: tax
        })
        // Redirect to main properties page
        this.props.history.push(`/`)

      } catch (err) {
        alert('Property Update failed: ' + err);
      }
    }
  }


  render() {
    return (
      <div>
        <h1>{this.state.isCreateMode ? "Create New Property" : "Edit Property Details"}</h1>

        <Form onSubmit={this.handleSubmit}>
          <label>Address</label><input id="address" defaultValue={this.state.address}></input>
          <label>Neighborhood</label><input id="neighborhood" defaultValue={this.state.neighborhood}></input>
          <label>Price</label><input id="price" defaultValue={this.state.price.toString()}></input>
          <label>Fees</label><input id="fees" defaultValue={this.state.fees.toString()}></input>
          <label>Tax</label><input id="tax" defaultValue={this.state.tax.toString()}></input>

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
