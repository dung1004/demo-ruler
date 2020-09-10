import React from "react";
import { makeStyles } from "@material-ui/core";
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  Info as InfoIcon,
} from "@material-ui/icons";

import camera1 from "./../../../../../assets/images/list_parking/1.png";

const ItemParking = (props) => {
  const classes = styles();
  const { camera } = props;
  return (
    <div className={""}>
      <Card className={classes.card}>
        <div className={classes.image}>
          <CardMedia
            className={classes.img}
            image={camera1}
            title="Contemplative Reptile"
          />
        </div>
        <CardContent className={classes.contentCard}>
          <Typography gutterBottom variant="h5" className={classes.nameCamera}>
            {camera.name}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            className={classes.address}
            noWrap
          >
            {camera.address}
          </Typography>

          <CardActions className={classes.cardActions}>
            <Tooltip title="Theo dõi" arrow className={classes.tooltip}>
              <IconButton >
                <VisibilityIcon className={classes.icon} fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Thông tin" arrow className={classes.tooltip}>
              <IconButton>
                <InfoIcon className={classes.icon} fontSize="small" />
              </IconButton>
            </Tooltip>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemParking;

const styles = makeStyles(() => ({
  card: {
    display: "flex",
    cursor: "pointer",
    marginBottom: 5,
    background: "transparent",
  },
  cardActive: {
    background: "#00000014",
  },
  image: {
    width: 130,
    display: "block",
  },
  img: {
    width: "100%",
    paddingTop: "63%",
  },
  contentCard: {
    padding: "6px 0px 0 20px !important",
  },
  nameCamera: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 0,
  },
  address: {
    fontSize: 13,
    color: "black",
  },
  icon: {
    padding: 6,
  },
  cardActions: {
    padding: 0,
  },
  tooltip: {
    padding: 0,
  },
}));
