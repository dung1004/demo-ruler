import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IconButton, Button, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ShowChartIcon from "@material-ui/icons/ShowChart";

import marker_camera from "./../../../assets/images/marker/marker_camera.png";
import marker_parking from "./../../../assets/images/marker/marker_parking.png";
import {CustomMarker} from './CustomMarker'
import Img from './marker.jpg'
import "./marker.css"

export default function SiteMap() {
  const classes = styles();
  const dataOptions = [
    { color: "#1E90FF", shape: "polyline", name: "cấm đỗ giờ cao điểm" },
    { color: "#FF1493", shape: "polyline", name: "cấm đỗ ngày chẵn" },
    { color: "#32CD32", shape: "polyline", name: "cấm đỗ ngày lẻ" },
    { color: "#FF8C00", shape: "polyline", name: "cấm đỗ qua đêm" },
    { color: "#4b0082", shape: "polyline", name: "cấm đỗ sau 11h" },
  ];

  const dataListParking = [
    {
      id: 1,
      name: "Tên camera 1",
      type: "camera",
      description: "Thông tin tên camera 1",
      position: { lat: 16.070259, lng: 108.213301 },
    },
    {
      id: 2,
      name: "Tên camera 2",
      type: "camera",
      description: "Thông tin tên camera 2",
      position: { lat: 16.070238, lng: 108.213559 },
    },
    {
      id: 3,
      name: "Tên camera 3",
      type: "camera",
      description: "Thông tin tên camera 3",
      position: { lat: 16.070094, lng: 108.21358 },
    },
    {
      id: 4,
      name: "Tên bãi đậu xe 1",
      type: "parking",
      description: "Thông tin bãi đậu xe 1",
      position: { lat: 16.061124, lng: 108.223024 },
    },
    {
      id: 5,
      name: "Tên bãi đậu xe 2",
      type: "parking",
      description: "Thông tin bãi đậu xe 2",
      position: { lat: 16.06114, lng: 108.223174 },
    },
    {
      id: 6,
      name: "Tên bãi đậu xe 3",
      type: "parking",
      description: "Thông tin bãi đậu xe 3",
      position: { lat: 16.06097, lng: 108.223813 },
    },
  ];

  let shapeSelected = null;
  let infoWindowActive = null;

  //useState
  let [drawingManager, setDrawingManager] = useState(null);
  let [dataShape, setDataShape] = useState(
    JSON.parse(localStorage.getItem("dataShape")) || []
  );

  //useEffect
  useEffect(() => {
    window.addEventListener("load", function () {
      init();
    });
  }, []);

  useEffect(() => {
    if (drawingManager) {
      window.google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (e) => handleFinishDrawShape(e, drawingManager, dataShape)
      );
    }
  });

  const init = () => {
    let map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 16,
      center: new window.google.maps.LatLng(16.065898, 108.218769),
      styles: [
        {
          featureType: "poi",
          stylers: [{ visibility: "off" }],
        },
        {
          featureType: "transit.station",
          stylers: [{ visibility: "off" }],
        },
      ],
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
    let icons = {
      camera: {
        url: marker_camera,
        scaledSize: new window.google.maps.Size(30, 30),
      },
      parking: {
        url: marker_parking,
        scaledSize: new window.google.maps.Size(30, 30),
      },
    };

    let currentInfowindow = null;
    let currentMarker = null;

    dataListParking.map((data) => {
      let marker = new CustomMarker(
        data.position,
        map,
        Img
      )

      // console.log('marker', marker)
      // let marker = new window.google.maps.Marker({
      //   position: data.position,
      //   title: data.name,
      //   icon: icons[data.type],
      //   map: map,
      // });
      marker.setMap(map)

      

      let infoWindow = new window.google.maps.InfoWindow({
        content: data.name,
      });

      // marker.setMap(map);
      marker.addListener("click", function () {
        if (currentInfowindow !== null) {
          currentInfowindow.close(map, marker);
        }
        infoWindow.open(map, marker);
        currentInfowindow = infoWindow;
        currentMarker = marker;
      });
    });

    setDrawingManager(drawingManager);
    buildColorPalette();

    window.google.maps.event.addListener(
      drawingManager,
      "drawingmode_changed",
      clearShapeSelected
    );

    window.google.maps.event.addListener(map, "click", function () {
      if (currentInfowindow !== null) {
        currentInfowindow.close(map, currentMarker);
      }

      if (infoWindowActive) {
        infoWindowActive.open(null);
      }

      clearShapeSelected();
    });

    loadData(map);
  };

  const loadData = (map) => {
    dataShape.map((data) => {
      let polyline = new window.google.maps.Polyline({
        path: data.path,
        strokeColor: data.color,
        strokeWeight: 4,
        id: data.id,
        type: data.type,
        name: data.name,
      });

      window.google.maps.event.addListener(polyline, "click", function (e) {
        handleShapeSelected(polyline);
        showInfoWindow(e, polyline, map);
      });

      window.google.maps.event.addListener(polyline.getPath(), "set_at", () =>
        handleEditableShape(polyline, dataShape)
      );

      polyline.setMap(map);
    });

    window.google.maps.event.addDomListener(
      document.getElementById("delete-button"),
      "click",
      function () {
        handleDeleteShapeSelected();
      }
    );
  };

  const handleFinishDrawShape = (e, drawingManager, dataShape) => {
    let id = randomID();
    let newShape = e.overlay;
    newShape.type = e.type;
    newShape.id = id;

    let paths = handleParsePaths(newShape);

    let objectShape = {
      id,
      path: paths,
      color: newShape.strokeColor,
      name: newShape.name,
      type: newShape.type,
    };

    dataShape = [...dataShape, objectShape];
    setDataShape(dataShape);
    localStorage.setItem("dataShape", JSON.stringify(dataShape));

    newShape.setEditable(false);
    drawingManager.setDrawingMode(null);
    // handleShapeSelected(newShape);

    window.google.maps.event.addListener(newShape, "click", function (e) {
      handleShapeSelected(newShape);
    });

    window.google.maps.event.addDomListener(
      document.getElementById("delete-button"),
      "click",
      function () {
        handleDeleteShapeSelected();
      }
    );

    if (newShape.type === "polyline") {
      window.google.maps.event.addListener(newShape.getPath(), "set_at", () =>
        handleEditableShape(newShape, dataShape)
      );
    }
  };

  const clearInfoWindow = () => {
    if (infoWindowActive) {
      infoWindowActive.open(null);
    }
  };

  const showInfoWindow = (e, polyline, map) => {
    clearInfoWindow();
    let infoWindow = new window.google.maps.InfoWindow({
      content: polyline.name,
    });

    let position = e.latLng;
    infoWindow.setPosition(position);
    infoWindow.open(map);

    infoWindowActive = infoWindow;
  };

  const buildColorPalette = () => {
    let elmButton = [];
    dataOptions.map((data, index) => {
      let currColor = data.color;
      let title = data.name;
      let colorButton = makeColorButton(currColor, title);

      elmButton.push(React.createElement("span", null, colorButton));
    });

    function ButtonSelected() {
      return elmButton.map((data) => data);
    }
    ReactDOM.render(
      <ButtonSelected />,
      document.getElementById("button-action")
    );

    setTimeout(() => {
      handleSelectColor(dataOptions[0].color);
    }, 1000);
  };

  const makeColorButton = (color, title) => {
    let result = (
      <Tooltip title={title} arrow>
        <Button
          variant="outlined"
          size="small"
          style={{ borderColor: color, background: "white" }}
          data-color={color}
          ref={handleRef}
          className={`${classes.button} button-color`}
        >
          <ShowChartIcon style={{ color: color }} />
        </Button>
      </Tooltip>
    );

    return result;
  };

  const handleRef = (ref) => {
    window.google.maps.event.addDomListener(ref, "click", function () {
      let color = ref.getAttribute("data-color");
      handleSelectColor(color);
      handleShapeSelectedColor(color);
    });
  };

  const handleSelectColor = (color) => {
    dataOptions.map((data, index) => {
      if (data.color === color) {
        let buttons = document.getElementsByClassName("button-color");
        let icons = document.querySelectorAll("button.button-color span svg");

        let buttonElement = document.querySelector(`[data-color="${color}"]`);
        let iconElement = document.querySelector(
          `[data-color="${color}"] span svg`
        );

        for (let b = 0; b < buttons.length; b++) {
          buttons[
            b
          ].style.cssText = `background-color: white !important; border-color: ${buttons[
            b
          ].getAttribute("data-color")}`;
        }

        for (let i = 0; i < icons.length; i++) {
          icons[i].style.cssText = `color: ${buttons[i].getAttribute(
            "data-color"
          )} !important;`;
        }

        buttonElement.style.cssText = `background-color: ${color} !important;`;
        iconElement.style.cssText = `color: white;`;
      }
    });

    let buttonActive = dataOptions.filter((data) => data.color === color);

    let polylineOptions = drawingManager.get("polylineOptions");
    polylineOptions.strokeColor = color;
    polylineOptions.name = buttonActive[0].name;
    drawingManager.set("polylineOptions", polylineOptions);
  };

  const clearShapeSelected = () => {
    if (shapeSelected) {
      shapeSelected.setEditable(false);
      shapeSelected = null;
    }
  };

  const handleShapeSelected = (shape) => {
    clearShapeSelected();
    shape.setEditable(true);
    shapeSelected = shape;
    handleSelectColor(shape.get("strokeColor") || shape.get("fillColor"));
  };

  const handleShapeSelectedColor = (color) => {
    if (shapeSelected) {
      if (
        shapeSelected.type === window.google.maps.drawing.OverlayType.POLYLINE
      ) {
        shapeSelected.set("strokeColor", color);
      } else {
        shapeSelected.set("fillColor", color);
      }
    }
  };

  const handleDeleteShapeSelected = () => {
    let data = JSON.parse(localStorage.getItem("dataShape"));
    if (shapeSelected) {
      let newData = data.filter((shape) => shape.id !== shapeSelected.id);

      setDataShape(newData);
      localStorage.setItem("dataShape", JSON.stringify(newData));

      if(infoWindowActive) {
        infoWindowActive.open(null)
      }
      shapeSelected.setMap(null);
    }
  };

  const handleEditableShape = (shape, dataShape) => {
    if (infoWindowActive) {
      infoWindowActive.open(null);
    }
    let paths = handleParsePaths(shape);

    if (dataShape.length) {
      dataShape.map((data) => {
        if (data.id === shape.id) {
          data.path = paths;
        }
      });
    }

    localStorage.setItem("dataShape", JSON.stringify(dataShape));
  };

  const handleParsePaths = (shape) => {
    let paths = [];

    if (shape.type === "polyline") {
      let pathArray = shape.getPath().i;
      pathArray.forEach(function (path) {
        paths.push({ lat: path.lat(), lng: path.lng() });
      });
    }
    if (shape.type === "circle") {
      paths.push({ lat: shape.center.lat(), lng: shape.center.lng() });
    }

    return paths;
  };

  const randomID = () => {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 10);
  };

  return (
    <div className={classes.root}>
      <div id="panel" className={classes.panel}>
        <div id="button-action" className={classes.boxButton}></div>
        <div>
          <Button id="delete-button" variant="contained">
            Xóa 1 đường vẽ
          </Button>
        </div>
      </div>
      <div id="map" className={classes.rootMap}></div>
    </div>
  );
}

const styles = makeStyles(() => ({
  root: {
    width: "calc(100vw - 400px)",
    height: "100%",
    position: "relative",
  },
  rootMap: {
    width: "100%",
    height: "100%",
  },
  panel: {
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    position: "absolute",
    top: 0,
    left: "55%",
    zIndex: 10,
  },
  button: {
    margin: 5,
    minWidth: 30,
  },
  btnRemove: {
    cursor: "pointer",
  },
  boxButton: {
    display: "flex",
  },
}));
