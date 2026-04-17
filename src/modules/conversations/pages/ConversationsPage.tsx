import { useEffect, useMemo, useState } from "react";

import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { searchConversations } from "@/modules/search/api";

import { SEO } from "@/components/common/SEO";
import ConversationsHeader from "../components/ConversationsHeader";
import SearchInput from "@/components/shared/SearchInput";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ConversationCard from "../components/ConversationCard";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/modal/Modal";
import AddUserModal from "../components/AddUserModal";
import VirtualizedInfiniteList from "@/components/virtualizedInfiniteList";

const ConversationsPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const addUserModal = useModal();

  const {
    data,
    error,
    isError,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteScroll(
    ["search", "conversations", searchValue],
    ({ pageParam = 0 }) => {
      return searchConversations({ query: searchValue, skip: pageParam });
    },
    (lastPage) => lastPage.nextSkip || undefined,
  );

  const flatConversations = useMemo(
    () => data?.pages.flatMap((page) => page.conversations ?? []) ?? [],
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

  return (
    <div className="flex h-screen flex-col">
      <SEO title="Conversations / Mesom" />
      <ConversationsHeader modal={addUserModal} />
      <div className="px-4 pb-2 flex-shrink-0">
        <SearchInput
          label="Search conversations"
          placeholder="Search conversation name"
          value={inputValue}
          onChange={onInputValueChange}
          className={"rounded-full"}
        />
      </div>
      {isLoading && <LoadingSpinner />}
      {isError && <div>Error: {error.message}</div>}
      {!isLoading && (
        <VirtualizedInfiniteList
          key={searchValue}
          items={flatConversations}
          renderItem={(con) => <ConversationCard conversation={con} />}
          onLoadMore={fetchNextPage}
          hasMore={!!hasNextPage}
          isFetchingMore={isFetchingNextPage}
          estimateSize={80}
          className="flex-1 min-h-0"
        />
      )}
      <Modal
        className="flex items-start justify-center"
        modalClassName="bg-main-background relative rounded-2xl max-w-xl w-full my-8 overflow-hidden"
        open={addUserModal.open}
        closeModal={addUserModal.closeModal}
      >
        <AddUserModal closeModal={addUserModal.closeModal} />
      </Modal>
    </div>
  );
};

export default ConversationsPage;
