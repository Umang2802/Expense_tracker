import { Grid, Typography } from "@mui/material";
import BasicCard from "./Card";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";

const AccountCards = ({ setOpen }) => {
  const accounts = useSelector((state) => state.user.accounts);
  return (
    <>
      <Typography align="left" sx={{ mb: 1 }}>
        <b>Accounts</b>
        <span style={{ float: "right", fontSize: ".65rem" }}>
          * You can add atmost 4 accounts
        </span>
      </Typography>
      <Grid container spacing={2} justifyContent="left" sx={{ mb: 2 }}>
        {accounts.map((item, index) => {
          return (
            <Grid item xs={3} key={index}>
              <BasicCard
                value={item.amount}
                tag={item.name}
                color={item.color}
              />
            </Grid>
          );
        })}
        {accounts.length < 4 && (
          <Grid item xs={3}>
            <BasicCard
              value={<AddIcon />}
              tag="Add Account"
              color="grey"
              onClick={() => setOpen(true)}
            />
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default AccountCards;
