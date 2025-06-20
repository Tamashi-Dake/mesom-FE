import { SEO } from "../common/SEO";
import useAddUserStore from "../../hooks/useStore";
import DefaultHeader from "../layout/DefaultHeader";
import MessageInput from "./MessageInput";

const NewConversation = () => {
  const { users } = useAddUserStore();
  const conversationName = users
    .slice(0, 3)
    .map((member) => member.displayName || member.username)
    .join();
  return (
    <>
      <SEO title={"New Conversation / Mesom"} />
      <div className="flex h-[100vh] flex-col overflow-auto xs:h-full">
        <DefaultHeader label={conversationName} showBackArrow />
        <div className="flex-1 space-y-4 overflow-y-auto p-4"></div>
        <MessageInput />
      </div>
    </>
  );
};

export default NewConversation;
