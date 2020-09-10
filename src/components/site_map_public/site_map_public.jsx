import React from "react";
import { makeStyles } from "@material-ui/core";

import SiteMap from "./map/site_map";
import SearchList from "./search_list/search_list";

const SiteMapPublic = () => {
  return (
    <>
      <SiteMap />
      <SearchList />
    </>
  );
};

export default SiteMapPublic;

const styles = makeStyles(() => ({}));
