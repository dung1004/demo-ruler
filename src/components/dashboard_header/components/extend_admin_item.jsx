import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'

const useStyles = makeStyles((theme) => ({
  button_link: {
    width: '100%',
    minWidth: '100%',
    textAlign: 'left',
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
    textTransform: 'initial',
    color: grey[700],
  },
  boxButtons: {
    textAlign: 'center',
    paddingBottom: 15,
  },
  button: {
    textTransform: 'initial',
    marginRight: 10,
  },
}))

const ExtendMenuAdminItem = (props) => {
  const classes = useStyles()
  return (
    <MenuItem>
      <Button
        className={classes.button_link}
        onClick={
          props.page.showConfirmLogout
            ? () => props.page.showConfirmLogout()
            : null
        }
      >
        <ListItemIcon className={classes.boxIcon}>
          {props.page.icon}
        </ListItemIcon>
        <ListItemText>
          <span className={classes.listItemText}> {props.page.title} </span>
        </ListItemText>
      </Button>

      <Dialog open={props.page.open || false}>
        <DialogTitle>Bạn có chắc chắn muốn đăng xuất ?</DialogTitle>
        <div className={classes.boxButtons}>
          <Button
            onClick={() => props.page.closeConfirmLogout()}
            variant="contained"
            className={classes.button}
          >
            Hủy
          </Button>
          <Button
            onClick={() => props.page.closeConfirmLogout()}
            color="primary"
            variant="contained"
            className={classes.button}
          >
            Xác nhận
          </Button>
        </div>
      </Dialog>
    </MenuItem>
  )
}

export default ExtendMenuAdminItem
