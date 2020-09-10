import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { NavLink as RouterLink } from 'react-router-dom'
import { List, ListItem, Button, Tooltip } from '@material-ui/core'
import { indigo } from '@material-ui/core/colors'
import {
  MapOutlined as MapOutlinedIcon,
  AppsOutlined as AppsOutlinedIcon,
  Search as SearchIcon,
  EventNote as EventNoteIcon,
  VideoLibrary as VideoLibraryIcon,
  SettingsOutlined as SettingsOutlinedIcon,
} from '@material-ui/icons'
import { Scrollbars } from 'react-custom-scrollbars'

import ExtendMenu from './components/extend_menu'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 60,
    height: 'calc(100vh - 50px)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    boxShadow:
      '0px 4px 5px -2px rgba(0,0,0,0.2), 0px 7px 10px 1px rgba(0,0,0,0.14), 0px 2px 16px 1px rgba(0,0,0,0.12)',
  },
  top: {
    flexGrow: 1,
  },
  bottom: {
    flexGrow: 0,
  },
  listItem: {
    padding: '2px 4px',
  },
  button: {
    width: '100%',
    minWidth: '100%',
    justifyContent: 'center',
    padding: '10px 12px',
  },
  active: {
    color: indigo[700],
    borderLeft: `4px solid ${indigo[700]}`,
    paddingLeft: 6,
  },
  icon: {
    color: 'inherit',
    width: 24,
    height: 24,
    display: 'flex',
  },
}))

function DashboardSidebar(props) {
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const pages = [
    {
      icon: <MapOutlinedIcon style={{ fontSize: 24 }} />,
      title: 'Bản đồ',
      href: 'sitemap',
    },
    {
      icon: <AppsOutlinedIcon style={{ fontSize: 24 }} />,
      title: 'Danh sách theo dõi',
      href: 'followed_list',
    },
    {
      icon: <SearchIcon style={{ fontSize: 24 }} />,
      title: 'Tìm kiếm phương tiện',
      href: 'search_vehicles',
    },
    {
      icon: <EventNoteIcon style={{ fontSize: 24 }} />,
      title: 'Vi phạm',
      href: 'violations',
    },
    {
      icon: <VideoLibraryIcon style={{ fontSize: 24 }} />,
      title: 'Xem lại',
      href: 'record_videos',
    },
    {
      icon: <MapOutlinedIcon style={{ fontSize: 24 }} />,
      title: 'Lưu lượng',
      href: 'flow',
    },
  ]

  const CustomRouterLink = React.forwardRef((props, ref) => (
    <RouterLink ref={ref} {...props} />
  ))

  const onOpenMenu = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const onCloseMenu = () => {
    setAnchorEl(null)
  }

  return (
    <div className={classes.root}>
      <div className={classes.top}>
        <Scrollbars style={{ height: '100%' }}>
          <List>
            {pages.map((page, index) => (
              <ListItem key={index} className={classes.listItem}>
                <Tooltip title={page.title} placement="right" arrow>
                  <Button
                    activeClassName={classes.active}
                    className={classes.button}
                    component={CustomRouterLink}
                    to={`/dashboard/${page.href}`}
                  >
                    <div className={classes.icon}>{page.icon}</div>
                  </Button>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Scrollbars>
      </div>
      <div className={classes.bottom}>
        <div className={classes.listItem}>
          <Button className={classes.button} onClick={onOpenMenu}>
            <SettingsOutlinedIcon />
          </Button>

          <ExtendMenu
            open={open}
            anchorEl={anchorEl}
            onCloseMenu={onCloseMenu}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardSidebar
