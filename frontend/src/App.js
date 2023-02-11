import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Transactions from "./Pages/Transactions";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import Sidebar from "./Components/Sidebar";
import Login from "./Pages/Login";
import Container from "./Components/Container";
import Signup from "./Pages/SignUp";
import theme from "./Typography";
import CustomizedSnackbars from "./Components/Snackbar";
import Loader from "./Components/Loader";
import EditProfile from "./Pages/EditProfile";
import { useState } from "react";

const drawerWidth = 240;

function App() {
  const [openTransactionModal, setOpenTransactionModal] = useState(false);
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Box sx={{ display: "flex" }}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <CssBaseline />
                    <Sidebar drawerWidth={drawerWidth} />
                    <Container drawerWidth={drawerWidth}>
                      <Home
                        openTransactionModal={openTransactionModal}
                        setOpenTransactionModal={setOpenTransactionModal}
                      />
                    </Container>
                  </>
                }
              />
              <Route
                path="/transactions"
                element={
                  <>
                    <CssBaseline />
                    <Sidebar drawerWidth={drawerWidth} />
                    <Container drawerWidth={drawerWidth}>
                      <Transactions
                        openTransactionModal={openTransactionModal}
                        setOpenTransactionModal={setOpenTransactionModal}
                      />
                    </Container>
                  </>
                }
              />
              <Route
                path="/editprofile"
                element={
                  <>
                    <CssBaseline />
                    <Sidebar drawerWidth={drawerWidth} />
                    <Container drawerWidth={drawerWidth}>
                      <EditProfile />
                    </Container>
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<div>Error 404: Page not Found</div>} />
            </Routes>
          </Box>
        </Router>
        <CustomizedSnackbars />
        <Loader />
      </div>
    </ThemeProvider>
  );
}

export default App;
