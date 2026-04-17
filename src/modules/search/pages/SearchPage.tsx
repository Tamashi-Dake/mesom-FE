import { useEffect, useMemo, useState } from "react";
import SearchHeader from "../components/SearchHeader";
import { SEO } from "@/components/common/SEO";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { searchUsers } from "../api";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import UserCard from "@/components/shared/UserCard";
import VirtualizedInfiniteList from "@/components/virtualizedInfiniteList";

const SearchPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  const {
    data,
    error,
    isError,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteScroll(
    ["search", activeTab, searchValue],
    ({ pageParam = 0 }) => {
      if (!searchValue) {
        return { users: [], nextSkip: null };
      }
      if (activeTab === "users") {
        return searchUsers({ query: searchValue, skip: pageParam });
      }
      if (activeTab === "tags") {
        return { users: [], nextSkip: null };
      }
    },
    (lastPage) => lastPage.nextSkip || undefined,
  );

  const flatUsers = useMemo(
    () => data?.pages.flatMap((page) => page.users ?? []) ?? [],
    [data],
  );

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [inputValue]);

  const onInputValueChange = (value) => {
    setInputValue(value);
  };
  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

  const showEmptyOrPrompt =
    !inputValue || (!!data?.pages[0]?.message && activeTab !== "tags");

  return (
    <div className="flex h-screen flex-col">
      <SEO title={"Search / Mesom"} />
      <SearchHeader
        inputValue={inputValue}
        onInputValueChange={onInputValueChange}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      <div className="flex flex-1 flex-col overflow-hidden text-main-primary">
        {isLoading && inputValue && <LoadingSpinner />}
        {activeTab === "tags" && (
          <section className="mt-0.5 flex justify-center p-8">
            <div className="flex max-w-sm flex-col items-center gap-6">
              <div className="flex flex-col gap-2 text-center">
                <p className="text-3xl font-extrabold text-main-primary">
                  Search for tags is not available yet
                </p>
                <p className="text-main-secondary">
                  We are working on it, please try searching for users
                </p>
              </div>
            </div>
          </section>
        )}
        {showEmptyOrPrompt && activeTab !== "tags" && (
          <section className="mt-0.5 flex justify-center p-8">
            <div className="flex max-w-sm flex-col items-center gap-6">
              <div className="flex flex-col gap-2 text-center">
                <p className="text-3xl font-extrabold text-main-primary">
                  {!inputValue
                    ? "Search for people in Mesom"
                    : data?.pages[0]?.message
                      ? "No results found"
                      : ""}
                </p>
                {data?.pages[0]?.message && (
                  <p className="text-main-secondary">
                    Try searching for something else
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
        {isError && <div>Error: {error.message}</div>}
        {!showEmptyOrPrompt && activeTab === "users" && (
          <VirtualizedInfiniteList
            key={`${activeTab}-${searchValue}`}
            items={flatUsers}
            renderItem={(user) => (
              <UserCard originXTranslate openSpace user={user} />
            )}
            onLoadMore={fetchNextPage}
            hasMore={!!hasNextPage}
            isFetchingMore={isFetchingNextPage}
            estimateSize={72}
            className="flex-1 min-h-0"
          />
        )}
      </div>
    </div>
  );
};

export default SearchPage;
