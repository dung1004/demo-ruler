import React, { Component, useEffect, useState } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import LoggedInRoute from './components/logged_in_route'

// import Ruler from './components/ruler';
import Mapdemo from './components/map';
import MapDemoDraw from './components/map_demo_draw'
import DrawLine from './components/draw/draw_line'
import DrawLine1 from './components/draw/draw_line1'
import Dashboard from './components/dashboard'

const App = (props) => {

  return (
    <div>
        {/* <Ruler /> */}
        {/* <Mapdemo /> */}
        {/* <DrawLine1 /> */}
        {/* <DrawLine /> */}
        <BrowserRouter>
            <Switch>
              <Route path="/" exact component={Dashboard} />
            </Switch> 
        </BrowserRouter>
       
        {/* <Dashboard/> */}
      
    </div>
  );
};


export default App;

