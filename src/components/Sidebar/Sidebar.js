// @flow strict
import React, { useEffect } from "react";
import Author from "./Author";
import Contacts from "./Contacts";
import Copyright from "./Copyright";
import Menu from "./Menu";
import Tags from "../Post/Tags/Tags";
import kebabCase from "lodash/kebabCase";
import styles from "./Sidebar.module.scss";
import { useSiteMetadata, useCategoriesList } from "../../hooks";

type Props = {
  isIndex?: boolean,
};

const Sidebar = ({ isIndex }: Props) => {
  const { author, copyright, menu } = useSiteMetadata();
  const categories = useCategoriesList();
  useEffect(() => {
    console.log(categories);
  }, []);

  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar__inner"]}>
        <Author author={author} isIndex={isIndex} />
        <Menu menu={menu} />
        <Contacts contacts={author.contacts} />
        <Copyright copyright={copyright} />
        <Tags
          tags={categories.map((category) => category.fieldValue)}
          tagSlugs={categories.map(
            (category) => `/category/${kebabCase(category.fieldValue)}/`
          )}
        />
      </div>
    </div>
  );
};

export default Sidebar;
