import React, { Component } from 'react'
import DashboardLayout from './../dashboard_layout/dashboard_layout'
import LoggedInRoute from './../logged_in_route'
import SiteMap from './../site_map_public'
// import SiteViolation from './components/siteviolation_page'

export default class Dashboard extends Component {
  render() {
    const { url } = this.props.match
    return (
      <div>
        {/* <LoggedInRoute path={`${url}/sitemap`}> */}
          <DashboardLayout title="BẢN ĐỒ CAMERA">
            <SiteMap />
          </DashboardLayout>
        {/* </LoggedInRoute> */}
      </div>
    )
  }
}
