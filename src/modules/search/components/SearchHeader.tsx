import Tab from "@/components/common/Tab";
import MobileSidebar from "@/components/layout/MobileSidebar";
import HeaderWrapper from "@/components/layout/HeaderWrapper";
import SearchInput from "@/components/shared/SearchInput";

const SearchHeader = ({
  inputValue,
  onInputValueChange,
  activeTab,
  onTabChange,
}) => {
  return (
    <HeaderWrapper classname={"flex justify-between p-0 pt-2 flex-col"}>
      <div className="flex items-center gap-2 px-4 py-2">
        <MobileSidebar />
        <SearchInput
          label="Search"
          placeholder="Search"
          value={inputValue}
          onChange={onInputValueChange}
        />
      </div>

      <div className="flex border-b-[1px]">
        <Tab
          label="User"
          isActive={activeTab === "users"}
          onClick={() => onTabChange("users")}
        />
        <Tab
          label="Tag"
          isActive={activeTab === "tags"}
          onClick={() => onTabChange("tags")}
        />
      </div>
    </HeaderWrapper>
  );
};

export default SearchHeader;
