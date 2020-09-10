import { connect } from 'react-redux'

import LoggedIn from './logged_in'

function mapStateToProps(state){
  return {
    currentUser: state.user.account
  }
}
export default connect(mapStateToProps)(LoggedIn)
