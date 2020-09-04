import React, { useEffect } from "react";
import { compose, withProps, withState, withHandlers, lifecycle } from "recompose";
import {
  LoadScript,
  GoogleMap,
  Marker,
  Polyline,
  Circle,
  InfoWindow,
  withScriptjs,
  withGoogleMap,
  StreetViewPanorama,
  OverlayView,
  Polygon,
  MapDirectionsRenderer
} from "react-google-maps";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";
import { componentDidUpdate } from "react-google-maps/lib/utils/MapChildHelper";

const API_KEY = "AIzaSyBRs7NRGpboLvwqN9zqFZiuhCXqe9URYBQ";
// const API_KEY = "AIzaSyCJl7ZjVRbanMpfVjv1xFwf9RzsJku4klU";

const MapWithControlledZoom = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`,
    // googleMapURL: `https://maps.googleapis.com/maps/api/directions/json?origin=Toronto&destination=Montreal&key=${API_KEY}`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withState("zoom", "onZoomChange", 12),
  withState("shapeActive", "setShapeActive", {
    strokeColor: null,
    strokeWeight: null,
  }),
  withState("idSelected", "setIdSelected", null),
  withState("selectedShape", "setSelectedShape", null),
  withState("refData", "setRef", null),
  withState("dataShapeLocal", "setDataShapeLocal", []),
  withState(
    "dataShape",
    "setDataShape",
    JSON.parse(localStorage.getItem("dataShape")) || []
  ),
  // withState('places', 'setPlaces', [{latitude: 25.8103146,longitude: -80.1751609},
  //   {latitude: 27.9947147,longitude: -82.5943645},
  //   {latitude: 28.4813018,longitude: -81.4387899}]),
  withHandlers({
    clearSelection: ({dataShape}) => () => {
      dataShape.map(data => {
        // return {
          data.set("strokeColor", "black");
          data.set("strokeWeight", 3);
        // }

        return data
      })
      // console.log('dataShape', dataShape)
    },
    clearSelected: ({ selectedShape }) => () => {
      if(selectedShape) {
        selectedShape = null
      }
    }
  }),
  withHandlers({
    setSelection: ({clearSelection, setSelectedShape, selectColor}) => (shape) => {
      clearSelection()
      setSelectedShape(shape)
      // shape.setEditable(true);
      selectColor(shape.get('fillColor') || shape.get('strokeColor'))
      let polylineOptions = shape.get('polylineOptions')
      polylineOptions.strokeColor = "red"
      console.log('shape click', shape)
    }
  }),
  withHandlers({
    handleFinishShape: ({ dataShape, setDataShape }) => (shape) => {
      console.log('shape line', shape)
      const shapeArray = shape.getPath().getArray();
      let paths = [];

      shapeArray.forEach(function (path) {
        paths.push({ lat: path.lat(), lng: path.lng() });
      });

      if (paths.length) {
        // shape.path = paths
        // shape.id = randomId()
        // shape.shape = "polyline"
        let object = {
          id: randomId(),
          shape: "polyline",
          center: paths,
        };
        dataShape = [...dataShape, object];
      }
      console.log('dataShape state', dataShape)
      setDataShape(dataShape);
      localStorage.setItem("dataShape", JSON.stringify(dataShape));

      function randomId() {
        return Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 10);
      }
    },
    handleFinishCircle: ({ dataShape, setDataShape }) => (shape) => {
      console.log("shape", shape);
      let object = {
        id: randomId(),
        shape: "circle",
        radius: shape.radius,
        center: [{ lat: shape.center.lat(), lng: shape.center.lng() }],
      };
      dataShape = [...dataShape, object];
      setDataShape(dataShape);
      localStorage.setItem("dataShape", JSON.stringify(dataShape));

      function randomId() {
        return Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 10);
      }
    },
    handleFinishPolygon: ({ dataShape, setDataShape }) => (shape) => {
      const shapeArray = shape.getPath().getArray();
      let paths = [];

      shapeArray.forEach(function (path) {
        paths.push({ lat: path.lat(), lng: path.lng() });
      });

      if (paths.length) {
        let object = {
          id: randomId(),
          shape: "polygon",
          center: paths,
        };
        dataShape = [...dataShape, object];
      }

      setDataShape(dataShape);
      localStorage.setItem("dataShape", JSON.stringify(dataShape));

      function randomId() {
        return Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 10);
      }
    },
    handleClick: ({ dataShape, setDataShape, setIdSelected }) => (value) => {
      console.log('value click', value)
      // // let data = JSON.parse(localStorage.getItem("dataShape"))
      let newDataShape = dataShape.filter(data=>data.id !== value.id);

      setDataShape(newDataShape)
      localStorage.setItem("dataShape", JSON.stringify(newDataShape));


      // console.log('value click', value)
      // setIdSelected(value.id);
    },
    handleComplete: ({dataShape, setDataShape, clearSelection, clearSelected, dataShapeLocal, setDataShapeLocal, setSelectedShape }) => (shape) => {
      console.log('shape...', shape)
      
      if(shape.type !== window.google.maps.drawing.OverlayType.MARKER ) {

        
        // drawingManager.setDrawingMode(null)

        let newShape = shape.overlay
        newShape.type = shape.type

        window.google.maps.event.addListener(newShape, 'click', function() {
          console.log('newSjape...', newShape)
          newShape.setMap(null)
        })

        // const shapeArray = newShape.getPath().getArray();
        // let paths = [];
  
        // shapeArray.forEach(function (path) {
        //   paths.push({ lat: path.lat(), lng: path.lng() });
        // });

        // if (paths.length) {
        //   let object = {
        //     id: randomId(),
        //     shape: "polyline",
        //     center: paths,
        //   };
        //   dataShape = [...dataShape, object];
        // }

        // setDataShape(dataShape);
        // localStorage.setItem("dataShape", JSON.stringify(dataShape));
  
        // function randomId() {
        //   return Math.random()
        //     .toString(36)
        //     .replace(/[^a-z]+/g, "")
        //     .substr(0, 10);
        // }
       

      }
    },
    test: () => () => {
      console.log('test')
    }
   
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    // componentDidMount(props) {
     
    // },
    // componentDidUpdate(props) {
    //   document.addEventListener("keyup", function(e) {
    //     if(e.keyCode === 46 || e.keyCode === 8) {
    //       if(props.selectedShape) {
    //         console.log('shaped can xoa', props.selectedShape )
    //       }
    //     }
    //   })
    // }
  })
 
)((props) => (
  <GoogleMap
    defaultCenter={{ lat: 16.066929, lng: 108.221861 }}
    zoom={props.zoom}
    ref={props.onMapMounted}
    onZoomChanged={props.onZoomChanged}
    id="mapContainer"
  >

    {/* <MapDirectionsRenderer
        // places={props.markers}
        travelMode={window.google.maps.TravelMode.DRIVING}
      /> */}
    <DrawingManager
      drawingMode={props.shape}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            window.google.maps.drawing.OverlayType.POLYLINE,
            // window.google.maps.drawing.OverlayType.CIRCLE,
            // window.google.maps.drawing.OverlayType.POLYGON,
          ],
        },
      }}
      getDrawingMode={props.test}
      // onPolylineComplete={props.handleFinishShape}
      // onCircleComplete={props.handleFinishCircle}
      // onPolygonComplete={props.handleFinishPolygon}
      // onOverlayComplete={props.handleComplete}
    />
    {props.dataShape.length
      ? props.dataShape.map((data, index) => {
        // console.log('data', data)
          // if (data.shape === "circle") {
          //   return (
          //     <Circle
          //       key={index}
          //       ref={
          //         props.idSelected && props.idSelected === data.id
          //           ? props.handleRef
          //           : null
          //       }
          //       id={data.id}
          //       options={{
          //         strokeColor: props.idSelected && props.idSelected === data.id ? props.shapeActive.strokeColor : "black",
          //         strokeWeight: props.idSelected && props.idSelected === data.id ? props.shapeActive.strokeWeight : 3,
          //         strokeFill: "blue",
          //       }}
          //       radius={data.radius}
          //       defaultCenter={{
          //         lat: data.center[0].lat,
          //         lng: data.center[0].lng,
          //       }}
          //       onClick={() => props.handleClick(data)}
          //       draggable
          //       // editable={true}
          //     />
          //   );
          // }
          if (data.shape === "polyline") {
            return (
              <Polyline
                // ref={
                //   props.idSelected && props.idSelected === data.id
                //     ? props.handleRef
                //     : null
                // }
                id={data.id}
                key={index}
                options={{
                  strokeColor: "black",
                  strokeWeight: 3,
                }}
                path={data.center}
                onClick={() => props.handleClick(data)}
              />
            );
          }
          // if (data.shape === "polygon") {
          //   return (
          //     <Polygon
          //       key={index}
          //       options={{
          //         strokeColor: `black`,
          //         strokeWeight: 3,
          //         strokeFill: "blue",
          //       }}
          //       path={data.center}
          //     />
          //   );
          // }
        })
      : null}
  </GoogleMap>
));

export default function DemoMap() {
  return <MapWithControlledZoom />;
}
