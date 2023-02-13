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
import { AppBar, Button, IconButton } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import MenuIcon from "@mui/icons-material/Menu";

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

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          Expense Tracker
        </Typography>
      </Toolbar>
      <Divider sx={{ display: { xs: "none", sm: "block" } }} />
      <Box sx={{ p: 4 }}>
        <Avatar
          alt="Remy Sharp"
          src={
            user.user.profileImage
              ? user.user.profileImage.imageUrl
              : "https://tse1.mm.bing.net/th/id/OIP.1VIzl4Px0aT3Zveh0J_Y3gHaHx?pid=ImgDet&w=500&h=525&rs=1"
          }
          sx={{ width: 56, height: 56, margin: "auto", mb: 2 }}
        />
        <Typography align="center">{user.user.username}</Typography>
        <Button
          sx={{
            m: "auto",
            mt: 1,
            mb: 5,
            px: 2,
            fontSize: "1rem",
            background: "rgba(0,0,0,0.1)",
            color: "black",
            letterSpacing: "1px",
            display: "flex",
          }}
        >
          <AccountBalanceWalletIcon fontSize="small" />
          &nbsp;₹{user.user.inflow - user.user.outflow}
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
    <Box sx={{ display: "flex" }}>
      <AppBar
        color=""
        position="fixed"
        sx={{
          display: { sm: "none" },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap align="center">
            Expense Tracker
          </Typography>
        </Toolbar>
      </AppBar>
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
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Sidebar;
