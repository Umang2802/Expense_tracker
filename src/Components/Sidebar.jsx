import * as React from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import { ContextProvider } from "../Context";

function Sidebar({
  mobileOpen,
  setMobileOpen,
  drawerWidth,
  handleDrawerToggle,
}) {
  const { state } = React.useContext(ContextProvider);
  const { cashFlow } = state;
  const balance = cashFlow
    .filter((item, i) => i < 2)
    .reduce((diff, item) => diff.amount - item.amount);
  // console.log(balance);
  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" fontWeight={700}>
          Expense Tracker
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 4 }}>
        <Avatar
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
          sx={{ width: 56, height: 56, margin: "auto", mb: 2 }}
        />
        <Typography>Umang Metri</Typography>
        <Button sx={{ mb: 5 }}>${balance}</Button>
        <Divider />
        <List>
          {["Dashboard", "Login", "Transaction"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        boxSizing: "border-box",
      }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        //container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
