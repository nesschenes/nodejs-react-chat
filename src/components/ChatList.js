import React from "react";
import { Avatar, Divider, List, ListItem, ListItemAvatar } from "@mui/material";

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

const ChatList = (props) => (
  <div>
    {props.msg.map((i, idx) => (
      <List key={idx}>
        <ListItem>
          <ListItemAvatar>
            <Avatar src={i.avatar} />
            <div style={style.author}>{i.name}</div>
          </ListItemAvatar>
          <div>
            <div>{i.content}</div>
            <div style={{ position: "relative", top: "0px", float: "right" }}>
              {i.date}
            </div>
          </div>
        </ListItem>
        <Divider sx={style.divider} />
      </List>
    ))}
  </div>
);

export default ChatList;
