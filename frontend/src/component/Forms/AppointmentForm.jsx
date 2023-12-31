import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
  Alert,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { useGetAppointmentMutation, useGetDoctorsQuery } from "../../redux/Api/patientApi";

const AppointmentForm = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [doc,setDoc] = useState("");
  const {data: doctors, error: docError} = useGetDoctorsQuery();
  const [getAppointment, {data,isLoading, isError,error, isSuccess}] = useGetAppointmentMutation();
  useEffect(() => {
    if(doctors?.length){
      setDoc(doctors[0]);
    }
  },  [doctors])
  const handleSubmit = () => {
    getAppointment({
      email: email,
      doctor: doc,
    })
  };

  useEffect(() => {
    if(isSuccess){
      setOpen(true);
      setEmail('');
    }
  }, [isSuccess]);
  return (
    <Container
      mx={"auto"}
      sx={{
        alignItems: "center",
        flexDirection: "column",
        display: "flex",
        my: "4.5rem",
      }}
    >
      <Box
        sx={{
          "& .MuiTextField-root": { width: "320px" },
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.55rem",
          alignItems: "center",
        }}
        noValidate
        autoComplete="off"
        gap={1.75}
      >
        {/* Email */}
        <TextField
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          type="email"
          error={error?.data?.email}
          helperText={
            error?.data?.email ? error?.data?.email?.msg : "Email Address"
          }
          InputLabelProps={{
            style: {
              color: theme.palette.text.primary,
              fontSize: "17px",
              borderColor: theme.palette.text.primary,
            },
          }}
        />
        {/* Doctor Name */}
        {doctors?.length && <FormControl fullWidth>
          <InputLabel>Doctors</InputLabel>
          <Select label="Role" fullWidth value={doc} onChange={(e) => setDoc(e.target.value)}>
            {doctors?.map((docs, idx) => {
              return <MenuItem key={idx} value={docs} selected={!idx}>{docs.name}</MenuItem>
            })}
          </Select>
        </FormControl>}
        <Button color="success" variant="contained" onClick={() => handleSubmit()}>
          Submit
        </Button>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {data?.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AppointmentForm;
