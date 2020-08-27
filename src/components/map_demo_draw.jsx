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
  Polygon,
} from "react-google-maps";
import { DrawingManager } from "react-google-maps/lib/components/drawing/DrawingManager";

const API_KEY = "AIzaSyBRs7NRGpboLvwqN9zqFZiuhCXqe9URYBQ";

const MapWithControlledZoom = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places&key=${API_KEY}`,
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
  withState(
    "dataShape",
    "setDataShape",
    JSON.parse(localStorage.getItem("dataShape")) || []
  ),

  withHandlers({
    handleFinishShape: ({ dataShape, setDataShape }) => (shape) => {
      const shapeArray = shape.getPath().getArray();
      let paths = [];

      shapeArray.forEach(function (path) {
        paths.push({ lat: path.lat(), lng: path.lng() });
      });

      if (paths.length) {
        let object = {
          id: randomId(),
          shape: "polyline",
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
    handleClick: ({ setIdSelected }) => (value) => {
      setIdSelected(value.id);
    },
    handleRef: ({ setShapeActive }) => (ref) => {
      if (ref) {
        setShapeActive({ strokeColor: "red", strokeWeight: 5 });

      }
    },
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      console.log('didmout')
    },
    componentDidUpdate() {
      console.log('update')
    }
    // componentDidUpdate() {
    //   let body = document.getElementsByTagName("body");
    //   console.log(body)
    //     body[0].addEventListener("onkeyup", function(e) {
    //          if (e.keyCode === 46) {
    //           console.log("delete");
    //         }
    //     })
    // },
  })
)((props) => (
  <GoogleMap
    defaultCenter={{ lat: 16.066929, lng: 108.221861 }}
    zoom={props.zoom}
    ref={props.onMapMounted}
    onZoomChanged={props.onZoomChanged}
    id="mapContainer"
  >
    <DrawingManager
      drawingMode={props.shape}
      defaultOptions={{
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            window.google.maps.drawing.OverlayType.POLYLINE,
            window.google.maps.drawing.OverlayType.CIRCLE,
            window.google.maps.drawing.OverlayType.POLYGON,
          ],
        },
      }}
      onPolylineComplete={props.handleFinishShape}
      onCircleComplete={props.handleFinishCircle}
      onPolygonComplete={props.handleFinishPolygon}
    />
    {props.dataShape.length
      ? props.dataShape.map((data, index) => {
          if (data.shape === "circle") {
            return (
              <Circle
                key={index}
                ref={
                  props.idSelected && props.idSelected === data.id
                    ? props.handleRef
                    : null
                }
                id={data.id}
                options={{
                  strokeColor:
                    props.shapeActive.strokeColor &&
                    props.idSelected === data.id
                      ? props.shapeActive.strokeColor
                      : "black",
                  strokeWeight:
                    props.shapeActive.strokeWeight &&
                    props.idSelected === data.id
                      ? props.shapeActive.strokeWeight
                      : 3,
                  strokeFill: "blue",
                }}
                radius={data.radius}
                defaultCenter={{
                  lat: data.center[0].lat,
                  lng: data.center[0].lng,
                }}
                onClick={() => props.handleClick(data)}
                draggable
                // editable={true}
              />
            );
          }
          if (data.shape === "polyline") {
            return (
              <Polyline
                key={index}
                options={{
                  strokeColor: `black`,
                  strokeWeight: 3,
                }}
                path={data.center}
              />
            );
          }
          if (data.shape === "polygon") {
            return (
              <Polygon
                key={index}
                options={{
                  strokeColor: `black`,
                  strokeWeight: 3,
                  strokeFill: "blue",
                }}
                path={data.center}
              />
            );
          }
        })
      : null}
  </GoogleMap>
));

export default function DemoMap() {
  return <MapWithControlledZoom />;
}
