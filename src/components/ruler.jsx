/* eslint-disable no-unused-expressions */
import React, { Component } from "react";

import "./styles.css";

class ruler extends Component {
  constructor(props) {
    super(props);
    this.options = {
      canvasWidth: document.body.clientWidth || 375,
      canvasHeight: 83,
      boxColor: "#E4E4E4",
      scrollLeft: 0,
      heightDecimal: 35,
      heightDigit: 18,
      lineWidth: 2,
      colorDecimal: "#E4E4E4",
      colorDigit: "#E4E4E4",
      divide: 10,
      precision: 1,
      fontSize: 12,
      fontColor: "#666",
      fontMarginTop: 35,
      maxValue: 1440,
      minValue: 0,
      currentValue: 0,
      seconds: 0,
    };

    this.localState = {
      startX: 0,
      startY: 0,
      isTouchEnd: true,
      touchPoints: [],
    };

    this.state = {
      value: 0,
      date: new Date(),
      startTimeDate: {
        setDate: 0,
        setMonth: 0,
        setYear: 0,
        setHours: 0,
        setMinutes: 0,
        setSeconds: 0
      },
    };
  }

  componentDidMount() {
    const { canvasWidth, canvasHeight } = this.options;
    let canvas = document.getElementById("timeline");

    canvas.width = canvasWidth * 2;
    canvas.height = canvasHeight * 2;
    canvas.style.width = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";
    if (this.browserEnv) {
      canvas.ontouchstart = this.touchStart.bind(this);
      canvas.ontouchmove = this.touchMove.bind(this);
      canvas.ontouchend = this.touchEnd.bind(this);
    } else {
      canvas.onmousedown = this.touchStart.bind(this);
      canvas.onmousemove = this.touchMove.bind(this);
      canvas.onmouseup = this.touchEnd.bind(this);
    }
    this.drawRuler();
    this.setStartTimeDate()
  }

  touchStart(e) {
    e.preventDefault();
    if (e || this.localState.isTouchEnd) {
      this.touchPoints(e);
      let touch = (e.touches && e.touches[0]) || e;
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
      // this.localState.startT = new Date().getTime();
      this.localState.isTouchEnd = false;
      // console.log("localState in touchStart", this.localState);
    }
  }

  touchMove(e) {
    if (!this.browserEnv && (e.which !== 1 || e.buttons === 0)) return;
    this.touchPoints(e);
    let touch = (e.touches && e.touches[0]) || e,
      deltaX = touch.pageX - this.localState.startX,
      deltaY = touch.pageY - this.localState.startY;
    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(Math.round(deltaX / this.options.divide)) > 0
    ) {
      if (this.browserEnv && !this.rebound(deltaX)) {
        return;
      }
      this.moveDreaw(deltaX);
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
    }
  }

  touchEnd() {
    this.moveDreaw(this.browserEnv ? this.inertialShift() : 0);
    this.localState.isTouchEnd = true;
    this.localState.touchPoints = [];
  }

  touchPoints(e) {
    let touch = (e.touches && e.touches[0]) || e,
      time = new Date().getTime(),
      shift = touch.pageX;

    this.localState.touchPoints.push({ time, shift });
  }

  moveDreaw(shift) {
    const { divide, precision } = this.options;
    let moveValue = Math.round(-shift / divide),
      _moveValue = Math.abs(moveValue),
      draw = () => {
        if (_moveValue < 1) {
          return;
        }

        this.options.currentValue += Math.sign(moveValue) * precision;

        // this.options.seconds++;

        // if (this.options.seconds === 60) {
        //   this.options.currentValue += Math.sign(moveValue) * precision;
        //   this.options.seconds = 0;
        // }

        // console.log("currentValue : ", this.options.currentValue);
        // console.log("this.options.seconds : ", this.options.seconds);
        this.drawRuler();
        window.requestAnimationFrame(draw);
        _moveValue--;
      };
    draw();
  }

  drawRuler = () => {
    const canvas = document.getElementById("timeline"),
      context = canvas.getContext("2d");
    // eslint-disable-next-line no-self-assign
    canvas.height = canvas.height;
    let {
      canvasWidth,
      canvasHeight,
      maxValue,
      minValue,
      currentValue,
      precision,
      divide,
      heightDecimal,
      heightDigit,
      lineWidth,
      colorDecimal,
      colorDigit,
      fontSize,
      fontColor,
      fontMarginTop,
      seconds,
    } = this.options;

    currentValue =
      currentValue > minValue
        ? currentValue < maxValue
          ? currentValue
          : maxValue
        : minValue;

    currentValue =
      (Math.round((currentValue * 10) / precision) * precision) / 10;
    this.options.currentValue = currentValue;

    this.handleValue(currentValue);

    let diffCurrentMin = ((currentValue - minValue) * divide) / precision;
    let startValue =
      currentValue - Math.floor(canvasWidth / 2 / divide) * precision;
    startValue =
      startValue > minValue
        ? startValue < maxValue
          ? startValue
          : maxValue
        : minValue;
    let endValue = startValue + (canvasWidth / divide) * precision;
    endValue = endValue < maxValue ? endValue : maxValue;
    let origin = {
      x:
        diffCurrentMin > canvasWidth / 2
          ? (canvasWidth / 2 -
              ((currentValue - startValue) * divide) / precision) *
            2
          : (canvasWidth / 2 - diffCurrentMin) * 2,
      y: canvasHeight * 2,
    };

    heightDecimal = heightDecimal * 2;
    heightDigit = heightDigit * 2;
    lineWidth = lineWidth * 2;
    fontSize = fontSize * 2;
    fontMarginTop = fontMarginTop * 2;
    divide = divide * 2;
    const derivative = 1 / precision;

    for (let i = 0; i <= 1440; i++) {
      context.beginPath();
      context.moveTo(origin.x + (i - startValue / precision) * divide, 0);
      context.lineTo(
        origin.x + (i - startValue / precision) * divide,
        i % 60 === 0 ? heightDecimal : heightDigit
      );
      context.lineWidth = lineWidth;
      context.strokeStyle = i % 10 === 0 ? colorDecimal : colorDigit;
      context.stroke();
      context.fillStyle = fontColor;
      context.textAlign = "center";
      context.textBaseline = "top";
      if (i % 60 === 0) {
        context.font = `${fontSize}px Arial`;
        context.fillText(
          Math.round(i / 60) / (derivative / 1) + ":00",
          origin.x + (i - startValue / precision) * divide,
          fontMarginTop
        );
      }

      context.closePath();
    }
  };

  handleValue = (value) => {
    if (value) {
      this.setState({
        value,
      });
    }
  };


  setStartTimeDate = () => {
    const { date } = this.state;
      date.setDate(2);
      date.setMonth(6);
      date.setYear(2020);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      this.setState({
        startTimeDate: {
          setDate: date.getDate() ,
          setMonth: date.getMonth(),
          setYear: date.getYear(),
          setHours: date.getHours(),
          setMinutes: date.getMinutes(),
          setSeconds: date.getSeconds()
        }
        
      })
  }



  render() {
    const { value, date, startTimeDate } = this.state;
    
      
    // console.log("render value", value);
    console.log("render startDate", date.getDate());
    console.log("render startDate", startTimeDate);

    return (
      <div className="box-canvas">
        <div className="show-value">
          <span> {value} </span>
        </div>
        <canvas id="timeline" width="1920" height="30"></canvas>
      </div>
    );
  }
}

export default ruler;
