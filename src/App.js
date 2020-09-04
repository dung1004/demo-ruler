import React, { Component } from 'react';

// import Ruler from './components/ruler';
import Mapdemo from './components/map';
import MapDemoDraw from './components/map_demo_draw'
import DrawLine from './components/draw/draw_line'

const App = (props) => {

  return (
    <div>
        {/* <Ruler /> */}
        {/* <Mapdemo /> */}
        <DrawLine />
    </div>
  );
};


export default App;

