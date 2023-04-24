import React from "react";
import { Drawer, IconButton, MenuItem, Divider } from "@mui/material";
import { MenuRounded, MenuOpen } from "@mui/icons-material";
import { Navigate } from "react-router";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, navigateTo: "" };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  toArticle = () => {
    this.setState({ open: false, navigateTo: "/main" });
  };

  toChatroom = () => {
    this.setState({ open: false, navigateTo: "chatroom" });
  };

  render() {
    return (
      <div>
        {this.state.navigateTo && <Navigate to={this.state.navigateTo} />}
        <IconButton title="主選單" onClick={this.handleToggle}>
          <MenuRounded />
        </IconButton>
        <Drawer
          disablePortal={true}
          anchor={"left"}
          sx={{ width: 800 }}
          open={this.state.open}
          onClose={() => this.setState({ open: false })}
        >
          <IconButton
            sx={{ borderRadius: 0 }}
            onClick={() => this.setState({ open: false })}
          >
            <MenuOpen />
          </IconButton>
          <Divider />
          <MenuItem onClick={this.toArticle}>文章</MenuItem>
          <MenuItem onClick={this.toChatroom}>在線聊天室</MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default Navbar;
