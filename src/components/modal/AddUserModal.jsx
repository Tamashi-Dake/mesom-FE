import { useEffect, useState } from "react";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import SearchInput from "../shared/SearchInput";
import { searchUsers } from "../../services/searchService";
import Button from "../shared/Button";
import useAddUserStore from "../../hooks/useStore";
import DefaultHeader from "../layout/DefaultHeader";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import UserCardInterface from "../shared/UserCardInterface";
import { AiOutlineClose } from "react-icons/ai";
import { useCurrentUser } from "../../lib/context/authContext";
import { useMutation } from "@tanstack/react-query";
import { checkCreateConversationConditions } from "@/services/conversationService";
import toast from "react-hot-toast";

const AddUserModal = ({ closeModal }) => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { users, addUser, removeUser, resetUsers } = useAddUserStore();

  const { data, error, isError, isLoading, isFetchingNextPage, ref } =
    useInfiniteScroll(
      ["search", "users", searchValue],
      ({ pageParam = 0 }) => {
        return searchUsers({ query: searchValue, skip: pageParam });
      },
      (lastPage) => lastPage.nextSkip || undefined,
    );

  const checkCreateConversationConditionMutation = useMutation({
    mutationFn: checkCreateConversationConditions,
    onSuccess: (data) => {
      closeModal();
      if (data && data._id) navigate(`/conversation/${data._id}`);
      else navigate("/conversation");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message);
    },
  });

  useEffect(() => {
    resetUsers();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchValue(inputValue);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [inputValue]);

  const onInputValueChange = (value) => {
    setInputValue(value);
  };

  const handleAddUser = (user) => {
    addUser(user, currentUser?.verified);
  };

  const handleRemoveUser = (userId) => {
    removeUser(userId);
  };

  const handleSubmit = () => {
    checkCreateConversationConditionMutation.mutate({
      participants: users.map((user) => user._id),
    });
  };

  return (
    <>
      <DefaultHeader label="Add User" className={"flex justify-between"}>
        <Button
          label={"Next"}
          className={"inline-block"}
          onClick={handleSubmit}
          disabled={users.length === 0}
        />
      </DefaultHeader>
      <section>
        <div className="px-4 pb-2">
          <SearchInput
            label="Search conversations"
            placeholder="Search conversation name"
            value={inputValue}
            onChange={onInputValueChange}
            className={"rounded-full"}
          />
        </div>
        <div className="flex gap-2 !overflow-x-auto [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar]:w-2">
          {users &&
            users.map((user) => (
              <div className="flex gap-1" key={user._id}>
                <img
                  src={user.avatarImg}
                  alt="user image"
                  className="size-3 shrink-0 rounded-full"
                />
                <span>{user.displayName || user.username}</span>
                <button
                  onClick={handleRemoveUser}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-main-secondary/30"
                  type="button"
                >
                  <AiOutlineClose className="size-3 text-main-primary" />
                </button>
              </div>
            ))}
        </div>
        <div>
          {isLoading && <LoadingSpinner />}
          {!(!inputValue || data?.pages[0]?.message) &&
            data?.pages?.map((searchPageInfo) =>
              searchPageInfo?.users?.map((user, index) => {
                const isUserBeforeLastUser =
                  index === searchPageInfo.users.length - 1;
                return (
                  <UserCardInterface
                    onClick={() => handleAddUser(user)}
                    openSpace
                    user={user}
                    key={user._id}
                    innerRef={isUserBeforeLastUser ? ref : null}
                  />
                );
              }),
            )}
          {isFetchingNextPage && <LoadingSpinner />}
          {isError && <div>Error: {error.message}</div>}
        </div>
      </section>
    </>
  );
};

export default AddUserModal;
