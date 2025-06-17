import {
  FaTrash,
  FaUser,
  FaUserCheck,
  FaUserSlash,
  FaUserXmark,
} from "react-icons/fa6";
import { useDeletePost } from "../../hooks/usePost";
import {
  IoIosMore,
  IoIosNotifications,
  IoIosNotificationsOff,
} from "react-icons/io";
import {
  Button,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import cn from "clsx";
import { ToolTip } from "../common/Tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "../modal/Modal";
import { ActionModal } from "../modal/ActionModal";
import { BsPinAngle } from "react-icons/bs";
import { useModal } from "../../hooks/useModal";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { RiUnpinLine } from "react-icons/ri";
import { useFollowUser } from "../../hooks/useUser";
import { popupVariant } from "../shared/config";
import { useCurrentUser } from "../../lib/context/authContext";

const pinModalData = [
  {
    title: "Pin Tweet to from profile?",
    description:
      "This will appear at the top of your profile and replace any previously pinned Tweet.",
    mainBtnLabel: "Pin",
  },
  {
    title: "Unpin Tweet from profile?",
    description:
      "This will no longer appear automatically at the top of your profile.",
    mainBtnLabel: "Unpin",
  },
];

const blockUserModalData = [
  {
    title: "Block this user?",
    description:
      "Blocking this user will prevent them from interacting with you, including sending you messages and notifications.",
    mainBtnLabel: "Block",
  },
  {
    title: "Unblock this user?",
    description:
      "Unblocking will allow the user to interact with you again, including sending messages and notifications.",
    mainBtnLabel: "Unblock",
  },
];

const blockPostNotificationsData = [
  {
    title: "Allow notifications for this post?",
    description:
      "You will start receiving notifications for comments, likes, or shares on this post again.",
    mainBtnLabel: "Allow Notifications",
  },
  {
    title: "Block notifications for this post?",
    description:
      "You will no longer receive notifications for comments, likes, or shares on this post.",
    mainBtnLabel: "Block Notifications",
  },
];

const PostOptions = ({
  authorId,
  authorName,
  postId,
  postParam,
  queryType,
}) => {
  const { currentUser } = useCurrentUser();
  const isOwner = currentUser?._id === authorId;
  // const isPinned = currentUser?.pinnedPost === postId;
  const [isPinned, setIsPinned] = useState(false);
  const [userIsBlocked, setUserIsBlocked] = useState(false);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const userIsFollowed = currentUser?.following.includes(authorId);

  const deleteMutation = useDeletePost(queryType, postId, postParam);
  const followMutation = useFollowUser(authorId, true);

  const {
    open: removeOpen,
    openModal: removeOpenModal,
    closeModal: removeCloseModal,
  } = useModal();
  const {
    open: pinOpen,
    openModal: pinOpenModal,
    closeModal: pinCloseModal,
  } = useModal();
  const {
    open: blockOpen,
    openModal: blockOpenModal,
    closeModal: blockCloseModal,
  } = useModal();
  const {
    open: allowNotiOpen,
    openModal: allowNotiOpenModal,
    closeModal: allowNotiCloseModal,
  } = useModal();
  const currentPinModalData = useMemo(() => pinModalData[+isPinned], [pinOpen]);
  const currentBlockUserModalData = useMemo(
    () => blockUserModalData[+userIsBlocked],
    [blockOpen],
  );
  const currentBlockPostNotificationsData = useMemo(
    () => blockPostNotificationsData[+allowNotifications],
    [allowNotiOpen],
  );

  const handleDeletePost = (event) => {
    event.preventDefault();
    // console.log(queryType, postParam, postId);
    deleteMutation.mutate(postId);
    removeCloseModal();
  };
  const handlePin = (event) => {
    event.preventDefault();
    setIsPinned((prevIsPinned) => {
      toast.success(!prevIsPinned ? "Post Pinned" : "Post Unpinned");
      return !prevIsPinned;
    });
    pinCloseModal();
  };
  const handleFollow = (event, closeMenu) => {
    event.preventDefault();
    followMutation.mutate({ userId: authorId, notificationType: "follow" });
    closeMenu();
  };
  const handleBlock = (event) => {
    event.preventDefault();
    setUserIsBlocked((prevIsBlocked) => {
      toast.success(!prevIsBlocked ? "User Blocked" : "User Unblocked");
      return !prevIsBlocked;
    });
    blockCloseModal();
  };
  const handleBlockNotifications = (event) => {
    event.preventDefault();
    setAllowNotifications((prevAllowNofitications) => {
      toast.success(
        !prevAllowNofitications
          ? "Allowed nofitications for this post"
          : "Blocked nofitications for this post",
      );
      return !prevAllowNofitications;
    });
    allowNotiCloseModal();
  };

  return (
    <>
      <Popover>
        {({ open, close }) => (
          <>
            <PopoverButton
              as={Button}
              className={cn(
                `main-tab group right-2 top-2 rounded-full p-2 hover:bg-main-accent/10 focus-visible:bg-main-accent/10 focus-visible:!ring-main-accent/80 active:bg-main-accent/20`,
                open && "bg-main-accent/10 [&>div>svg]:text-main-accent",
              )}
            >
              <div className="group relative">
                <IoIosMore className="h-5 w-5 text-light-secondary group-hover:text-main-accent group-focus-visible:text-main-accent dark:text-dark-secondary/80" />
                {!open && <ToolTip tip="More" />}
              </div>
            </PopoverButton>
            <AnimatePresence>
              {open && (
                <PopoverPanel
                  className="menu-container group absolute right-2 z-[9] whitespace-nowrap bg-main-background text-main-primary"
                  as={motion.div}
                  {...popupVariant}
                  static
                >
                  {isOwner && (
                    <PopoverButton
                      as={Button}
                      className="accent-tab flex w-full items-center gap-3 rounded-md rounded-b-none px-4 py-2 text-accent-red hover:bg-main-primary/10"
                      onClick={(event) => {
                        event.preventDefault();
                        removeOpenModal();
                      }}
                    >
                      <FaTrash />
                      Delete
                    </PopoverButton>
                  )}

                  {isOwner ? (
                    <PopoverButton
                      className="accent-tab flex w-full items-center gap-3 rounded-md rounded-t-none px-4 py-2 hover:bg-main-primary/10"
                      as={Button}
                      onClick={(event) => {
                        event.preventDefault();
                        pinOpenModal();
                      }}
                    >
                      {isPinned ? (
                        <>
                          <RiUnpinLine />
                          Unpin from profile
                        </>
                      ) : (
                        <>
                          <BsPinAngle />
                          Pin to your profile
                        </>
                      )}
                    </PopoverButton>
                  ) : (
                    <>
                      <PopoverButton
                        className="accent-tab flex w-full items-center gap-3 rounded-md rounded-t-none px-4 py-2 hover:bg-main-primary/10"
                        as={Button}
                        onClick={(e) => {
                          handleFollow(e, close);
                        }}
                      >
                        {userIsFollowed ? (
                          <>
                            <FaUserXmark />
                            Unfollow @{authorName}
                          </>
                        ) : (
                          <>
                            <FaUserCheck />
                            Follow @{authorName}
                          </>
                        )}
                      </PopoverButton>
                      <PopoverButton
                        className="accent-tab flex w-full items-center gap-3 rounded-md rounded-t-none px-4 py-2 hover:bg-main-primary/10"
                        as={Button}
                        onClick={(event) => {
                          event.preventDefault();
                          blockOpenModal();
                        }}
                      >
                        {userIsBlocked ? (
                          <>
                            <FaUser />
                            Unblock @{authorName}
                          </>
                        ) : (
                          <>
                            <FaUserSlash />
                            Block @{authorName}
                          </>
                        )}
                      </PopoverButton>
                    </>
                  )}
                  <PopoverButton
                    className="accent-tab flex w-full items-center gap-3 rounded-md rounded-t-none px-4 py-2 hover:bg-main-primary/10"
                    as={Button}
                    onClick={(event) => {
                      event.preventDefault();
                      allowNotiOpenModal();
                    }}
                  >
                    {allowNotifications ? (
                      <>
                        <IoIosNotificationsOff />
                        Block notifications for this post
                      </>
                    ) : (
                      <>
                        <IoIosNotifications />
                        Allow notifications for this post
                      </>
                    )}
                  </PopoverButton>
                </PopoverPanel>
              )}
            </AnimatePresence>
          </>
        )}
      </Popover>
      <Modal
        modalClassName="max-w-xs relative text-main-primary bg-main-background w-full p-8 rounded-2xl"
        open={removeOpen}
        closeModal={removeCloseModal}
        actionModal
      >
        <ActionModal
          title="Delete Tweet?"
          description={`This can’t be undone and it will be removed from your
          profile, the timeline of any accounts that follow you, and from Mesom search results.`}
          mainBtnClassName="bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90"
          secondaryBtnClassName="bg-main-secondary"
          mainBtnLabel="Delete"
          action={handleDeletePost}
          closeModal={removeCloseModal}
        />
      </Modal>
      <Modal
        modalClassName="max-w-xs relative text-main-primary bg-main-background w-full p-8 rounded-2xl"
        open={pinOpen}
        closeModal={pinCloseModal}
        actionModal
      >
        <ActionModal
          {...currentPinModalData}
          mainBtnClassName="bg-main-accent text-white hover:bg-main-accent/80 active:bg-main-accent/80 "
          secondaryBtnClassName="bg-main-secondary"
          action={handlePin}
          closeModal={pinCloseModal}
        />
      </Modal>
      <Modal
        modalClassName="max-w-xs relative text-main-primary bg-main-background w-full p-8 rounded-2xl"
        open={blockOpen}
        closeModal={blockCloseModal}
        actionModal
      >
        <ActionModal
          {...currentBlockUserModalData}
          mainBtnClassName="bg-accent-red hover:bg-accent-red/90 active:bg-accent-red/75 accent-tab
                            focus-visible:bg-accent-red/90"
          secondaryBtnClassName="bg-main-secondary"
          action={handleBlock}
          closeModal={blockCloseModal}
        />
      </Modal>
      <Modal
        modalClassName="max-w-xs relative text-main-primary bg-main-background w-full p-8 rounded-2xl"
        open={allowNotiOpen}
        closeModal={allowNotiCloseModal}
        actionModal
      >
        <ActionModal
          {...currentBlockPostNotificationsData}
          mainBtnClassName="bg-main-accent hover:bg-main-accent/80 active:bg-main-accent/80 "
          secondaryBtnClassName="bg-main-secondary"
          action={handleBlockNotifications}
          closeModal={allowNotiCloseModal}
        />
      </Modal>
    </>
  );
};

export default PostOptions;
