import React, { Component } from "react";
import ReactDOM from 'react-dom'
import { IconButton, Button, Tooltip } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles";
import ShowChartIcon from '@material-ui/icons/ShowChart';

const style = {
  root: {
    width: "100%",
    height: "100vh",
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
    minWidth: 30
  },
  btnRemove: {
    cursor: "pointer",
  },
  boxButton: {
    display: "flex"
  },
};

class DrawLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawingManager: null,
      shapeSelected: null,
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
    let _this = this;
    window.addEventListener("load", function () {
      _this.init();
    });
  }

  componentDidUpdate() {
    let { drawingManager, dataShape } = this.state;
    let _this = this;
    if (drawingManager) {
      window.google.maps.event.addListener(
        drawingManager,
        "overlaycomplete",
        (e) => _this.handleFinishDrawShape(e, drawingManager, dataShape)
      );
    }
  }

  init = () => {
    let { drawingManager } = this.state;
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

    this.setState(
      {
        ...this.state,
        drawingManager,
      }
      
      // ,
      // () => this.buildColorPalette()
    );

    this.buildColorPalette()

    window.google.maps.event.addListener(
      drawingManager,
      "drawingmode_changed",
      this.clearShapeSelected
    );
    window.google.maps.event.addListener(map, "click", this.clearShapeSelected);
    window.google.maps.event.addDomListener(
      document.getElementById("delete-button"),
      "click",
      this.handleDeleteShapeSelected
    );

    this.loadData(drawingManager, map);
  };

  loadData = (drawingManager, map) => {
    let { dataShape } = this.state;

    console.log('data', dataShape)
    let _this = this;

    dataShape.map((data) => {
      let polyline = new window.google.maps.Polyline({
        path: data.path,
        strokeColor: data.color,
        strokeWeight: 4,
        id: data.id,
        type: data.type
      });

      window.google.maps.event.addListener(polyline, "click", () =>
        _this.handleShapeSelected(polyline)
      );

      window.google.maps.event.addListener(polyline.getPath(), "set_at", () =>
        _this.handleEditableShape(polyline, dataShape)
      );

      polyline.setMap(map);
    });
  };

  handleFinishDrawShape = (e, drawingManager, dataShape) => {
    let _this = this
    let id = this.randomID();
    let newShape = e.overlay;
    newShape.type = e.type;
    newShape.id = id;

    drawingManager.setDrawingMode(null);

    let paths = this.handleParsePaths(newShape);

    let objectShape = {
      id,
      path: paths,
      color: newShape.strokeColor,
      name: newShape.name,
      type: newShape.type,
    };

    dataShape = [...dataShape, objectShape];

    this.setState({
      ...this.state,
      dataShape,
    });
    localStorage.setItem("dataShape", JSON.stringify(dataShape));

    window.google.maps.event.addListener(newShape, "click", function (e) {
      _this.handleShapeSelected(newShape);

      _this.setState({
        ..._this.state,
        shapeClick: true,
      });
    });

    if(newShape.type === 'polyline') {
      window.google.maps.event.addListener(newShape.getPath(), "set_at", () =>
        this.handleEditableShape(newShape, dataShape)
      );
    }

    this.handleShapeSelected(newShape);
  };

  clearShapeSelected = () => {
    let { shapeSelected } = this.state;
    console.log('shapeSelected', shapeSelected)
    if (shapeSelected) {
      shapeSelected.setEditable(false);
      this.setState({
        ...this.state,
        shapeClick: false,
        shapeSelected: null,
      });
    }
  };

  handleShapeSelected = (shape) => {
    this.clearShapeSelected();
    shape.setEditable(true);
    this.handleSelectColor(shape.get("strokeColor") || shape.get("fillColor"));
    
    // let elm = document.querySelector("#button-action").style.opacity = ".4"
    // console.log(elm)
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

  handleRef = (ref) => {
    let _this = this
    window.google.maps.event.addDomListener(ref, "click", function () {
      let color = ref.getAttribute('data-color')
      _this.handleSelectColor(color);
      _this.handleShapeSelectedColor(color);
    });
  }

  handleSelectColor = (color) => {
    let { dataOptions, drawingManager } = this.state;
    console.log('drawingManager', drawingManager)

    dataOptions.map((data, index) => {
      
      if(data.color === color) {
        let buttons = document.getElementsByClassName("button-color")
        let icons = document.querySelectorAll("button.button-color span svg")
        
        let buttonElement = document.querySelector(`[data-color="${color}"]`)
        let iconElement = document.querySelector(`[data-color="${color}"] span svg`)


        for(let b = 0; b < buttons.length; b++) {
          buttons[b].style.cssText = `background-color: white !important; border-color: ${buttons[b].getAttribute('data-color')}`
          
        }

        for(let i = 0; i < icons.length; i++) {
          icons[i].style.cssText = `color: ${buttons[i].getAttribute('data-color')} !important;`
        }
      
        buttonElement.style.cssText = `background-color: ${color} !important;`
        iconElement.style.cssText = `color: white;`
      }
    });

    let buttonActive = dataOptions.filter((data) => data.color === color);

    let polylineOptions = drawingManager.get("polylineOptions");
    polylineOptions.strokeColor = color;
    polylineOptions.name = buttonActive[0].name;
    drawingManager.set("polylineOptions", polylineOptions);
  };

  makeColorButton = (color, title) => {
   
    const { classes } = this.props
     let result =  <Tooltip title={title} arrow >
                      <Button variant="outlined" size="small" style={{borderColor: color, background: "white", }} data-color={color} ref={this.handleRef} className={`${classes.button} button-color`} >
                        <ShowChartIcon style={{color: color}} />
                      </Button>
                  </Tooltip>

    return result;
  };

  buildColorPalette = () => {
    let { dataOptions } = this.state;
    let elmButton = []
    dataOptions.map((data, index) => {
      let currColor = data.color;
      let title = data.name
      let colorButton = this.makeColorButton(currColor, title);

      elmButton.push(React.createElement('span', null, colorButton));
      
    });


    function ButtonSelected() {
      return elmButton.map(data => data)
    }
    ReactDOM.render(<ButtonSelected />, document.getElementById('button-action'))

    setTimeout(() => {
      this.handleSelectColor(dataOptions[0].color);
    }, 1000)
  };

  handleDeleteShapeSelected = () => {
    let { shapeSelected, dataShape } = this.state;
    if (shapeSelected) {
      console.log("shapeSelected", shapeSelected);
      let newData = dataShape.filter((shape) => shape.id !== shapeSelected.id);

      this.setState({
        ...this.state,
        dataShape: newData,
      });

      localStorage.setItem("dataShape", JSON.stringify(newData));
      shapeSelected.setMap(null);
    }
  };

  handleEditableShape = (shape, dataShape) => {
    let paths = this.handleParsePaths(shape);
    console.log('shape', shape)
    console.log('paths', paths)

    if (dataShape.length) {
      dataShape.map((data) => {
        if (data.id === shape.id) {
          data.path = paths;
        }
      });
    }

    localStorage.setItem("dataShape", JSON.stringify(dataShape));
  };

  handleParsePaths = (shape) => {
    let paths = [];

    if(shape.type === 'polyline') {
      let pathArray = shape.getPath().i;
      pathArray.forEach(function (path) {
        paths.push({ lat: path.lat(), lng: path.lng() });
      });

    }
    if(shape.type === 'circle') {
      paths.push({ lat: shape.center.lat(), lng: shape.center.lng() })
    }
    
    return paths;
  };

  randomID = () => {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 10);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div id="panel" className={classes.panel}>
          <div id="button-action" className={classes.boxButton}></div>
          <div>
            <Button id="delete-button" variant="contained"> Xóa 1 đường vẽ </Button>
          </div>
        </div>
        <div id="map" className={classes.root}></div>
      </div>
    );
  }
}

export default withStyles(style)(DrawLine);
