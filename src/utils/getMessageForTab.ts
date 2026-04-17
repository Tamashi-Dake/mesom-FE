type TabType = "userPosts" | "userReplies" | "userMedias" | "userLikes";

interface TabMessage {
  title: string;
  description: string;
}

const getMessageForTab = (
  type: TabType,
  isMyProfile: boolean,
  username: string,
): TabMessage | undefined => {
  const baseMessages: Record<TabType, TabMessage> = {
    userPosts: {
      title: isMyProfile
        ? "You haven't posted yet"
        : `@${username} hasn't posted yet`,
      description: isMyProfile
        ? "When you do, your posts will show up here."
        : "When they do, their posts will show up here.",
    },
    userReplies: {
      title: isMyProfile
        ? "You haven't replied yet"
        : `@${username} hasn't replied yet`,
      description: isMyProfile
        ? "When you do, your replies will show up here."
        : "When they do, their replies will show up here.",
    },
    userMedias: {
      title: isMyProfile
        ? "Lights, camera … attachments!"
        : `@${username} hasn't uploaded media yet`,
      description: isMyProfile
        ? "When you post photos, they will show up here."
        : "When they do, their media will show up here.",
    },
    userLikes: {
      title: isMyProfile
        ? "You don't have any likes yet"
        : `@${username} hasn't liked anything yet`,
      description: isMyProfile
        ? "Tap the heart on any post to show it some love. When you do, it'll show up here."
        : "When they do, their likes will show up here.",
    },
  };

  return baseMessages[type];
};

export default getMessageForTab;
