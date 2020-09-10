import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography, Box } from '@material-ui/core'
import { Scrollbars } from 'react-custom-scrollbars'

import ItemNotification from './item_notification'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 480,
    height: 650,
    paddingBottom: 50,
  },
  boxItem: {
    height: '100%',
  },
  title: {
    background: '#e0e0e0',
    fontSize: 16,
    padding: 10,
  },
}))

const BoxNotification = () => {
  const classes = useStyles()
  return (
    <Box className={classes.root}>
      <Typography className={classes.title}>Thông báo</Typography>
      <Scrollbars className={classes.boxItem}>
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
        <ItemNotification />
      </Scrollbars>
    </Box>
  )
}

export default BoxNotification
