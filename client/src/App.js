import React, { Fragment } from "react"
import "./App.css"
import Navbar from "./components/layout/Navbar"
import Landing from "./components/layout/Landing"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Alert from "./components/layout/Alert"
import store from "./store"
import { Provider } from "react-redux"

const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
)

export default App
