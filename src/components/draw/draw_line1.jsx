import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';

const DrawLine1 = () => {
    const classes = styles()
    const dataOptions = [
        { color: "#1E90FF", shape: "polyline", name: "cấm đỗ giờ cao điểm" },
        { color: "#FF1493", shape: "polyline", name: "cấm đỗ ngày chẵn" },
        { color: "#32CD32", shape: "polyline", name: "cấm đỗ ngày lẻ" },
        { color: "#FF8C00", shape: "polyline", name: "cấm đỗ qua đêm" },
        { color: "#4b0082", shape: "polyline", name: "cấm đỗ sau 11h" },
    ]

    let test = null
    let [shapeSelected, setShapeSelected] = useState(null)

    let [drawingManager, setDrawingManager] = useState(null)
    let [dataShape, setDataShape] = useState(JSON.parse(localStorage.getItem("dataShape")) || [])

    useEffect(() => {
        window.addEventListener("load", function () {
            init();
          });
    });

    const init = () => {
        console.log('init ahihi')

        var map = new window.google.maps.Map(document.getElementById("map"), {
          zoom: 13,
          center: new window.google.maps.LatLng(16.059506, 108.219112),
        });
    
        drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ["polyline"],
          },
    
          polylineOptions: {
            editable: true,
          },
          map: map,
        });

        setDrawingManager(drawingManager)
    
        loadData(map);
    }

    const loadData = (map) => {
        console.log('load data ahihi')

        dataShape.map((data) => {
          let polyline = new window.google.maps.Polyline({
            path: data.path,
            strokeColor: data.color,
            strokeWeight: 4,
            id: data.id,
            type: data.type
          });
    
          window.google.maps.event.addListener(polyline, "click", () =>
            handleShapeSelected(polyline)
          );
    
        //   window.google.maps.event.addListener(polyline.getPath(), "set_at", () =>
        //     _this.handleEditableShape(polyline, dataShape)
        //   );
    
          polyline.setMap(map);
        });

    }

    const handleShapeSelected = (shape) => {

        console.log('shape ted', test)
        clearShapeSelected();
        shape.setEditable(true);
        test = shape
    }

    const clearShapeSelected = () => {
        if (test) {
          test.setEditable(false);
          setShapeSelected(null)
        }
      };

    return (
        <div>
            <div id="map" className={classes.root}></div>
        </div>
    );
};

export default DrawLine1;

const styles = makeStyles(() => ({
    root: {
        width: "100%",
        height: "100vh",
    }
}))