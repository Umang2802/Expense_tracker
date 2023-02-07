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
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice";

const sidebarItems = [
  { name: "Dashboard", link: "/" },
  { name: "Transactions", link: "/transactions" },
  { name: "Edit Profile", link: "/editprofile" },
];

function Sidebar({ drawerWidth }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const user = useSelector((state) => state.user);

  console.log("user", user);

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6">Expense Tracker</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ p: 4 }}>
        <Avatar
          alt="Remy Sharp"
          src={
            user.user.profileImage
              ? user.user.profileImage.imageUrl
              : "/static/images/avatar/1.jpg"
          }
          sx={{ width: 56, height: 56, margin: "auto", mb: 2 }}
        />
        <Typography>{user.user.username}</Typography>
        <Button
          sx={{
            mt: 1,
            mb: 5,
            px: 2,
            fontSize: "1rem",
            background: "rgba(0,0,0,0.1)",
            color: "black",
            letterSpacing: "1px",
          }}
        >
          <AccountBalanceWalletIcon fontSize="small" />
          &nbsp;${user.user.inflow - user.user.outflow}
        </Button>
        <Divider />
        <List>
          {sidebarItems.map((item, index) => (
            <ListItem key={item.name} disablePadding>
              <ListItemButton>
                <Link
                  to={item.link}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItemText primary={item.name} />
                </Link>
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key="Logout" disablePadding>
            <ListItemButton
              onClick={() => {
                dispatch(logout());
                navigate("/login");
              }}
            >
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
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
