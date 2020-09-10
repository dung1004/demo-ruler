import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Videocam as VideocamIcon, Tune as TuneIcon } from '@material-ui/icons'
import {
  Menu,
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'

import { NavLink as RouterLink } from 'react-router-dom'
import { grey } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  button_link: {
    width: '100%',
    minWidth: '100%',
    justifyContent: 'center',
    padding: '0px 12px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  boxIcon: {
    marginRight: -10,
  },
  listItemText: {
    fontSize: 14,
    fontWeight: 600,
    color: grey[800],
  },
}))

const ExtendMenu = (props) => {
  const pages = [
    {
      icon: <VideocamIcon style={{ fontSize: 24 }} />,
      title: 'QUẢN LÝ CAMERA',
    },
    {
      icon: <TuneIcon style={{ fontSize: 24 }} />,
      title: 'CÀI ĐẶT HỆ THỐNG',
    },
  ]

  const onCloseMenu = () => {
    props.onCloseMenu()
  }

  const CustomRouterLink = React.forwardRef((props, ref) => (
    <RouterLink ref={ref} {...props} />
  ))

  const classes = useStyles()
  return (
    <Menu
      open={props.open}
      onClose={onCloseMenu}
      anchorEl={props.anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      {pages.map((page, index) => (
        <MenuItem key={index}>
          <Button
            className={classes.button_link}
            component={CustomRouterLink}
            to="/#"
          >
            <ListItemIcon className={classes.boxIcon}>{page.icon}</ListItemIcon>
            <ListItemText>
              <span className={classes.listItemText}> {page.title} </span>
            </ListItemText>
          </Button>
        </MenuItem>
      ))}
    </Menu>
  )
}

export default ExtendMenu
