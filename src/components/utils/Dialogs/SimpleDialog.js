import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

export default class SimpleDialog extends React.Component {
  state = {
    open: true,
  };

  handleClose = () => {
    this.setState({ open: false });
    if (typeof this.props.close !== "undefined") {
      this.props.close(); //dispatch  action
    }
    if (typeof this.props.confirm !== "undefined") {
      this.props.confirm();
    }
  };

  render() {
    return (
      <Dialog open={this.state.open} onClose={this.handleClose}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>{this.props.content}</DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>確定</Button>
        </DialogActions>
      </Dialog>
    );
  }
}
