import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Divider,
  AppBar,
  Grid,
  IconButton,
  Button,
  Tooltip,
  Badge,
  Avatar,
  Popover,
} from '@material-ui/core'
import NotificationsOutlinedIcon from '@material-ui/icons/NotificationsOutlined'
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons'

import Vanlang from './../../assets/images/logo_vanlang.jpg'
import CenticLogo from './../../assets/images/centic_logo.png'
// import BoxNotification from './components/box_notification'
// import ExtendMenuAdmin from './components/extend_admin'

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: 'white',
    flexDirection: 'row',
    color: 'inherit',
  },
  logoWrapper: {
    height: '100%',
  },
  logoImg: {
    height: '100%',
    // padding: 10,
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
  },
  rightNav: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    marginLeft: 'auto',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
  },
  nameUser: {
    textTransform: 'initial',
    marginLeft: 5,
    fontWeight: 600,
    color: '#353535',
  },
}))

function DashboardHeader(props) {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElAdmin, setAnchorElAdmin] = useState(null)
  const open = Boolean(anchorEl)
  const openAdmin = Boolean(anchorElAdmin)

  const openPopoverNotifi = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const openPopoverExtendAdmin = (e) => {
    setAnchorElAdmin(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setAnchorElAdmin(null)
  }

  return (
    <AppBar position="static" className={classes.appBar}>
      <div className={classes.logoWrapper}>
        <img
          src={CenticLogo}
          className={classes.logoImg}
          width={127}
          height={50}
          alt=""
        />
         {/* <img
          src={Vanlang}
          className={classes.logoImg}
          width={127}
          height={50}
          alt=""
        /> */}
      </div>
      <Divider orientation="vertical" />
      <div className={classes.titleWrapper}>
        <Typography> {props.title} </Typography>
      </div>
      <div className={classes.rightNav}>
        <Grid container>
          <Tooltip
            title="Thông báo"
            arrow
            placeholder="bottom"
            PopperProps={{ disablePortal: true }}
          >
            <IconButton onClick={openPopoverNotifi}>
              <Badge badgeContent={8} color="primary" max={999} >
                <NotificationsOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Popover
            id="show-notificaton"
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {/* <BoxNotification /> */}
          </Popover>
          <Button
            aria-controls="show-extend-admin"
            onClick={openPopoverExtendAdmin}
          >
            <div className={classes.user}>
              <Avatar src="https://material-ui.com/static/images/avatar/2.jpg" />
            </div>
            <span className={classes.nameUser}>Admin</span>
            <ExpandMoreIcon />
          </Button>
          {/* <ExtendMenuAdmin
            id="show-extend-admin"
            anchorElAdmin={anchorElAdmin}
            openAdmin={openAdmin}
            handleClose={handleClose}
          /> */}
        </Grid>
      </div>
    </AppBar>
  )
}

export default DashboardHeader
