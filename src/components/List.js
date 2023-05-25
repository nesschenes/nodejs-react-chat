import { Avatar, Divider, List, ListItem, ListItemAvatar } from "@mui/material";
import React from "react";

const style = {
  author: {
    fontSize: "10px",
    color: "gray",
    textAlign: "center",
  },
  divider: {
    my: 2,
    mx: 3,
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
  },
};

const ListMsg = (props) => (
  <div>
    {props.comments.map((c, index) => (
      <List key={index}>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={c.userAvatar} />
            <div style={style.author}>{c.authorAccount}</div>
          </ListItemAvatar>
          <div>
            <div style={{ color: "gray" }}>{c.title}</div>
            <div style={{ marginTop: "10px" }}>{c.content}</div>
          </div>
        </ListItem>
        <Divider sx={style.divider} />
      </List>
    ))}
  </div>
);

export default ListMsg;
