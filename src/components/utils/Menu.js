import { Settings } from "@mui/icons-material";
import { Icon, IconButton, Menu as MenuObj, MenuItem } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { Navigate } from "react-router";

const styles = {
  customWidth: {
    width: 250,
  },
};

const iconButtonElement = (
  <IconButton touch={true} tooltip="選單" tooltipPosition="bottom-left">
    <Icon color={grey[400]} />
  </IconButton>
);

class Menu extends React.Component {
  constructor(props) {
    super(props);
    const anchorEl = null;
    this.state = {
      navigateTo: "",
      selectedIndex: 1,
      anchorEl: anchorEl,
    };
  }

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
    setAnchorEl(null);
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (event) => {
    this.setState({ anchorEl: null });
  };

  handlePersonal = () => {
    this.setState({ navigateTo: "/personalinfo" });
    this.handleClose();
  };

  handleMyArticle = () => {
    this.setState({ navigateTo: "/myarticle" });
    this.handleClose();
  };

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    const open = Boolean(this.state.anchorEl);
    return (
      <div>
        {this.state.navigateTo && <Navigate to={this.state.navigateTo} />}
        <IconButton
          color="primary"
          aria-label="設定"
          component="label"
          onClick={this.handleClick}
          sx={{ color: grey[800], margin: "10px" }}
        >
          <Settings />
        </IconButton>
        <IconButton onClick={this.handleClick}></IconButton>
        <MenuObj
          anchorEl={this.state.anchorEl}
          onChange={this.handleChange}
          style={styles.customWidth}
          sx={{ width: "auto" }}
          open={open}
        >
          <MenuItem onClick={this.handleClose}>
            使用者： {this.props.title}
          </MenuItem>
          <MenuItem onClick={this.handlePersonal}>個人資料設定</MenuItem>
          <MenuItem onClick={this.handleMyArticle}>我的文章</MenuItem>
          <MenuItem onClick={this.handleLogout}>登出</MenuItem>
        </MenuObj>
      </div>
    );
  }
}

export default Menu;
