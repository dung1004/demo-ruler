import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Popover,
  MenuList,
  MenuItem,
  ListItemIcon,
  Typography,
  IconButton,
} from '@material-ui/core'
import {
  MoreVert as MoreVertIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@material-ui/icons'
import { grey } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  a_link: {
    textDecoration: 'none',
    color: '#34495e',
  },
  itemNotifi: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px 0',
    position: 'relative',
    '&:hover': {
      background: grey[100],
    },
  },
  image: {
    width: 75,
    height: 60,
    padding: '0 8px',
    flex: 'none',
  },
  img: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  textDes: {
    fontSize: 14,
    marginBottom: 0,
    marginTop: 0,
  },
  licensePlate: {
    fontWeight: 'bold',
  },
  cameraAddress: {
    fontWeight: 'bold',
  },
  dateTime: {
    fontSize: 15,
    marginTop: 0,
    marginBottom: 0,
  },
  buttonAnime: {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  icon: {
    color: 'inherit',
    fontSize: 24,
    display: 'flex',
  },
  boxIcon: {
    marginRight: -10,
  },
  tagPAction: {
    fontSize: 14,
    color: grey[700],
    fontWeight: 'bold',
  },
}))

const ItemNotification = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [isShowMoreHover, setIsShowMoreHover] = useState(false)

  const open = Boolean(anchorEl)
  const classes = useStyles()

  const openMoreAction = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const hoverMoreAction = () => {
    setIsShowMoreHover(true)
  }

  const cancelHoverMore = () => {
    setIsShowMoreHover(false)
  }

  return (
    <a href="##" className={classes.a_link}>
      <div
        className={classes.itemNotifi}
        onMouseEnter={hoverMoreAction}
        onMouseLeave={cancelHoverMore}
      >
        <div className={classes.image}>
          <img
            src="https://photo-1-baomoi.zadn.vn/w1000_r1/2018_11_19_11_28643706/655302fe4cbfa5e1fcae.jpg"
            className={classes.img}
            alt="59C2-02037"
          />
        </div>
        <div>
          <p className={classes.textDes}>
            Đã phát hiện phương tiện biển kiểm soát{' '}
            <span className={classes.licensePlate}>59C2-02037</span> tại camera{' '}
            <span className={classes.cameraAddress}>Camera Hà Huy Tập 1</span>
          </p>
          <p className={classes.dateTime}>26/10/2019 08:43:19</p>
        </div>
        {isShowMoreHover ? (
          <IconButton onClick={openMoreAction} className={classes.buttonAnime}>
            <MoreVertIcon className={classes.icon} />
          </IconButton>
        ) : null}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuList>
            <MenuItem>
              <ListItemIcon className={classes.boxIcon}>
                <VisibilityOffIcon className={classes.icon} />
              </ListItemIcon>
              <Typography className={classes.tagPAction}>
                Ẩn thông báo này
              </Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon className={classes.boxIcon}></ListItemIcon>
              <Typography className={classes.tagPAction}>
                Tắt tất cả thông báo này{' '}
              </Typography>
            </MenuItem>
          </MenuList>
        </Popover>
      </div>
    </a>
  )
}

export default ItemNotification
