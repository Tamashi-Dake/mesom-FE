import { useState } from "react";
import SearchHeader from "../components/layout/SearchHeader";
import { SEO } from "../components/common/SEO";

const Search = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("users"); // top 5 tags in count
  const onSearchValueChange = (value) => {
    setSearchValue(value);
  };
  const onTabChange = (tab) => {
    setActiveTab(tab);
  };
  return (
    <>
      <SEO title={"Search / Mesom"} />
      <SearchHeader
        searchValue={searchValue}
        onSearchValueChange={onSearchValueChange}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <div className="text-main-primary">
        <h2>Search</h2>
        <p>Search information</p>
      </div>
    </>
  );
};

export default Search;
