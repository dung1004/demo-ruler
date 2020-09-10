import React from "react";
import { makeStyles } from "@material-ui/core";


import FormSearch from "./form_search/form_search";
import ListParking from "./list_parking/list_parking";

const SearchList = () => {
    const classes = styles()
  return (
    <div className={classes.root} >
      <FormSearch />
      <ListParking />
    </div>
  );
};

export default SearchList;

const styles = makeStyles(() => ({
    root: {
        display: "flex", 
        flexDirection: "column"
    }
}))
