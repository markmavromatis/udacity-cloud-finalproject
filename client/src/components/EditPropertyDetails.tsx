import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'


interface EditPropertyDetailsProps {
  match: {
    params: {
      todoId: string
    }
  }
  auth: Auth
}

interface EditPropertyDetailsState {
    address: string,
    price: number,
    tax: number,
    fees: number
}

export class EditPropertyDetails extends React.PureComponent<
    EditPropertyDetailsProps,
    EditPropertyDetailsState> {
  state: EditPropertyDetailsState = {
    address: "",
    price: 0,
    tax: 0,
    fees: 0  
    }

    constructor(props : EditPropertyDetailsProps) {
        super(props)
        // Load property details from DB
        // Set the properties
    }
    

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    // Update DB here
  }


  render() {
    return (
      <div>
        <h1>Edit Property Details</h1>

        <Form onSubmit={this.handleSubmit}>
          <label>Address</label><input value="451 Kansas St"></input>
          <label>Price</label><input></input>
          <label>Fees</label><input></input>
          <label>Tax</label><input></input>


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
