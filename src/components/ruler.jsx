/* eslint-disable no-unused-expressions */
import React, { Component } from "react";

import "./styles.css";

class ruler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        divide: 10,
        precision: 1,
        currentValue: 160,
      },
    };

    this.localState = {
      startX: 0,
      startY: 0,
      isTouchEnd: true,
      touchPoints: [],
    };
  }

  componentDidMount() {
    this.drawRuler();
    let canvas = document.getElementById("timeline");
    if (this.browserEnv) {
      canvas.ontouchstart = this.touchStart.bind(this);
      canvas.ontouchmove = this.touchMove.bind(this);
      canvas.ontouchend = this.touchEnd.bind(this);
    } else {
      canvas.onmousedown = this.touchStart.bind(this);
      canvas.onmousemove = this.touchMove.bind(this);
      canvas.onmouseup = this.touchEnd.bind(this);
    }
  }

  drawRuler = () => {
    let canvas = document.getElementById("timeline");
    let context = canvas.getContext("2d");

    let spacing = 20;
    context.lineWidth = 1;
    context.strokeStyle = "#555";
    context.beginPath();
    for (var interval = 0; interval < 200; interval++) {
      context.moveTo(interval * spacing + 0.5, 50);
      context.lineTo(interval * spacing + 0.5, 5);
      context.stroke();
    }
  };

  touchStart(e) {
    e.preventDefault();
    if (e || this.localState.isTouchEnd) {
      this.touchPoints(e);
      let touch = (e.touches && e.touches[0]) || e;
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
      this.localState.startT = new Date().getTime();
      this.localState.isTouchEnd = false;
      //   console.log("touch", touch);
    }
  }

  touchMove(e) {
    //   console.log("e", e);
    if (!this.browserEnv && (e.which !== 1 || e.buttons === 0)) return;
    this.touchPoints(e);
    let touch = (e.touches && e.touches[0]) || e,
      deltaX = touch.pageX - this.localState.startX,
      deltaY = touch.pageY - this.localState.startY;
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(Math.round(deltaX / this.state.options.divide)) > 0
    ) {
      if (this.browserEnv && !this.rebound(deltaX)) {
        return;
      }
      // this.moveDreaw(deltaX);
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
    }

    //   console.log('state in touch move: ', this.state.localState);
  }

  touchEnd() {
    //   this.moveDreaw(this.browserEnv ? this.inertialShift() : 0);
    //   this.setState({
    //     localState: {
    //       isTouchEnd: true,
    //       arrTouchPoints: [],
    //     },
    //   });
  }

  touchPoints(e) {
    let touch = (e.touches && e.touches[0]) || e,
      time = new Date().getTime(),
      shift = touch.pageX;

    this.localState.touchPoints.push({ time: time, shift: shift });

    console.log(this.localState);
    console.log(this.localState.touchPoints);
  }

  // moveDreaw(shift) {
  //   const { divide, precision } = this.state.options;
  //   let moveValue = Math.round(-shift / divide),
  //     _moveValue = Math.abs(moveValue),
  //     draw = () => {
  //       if (_moveValue < 1) {
  //         return;
  //       }
  //       this.state.options.currentValue += Math.sign(moveValue) * precision;
  //       this.dreawCanvas();
  //       window.requestAnimationFrame(draw);
  //       _moveValue--;
  //     };
  //   draw();
  // }

  render() {
    const { localState } = this;

    //localState?.arrTouchPoints?.length > 0 ? console.log("state render", localState) : null

    return (
      <div className="box-canvas">
        <canvas id="timeline" width="1920" height="30"></canvas>
      </div>
    );
  }
}

export default ruler;
