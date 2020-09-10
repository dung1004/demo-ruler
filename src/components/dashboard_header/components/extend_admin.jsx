import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'
import {
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppICon,
} from '@material-ui/icons'
import ExtendMenuAdminItem from './extend_admin_item'

const useStyles = makeStyles((theme) => ({}))

const ExtendMenuAdmin = (props) => {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    props.handleClose()
  }

  const showConfirmLogout = () => {
    setOpen(true)
  }

  const closeConfirmLogout = () => {
    setOpen(false)
  }

  const pages = [
    {
      icon: <AccountCircleIcon style={{ fontSize: 24 }} />,
      title: 'Thông tin tài khoản',
    },
    {
      icon: <ExitToAppICon style={{ fontSize: 24 }} />,
      title: 'Đăng xuất',
      showConfirmLogout: showConfirmLogout,
      closeConfirmLogout: closeConfirmLogout,
      open: open,
    },
  ]
  
  return (
    <Popover
      open={props.openAdmin}
      onClose={handleClose}
      anchorEl={props.anchorElAdmin}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      {pages.map((page, index) => (
        <ExtendMenuAdminItem key={index} page={page} />
      ))}
    </Popover>
  )
}

export default ExtendMenuAdmin
