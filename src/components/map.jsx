import React, {useState} from "react";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    DrawingManager
  } from "react-google-maps";

  function Map() {
    return (
        <div className="App">
            <GoogleMap  defaultZoom={8} defaultCenter={{ lat: -34.397, lng: 150.644 }} ></GoogleMap>
        </div>
      );
  }

  const API_KEY = "AIzaSyBRs7NRGpboLvwqN9zqFZiuhCXqe9URYBQ";
  const WrapperMap = withScriptjs(withGoogleMap(Map));

  export default function Mapdemo() {
      const [shape, setShape] = useState("polyline")
       function handleMouseUp(e) {
          console.log('mouse up', e)
      }
      return (
          <div style={{width: '100vw', height: "100vh"}}>
            <WrapperMap
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: "100vh" }} />}
                mapElement={<div style={{ height: `100%` }} />}
            >
                <DrawingManager
                    drawingMode={shape}
                    onMouseUp={handleMouseUp}
                >
                    
                </DrawingManager>

            </WrapperMap>
        </div>
      )
      
  }