import { Button, Grid, Tooltip, Typography } from "@mui/material";
import BasicCard from "./Card";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import colors from "../data/colors";
import DeleteModal from "./DeleteModal";
import { useState } from "react";

const AccountCards = ({ setOpen }) => {
  const accounts = useSelector((state) => state.user.accounts);
  const [id, setId] = useState();
  const [modalName, setModalname] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

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
              <Tooltip title="Click to delete account">
                <Button
                  fullWidth
                  key={index}
                  onClick={() => {
                    setId(item._id);
                    setModalname("Delete Account");
                    setOpenDeleteModal(true);
                  }}
                >
                  <BasicCard
                    value={item.amount}
                    tag={item.name}
                    color={colors[index]}
                  />
                </Button>
              </Tooltip>
            </Grid>
          );
        })}
        {accounts.length < 4 && (
          <Grid item xs={3}>
            <Button fullWidth onClick={() => setOpen(true)}>
              <BasicCard value={<AddIcon />} tag="Add Account" color="grey" />
            </Button>
          </Grid>
        )}
      </Grid>
      <DeleteModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        id={id}
        modalName={modalName}
      />
    </>
  );
};

export default AccountCards;
