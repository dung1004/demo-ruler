import React from "react";
import { makeStyles } from "@material-ui/core";
import { TextField, FormGroup, Checkbox } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  CheckBox as CheckBoxIcon,
} from "@material-ui/icons";

const AutocompleteCheckbox = (props) => {
  const classes = styles();
  const { option, label } = props;
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  return (
    <FormGroup className={classes.formGroup}>
      <Autocomplete
        multiple
        size="small"
        options={option}
        getOptionLabel={(option) => option.name}
        noOptionsText={"Không có lựa chọn"}
        disableCloseOnSelect
        renderOption={(option, { selected }) => (
          <React.Fragment>
            <Checkbox
              icon={icon}
              size="small"
              checkedIcon={checkedIcon}
              className={classes.checkBox}
              checked={selected}
              color="primary"
            />
            {option.name}
          </React.Fragment>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="outlined"
            InputLabelProps={{
              classes: {
                root: classes.labelRoot,
              },
            }}
          />
        )}
      />
    </FormGroup>
  );
};

export default AutocompleteCheckbox;

const styles = makeStyles(() => ({
  formGroup: {
    marginBottom: 16,
  },
  labelRoot: {
    fontSize: 15,
  },
  checkBox: {
    marginRight: 8,
    padding: 4,
  },
}));
