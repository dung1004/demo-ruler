import React from 'react'
import { Redirect } from 'react-router-dom'
import _ from 'lodash'

class LoggedIn extends React.Component {
  render() {
    
    if (_.isEmpty(this.props.currentUser)) {
      return <Redirect to="/" />
    }

    return this.props.children
  }
}

export default LoggedIn
