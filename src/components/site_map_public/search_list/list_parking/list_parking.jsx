import React from "react";
import { makeStyles } from "@material-ui/core";
import { Scrollbars } from "react-custom-scrollbars";

import ItemParking from "./item_parking/item_parking";

const ListParking = () => {
  const classes = styles();
  const listParking = [
    {
      id: "5ed7274f94d0787eb85f35df",
      lat: 16.05919362392213,
      lng: 108.1860061841509,
      name: "Camera 1 - Huỳnh Ngọc Huệ",
      address: " Hòa Khê,  Thanh Khê,  Đà Nẵng",
    },
    {
      id: "5ed7277b94d0787eb85f35e0",
      lat: 16.059180084536656,
      lng: 108.18604122050616,
      name: "Camera 2 - Huỳnh Ngọc Huệ",
      address: " Hai chau 1, Hải Châu, Đà Nẵng",
    },
    {
      id: "5ed727a294d0787eb85f35e1",
      lat: 16.059173296588305,
      lng: 108.1860150099709,
      name: "Camera 3 - Hà Huy Tập",
      address: " Hòa Khê,  Thanh Khê,  Đà Nẵng",
    },
    {
      id: "5ed727c294d0787eb85f35e2",
      lat: 16.059200851345835,
      lng: 108.18603015639397,
      name: "Camera 4 - Hà Huy Tập",
      address: " Hòa Khê,  Thanh Khê,  Đà Nẵng",
    },
  ];
  return (
    <div className={classes.root}>
      <h4 className={classes.title}>
        DANH SÁCH BÃI ĐÕ XE (<span>8</span>)
      </h4>
      <div className={classes.boxScrollCard}>
        <Scrollbars>
          <div className={classes.boxCameraItem}>
            {listParking.length > 0
              ? listParking.map((camera) => {
                  return (
                    <ItemParking
                      //   showPopupMarker={showPopupMarker}
                      camera={camera}
                      key={camera.id}
                      //   markerActive={markerActive}
                    />
                  );
                })
              : null}
          </div>
        </Scrollbars>
      </div>
    </div>
  );
};

export default ListParking;

const styles = makeStyles(() => ({
  root: {
    width: 400,
    flexGrow: 1,
  },
  boxScrollCard: {
    flexGrow: 1,
    height: "100%",
  },
  title: {
    margin: 10,
  },
  boxCameraItem: {
    padding: "0 10px",
  },
}));
