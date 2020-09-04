import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

const style = {
  root: {
    width: "100%",
    height: "100vh",
  },
  panel: {
    width: 200,
    fontFamily: "Arial, sans-serif",
    fontSize: 13,
    position: "absolute",
    top: 10,
    left: "60%",
    zIndex: 10,
  },
  btnRemove: {
    cursor: "pointer"
  }
};

class DrawLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawingManager: "",
      shapeSelected: null,
      colorButtons: {},
      shapeClick: false,
      dataShape: JSON.parse(localStorage.getItem("dataShape")) || [],
      dataOptions: [
        { color: "#1E90FF", shape: "polyline", name: "cấm đỗ giờ cao điểm" },
        { color: "#FF1493", shape: "polyline", name: "cấm đỗ ngày chẵn" },
        { color: "#32CD32", shape: "polyline", name: "cấm đỗ ngày lẻ" },
        { color: "#FF8C00", shape: "polyline", name: "cấm đỗ qua đêm" },
        { color: "#4b0082", shape: "polyline", name: "cấm đỗ sau 11h" },
      ],
    };
  }
  componentDidMount() {
    this.init();
  }

  init = () => {
    let { drawingManager, dataShape } = this.state;
    var map = new window.google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: new window.google.maps.LatLng(16.059506, 108.219112),
      mapTypeId: window.google.maps.MapTypeId.SATELLITE,
    });

    drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ["polyline"],
      },

      polylineOptions: {
        editable: true,
        draggable: true,
      },
      map: map,
    });

    this.setState({
      ...this.state,
      drawingManager,
    }, () => this.buildColorPalette() );

    let _this = this;

    window.google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      function (e) {
        let newShape = e.overlay;
        newShape.type = e.type;

        drawingManager.setDrawingMode(null);

        let paths = []
        let pathArray = newShape.getPath().i;
        pathArray.forEach(function(path) {
          paths.push({ lat: path.lat(), lng: path.lng() })
        })

        let objectShape = {
          path: paths,
          color: newShape.strokeColor,
          name: newShape.name,
          type: newShape.type
        }

        dataShape = [...dataShape, objectShape]
        localStorage.setItem("dataShape", JSON.stringify(dataShape))

        console.log('path', paths)
        console.log('objectShape', objectShape)
        console.log('newShape', newShape)
        window.google.maps.event.addListener(newShape, "click", function (e) {
          _this.handleShapeSelected(newShape);

          _this.setState({
            ..._this.state,
            shapeClick: true
          })
          // console.log('e click', e.vertex)
        });

        _this.handleShapeSelected(newShape)
      }
    );

    window.google.maps.event.addListener(drawingManager, 'drawingmode_changed', this.clearShapeSelected);
    window.google.maps.event.addListener(map, 'click', this.clearShapeSelected);
    window.google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', this.handleDeleteShapeSelected);


    this.loadData(drawingManager, map)

  };

  loadData = (drawingManager, map) => {
    let { dataShape } = this.state
    let _this = this

    dataShape.map(data => {
      let polyline = new window.google.maps.Polyline({
        path: data.path,
        strokeColor: data.color,
        strokeWeight: 3
      }) 

      window.google.maps.event.addListener(polyline, "click", function(e) {
        _this.handleShapeSelected(polyline);
      })

      polyline.setMap(map)
    })
   
  }

  clearShapeSelected = () => {
    let { shapeSelected } = this.state;

    if (shapeSelected) {
      shapeSelected.setEditable(false);
      this.setState({
        ...this.state,
        shapeClick: false,
        shapeSelected: null
      });
    }
  };

  handleShapeSelected = (shape) => {
    this.clearShapeSelected();
    shape.setEditable(true);
    this.handleSelectColor(shape.get("strokeColor") || shape.get("fillColor"));

    this.setState({
      ...this.state,
      shapeSelected: shape,
    });
  };

  handleShapeSelectedColor = (color) => {
    let { shapeSelected } = this.state;
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

  handleSelectColor = (color) => {
    let { dataOptions, colorButtons, drawingManager } = this.state;


    dataOptions.map((data, index) => {
      let currColor = data.color;
      colorButtons[currColor].style.border =
        currColor === color ? "5px solid white" : "5px solid transparent";
    });

    let dataActive = dataOptions.filter(data => data.color === color)
    // console.log(dataActive)

    let polylineOptions = drawingManager.get('polylineOptions');
    polylineOptions.strokeColor = color;
    polylineOptions.name = dataActive[0].name
    drawingManager.set('polylineOptions', polylineOptions);
    
  };

  makeColorButton = (color) => {
    let _this = this;
    let span = document.createElement("span");
    span.className = "color_button";
    span.style.cssText = `background-color: ${color}; width: 15px; height: 15px; cursor: pointer; display: inline-block   `;
    window.google.maps.event.addDomListener(span, "click", function () {
      _this.handleSelectColor(color);
      _this.handleShapeSelectedColor(color);
    });

    return span;
  };

  buildColorPalette = () => {
    let { dataOptions, colorButtons } = this.state;
    let colorPalette = document.getElementById("color-palette");
    dataOptions.map((data, index) => {
      let currColor = data.color;
      let colorButton = this.makeColorButton(currColor);
      colorPalette.appendChild(colorButton);
      colorButtons[currColor] = colorButton;
    });

    this.handleSelectColor(dataOptions[0].color);
  };

  handleDeleteShapeSelected = () => {
    let { shapeSelected } = this.state
    let data = JSON.parse(localStorage.getItem("dataShape"))

    if(shapeSelected) {
      console.log('shapeSelected', shapeSelected)
      let newData = data.filter(shape => shape.color !== shapeSelected.strokeColor)
      localStorage.setItem("dataShape", JSON.stringify(newData))
      shapeSelected.setMap(null)
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div id="panel" className={classes.panel}>
          <div id="color-palette"></div>
          <div>
            <button id="delete-button" className={classes.btnRemove}>Delete Selected Shape</button>
          </div>
        </div>
        <div id="map" className={classes.root}></div>
      </div>
    );
  }
}

export default withStyles(style)(DrawLine);
