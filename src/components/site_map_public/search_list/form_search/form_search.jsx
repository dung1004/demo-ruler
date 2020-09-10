import React from "react";
// import { makeStyles } from "@material-ui/core";
import { useForm } from "react-hook-form";

import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  TextField,
  FormGroup,
  Button
} from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import AutocompleteCheckbox from "./autocomplete_checkbox";

const FormSearch = () => {
  const citys = [{ id: 1, name: "Thanh pho Da Nang" }];
  const districts = [
    { id: 1, name: "Quan Hai Chau" },
    { id: 2, name: "Quan Cam Le" },
    { id: 3, name: "Quan Ngu Hanh Son" },
  ];
  const communes = [
    { id: 1, name: "Phuong Abc" },
    { id: 2, name: "Phuong Bac My An" },
  ];
  const streets = [
    { id: 1, name: "Nam Ky khoi nghia" },
    { id: 2, name: "Nui Thanh" },
  ];
  const classes = styles()
  const { errors } = useForm()

  return (
    <div className={classes.formSearch}>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>TÌM KIẾM NÂNG CAO</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <form className={classes.form} noValidate autoComplete="off">
            <FormGroup className={classes.formGroup}>
              <TextField
                label="Nhập từ khóa tìm kiếm"
                type="search"
                variant="outlined"
                size="small"
                name="search"
                InputProps={{
                  classes: {
                    input: classes.input,
                  },
                }}
                InputLabelProps={{
                  classes: {
                    root: classes.labelRoot,
                  },
                }}
              />
              {/* <p> { errors.search && <span>This field is required</span> } </p> */}
            </FormGroup>
            <AutocompleteCheckbox option={citys} label="Tỉnh/Thành phố" />
            <AutocompleteCheckbox option={districts} label="Quận/Huyện" />
            <AutocompleteCheckbox option={communes} label="Phường/Xã" />
            <AutocompleteCheckbox option={streets} label="Nhóm" />
            <AutocompleteCheckbox option={streets} label="Loại" />

            <Button variant="contained" color="primary">Tìm kiếm</Button>
            
          </form>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default FormSearch;

const styles = makeStyles(() => ({
  formSearch: {
    padding: 10,
  },
  heading: {
    fontSize: 13,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
  },
  input: {
    fontSize: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  labelRoot: {
    fontSize: 15,
  },
}));
