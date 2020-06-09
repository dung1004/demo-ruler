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
      heightDigit: 0,
      lineWidth: 2,
      colorDecimal: "#E4E4E4",
      colorDigit: "#E4E4E4",
      divide: 3,
      precision: 1,
      fontSize: 12,
      fontColor: "#666",
      fontMarginTop: 35,
      maxValue: 360,
      minValue: 0,
      currentValue: null,
      dateCurrent: null,
      max: null,
    };

    this.localState = {
      startX: 0,
      startY: 0,
    };

    this.state = {
      isMouseDown: false,
      value: 0,
      date: new Date(),
      startTimeDate: {
        startDate: 31,
        startMonth: 1,
        startYear: 2020,
        startHours: 23,
        startMinutes: 59,
        startSeconds: 40,
      },
      endTimeDate: {
        endDate: null,
        endMonth: null,
        endYear: null,
        endHours: null,
        endMinutes: null,
        endSeconds: null,
      },
    };
  }

  componentDidMount() {
    this.showCurrentValueWithStartTime();

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
    this.setEndTimeDate();
  }

  touchStart(e) {
    this.setState({
      isMouseDown: true,
    });
    e.preventDefault();
    if (e) {
      let touch = e;
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
    }
  }

  touchMove(e) {
    if (this.state.isMouseDown) {
      if (!this.browserEnv && (e.which !== 1 || e.buttons === 0)) return;
      let touch = e,
        deltaX = touch.pageX - this.localState.startX;

      this.moveDreaw(deltaX);
      this.localState.startX = touch.pageX;
      this.localState.startY = touch.pageY;
    }
  }

  touchEnd(e) {
    this.setState({
      isMouseDown: false,
    });
  }

  moveDreaw(deltaX) {
    const { divide, precision } = this.options;
    let moveValue = Math.round(-deltaX / divide),
      _moveValue = Math.abs(moveValue),
      draw = () => {
        if (_moveValue < 1) {
          return;
        }
        this.options.currentValue += Math.sign(moveValue) * precision;

        if (this.state.isMouseDown) {
          requestAnimationFrame(draw);
        }

        this.drawRuler();
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
      max,
    } = this.options;

    let { startTimeDate, endTimeDate } = this.state;

    if (
      startTimeDate.startDate === endTimeDate.endDate &&
      startTimeDate.startMonth === endTimeDate.endMonth &&
      startTimeDate.startYear === endTimeDate.endYear &&
      startTimeDate.startHours === endTimeDate.endHours &&
      startTimeDate.startMinutes === endTimeDate.endMinutes &&
      startTimeDate.startSeconds === endTimeDate.endSeconds
    ) {
      this.options.max = currentValue;
    }

    if (max) {
      currentValue = currentValue < max ? currentValue : max;
    }
    currentValue = currentValue > minValue ? currentValue : minValue;

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

    if (endValue === maxValue) {
      endValue = currentValue + maxValue;
    }

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
    let i = 0;
    for (
      i =
        currentValue < maxValue
          ? Math.round((startValue / precision) * 10) / 10
          : endValue - 700;
      i <= endValue / precision;
      i++
    ) {
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
          Math.round((i / 60) % 60) / (derivative / 1) + ":00",
          origin.x + (i - startValue / precision) * divide,
          fontMarginTop
        );
      }
      context.closePath();
    }
  };

  handleValue = (value) => {
    if (value) {
      let {
        startDate,
        startMonth,
        startYear,
        startHours,
        startMinutes,
        startSeconds,
      } = this.state.startTimeDate;
      let nDate = startDate;
      // let newDate = 0;

      for (let i = 0; i < value; i++) {
        startSeconds++;

        startHours = Math.floor(i / 3600);
        startMinutes = Math.floor(i / 60) % 60;

        if (i % 60 === 0) {
          startSeconds = 1;
        }
      }

      if (startHours % 24 === 0) {
        nDate += 1;
      }

      if (
        startMonth === 1 ||
        startMonth === 3 ||
        startMonth === 5 ||
        startMonth === 7 ||
        startMonth === 8 ||
        startMonth === 10 ||
        startMonth === 12
      ) {
        // console.log('ndate in 31',  this.state.startTimeDate);

        nDate %= 31;
        // startDate = 0;

        if (nDate === 31 && nDate % 31 === 0) {
          nDate = 31;
        }

        if (nDate % 31 === 1) {
          startMonth++;
        }
      }

      if (startMonth === 2) {
        // console.log('ndate in 28', this.state.startTimeDate);

        nDate %= 28;
        startDate = 0;

        if (nDate === 28 && nDate % 28 === 0) {
          nDate = 28;
        }

        // if (nDate % 28 === 1) {
        //   startMonth++;
        // }
      }
      if (
        startMonth === 4 ||
        startMonth === 6 ||
        startMonth === 9 ||
        startMonth === 11
      ) {
        console.log(nDate);

        nDate %= 30;
        startDate = 0;

        if (nDate % 30 === 0) {
          nDate = 30;
        }

        if (nDate >= 30 && nDate % 30 === 1) {
          startMonth++;
        }
      }
      this.setState({
        ...this.state,
        value,
        startTimeDate: {
          startDate,
          startMonth,
          startYear,
          startHours: startHours % 24,
          startMinutes,
          startSeconds,
          newDate: nDate,
        },
      });
    }
  };

  showCurrentValueWithStartTime = () => {
    let {
      startHours,
      startMinutes,
      startSeconds,
      startDate,
    } = this.state.startTimeDate;
    let d = startDate * 86400;
    let h = startHours * 3600;
    let m = startMinutes * 60;

    let newCurrentValue = h + m + startSeconds;
    let dateCurrent = d + newCurrentValue;
    this.options.currentValue = newCurrentValue;
    this.options.dateCurrent = dateCurrent;
  };

  setEndTimeDate = () => {
    const { date } = this.state;

    this.setState({
      ...this.state,
      endTimeDate: {
        endDate: date.getDate(),
        endMonth: date.getMonth() + 1,
        endYear: date.getFullYear(),
        endHours: date.getHours(),
        endMinutes: date.getMinutes(),
        endSeconds: date.getSeconds() + 1,
      },
    });
  };

  render() {
    const { value, startTimeDate, endTimeDate } = this.state;

    return (
      <div className="box-canvas">
        <div className="show-value">
          <span>
            <b>
              Ngày:
              {`${
                startTimeDate.newDate
                  ? startTimeDate.newDate
                  : startTimeDate.startDate
              }/${startTimeDate.startMonth}/${startTimeDate.startYear}`}{" "}
            </b>
          </span>
          <span className="time">
            <b>
              {`${startTimeDate.startHours}h ${startTimeDate.startMinutes}p ${startTimeDate.startSeconds}s`}
            </b>{" "}
          </span>
        </div>

        <div className="endTime">
          <span>
            <b>
              Ngày:
              {`${endTimeDate.endDate}/${endTimeDate.endMonth}/${endTimeDate.endYear}`}
            </b>
          </span>
          <span className="time">
            <b>
              {`${endTimeDate.endHours}h ${endTimeDate.endMinutes}p ${endTimeDate.endSeconds}s`}
            </b>{" "}
          </span>
        </div>
        <canvas id="timeline" width="1920" height="30"></canvas>
      </div>
    );
  }
}

export default ruler;
