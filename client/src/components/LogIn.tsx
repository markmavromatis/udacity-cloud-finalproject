import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'
import interlace from "../components/images/singapore-interlace.png"

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <h1>Property Moguls App</h1>
        <img src={interlace}/>
        <h4>Use this app to track residential properties, prices, and fees/taxes. Enter a mortgage rate and down payment, and the system will calculate your monthly payment!</h4>

        <Button onClick={this.onLogin} size="huge" color="olive">
          Log in
        </Button>
      </div>
    )
  }
}
