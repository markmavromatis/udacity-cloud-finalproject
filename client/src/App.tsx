import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { History } from 'history'
import { CreateEditPropertyDetails } from './components/CreateEditPropertyDetails'
import { EditPropertyImage } from './components/EditPropertyImage'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Properties } from './components/Properties'


const DEFAULT_DOWNPAYMENT = "500000"
const DEFAULT_INTEREST_RATE = "3"

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: History
}

export interface AppState {
  interestRate: string
  downPayment : string
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)


    this.handleAddProperty = this.handleAddProperty.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleInterestRateUpdate = this.handleInterestRateUpdate.bind(this);
    this.handleDownPaymentUpdate = this.handleDownPaymentUpdate.bind(this);
  }
  async componentDidMount() {
    try {
      this.setState({
        downPayment: DEFAULT_DOWNPAYMENT,
        interestRate: DEFAULT_INTEREST_RATE      
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }

  handleAddProperty() {
    this.props.history.push(`/addProperty`)
  }

  handleInterestRateUpdate() {
    const interestRateInput = document.getElementById("interestRate") as HTMLInputElement
    if (interestRateInput.value) {
      this.setState({interestRate: interestRateInput.value})
    }
  }

  handleDownPaymentUpdate() {
    const downPaymentInput = document.getElementById("downPayment") as HTMLInputElement
    if (downPaymentInput.value) {
      this.setState({downPayment: downPaymentInput.value})
    }
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  handleRefresh() {
    this.props.history.push("/");
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '8em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.Menu position="left">{this.addPropertyButton()}</Menu.Menu>
        <Menu.Menu position="left">{this.addMortgageParameterControls()}</Menu.Menu>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  addPropertyButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="addProperty" onClick={this.handleAddProperty}>
          Add Property
        </Menu.Item>
      )
    }
  }

  addMortgageParameterControls() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <div>
        <label>Mortgage Interest Rate:</label>
        <input id="interestRate" type="text" defaultValue={DEFAULT_INTEREST_RATE} onChange={this.handleInterestRateUpdate}></input>
        <label>Down Payment:</label>
        <input id="downPayment" type="text" defaultValue={DEFAULT_DOWNPAYMENT} onChange={this.handleDownPaymentUpdate}></input>
        <button onClick={() => this.handleRefresh()}>Refresh</button>
        </div>
      )
    }

  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Properties {...props} auth={this.props.auth} interestRate={this.state.interestRate} downPayment={this.state.downPayment}/>
          }}
        />

        <Route
          path="/addProperty"
          exact
          render={props => {
            return <CreateEditPropertyDetails {...props} auth={this.props.auth} history={this.props.history} addressDetailsInQuery={""}/>
          }}
        />

        <Route
          path="/properties/:propertyId/editImage"
          exact
          render={props => {
            return <EditPropertyImage {...props} auth={this.props.auth} history={this.props.history}/>
          }}
        />

        <Route
          path="/properties/:propertyId/editDetails"
          exact
          render={props => {
            return <CreateEditPropertyDetails {...props} auth={this.props.auth} history={this.props.history} addressDetailsInQuery={location.search.substring(1)}/>
          }}
        />


        <Route component={NotFound} />
      </Switch>
    )
  }
}
