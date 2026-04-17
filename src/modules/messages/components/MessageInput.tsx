import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { CiImageOn } from "react-icons/ci";
import { BsSend } from "react-icons/bs";
import { useMutation } from "@tanstack/react-query";
import { createConversation } from "@/modules/conversations/api";
import { createMessage } from "../api";
import { messageSchema, type MessageFormData } from "../schema";
import useAddUserStore from "@/modules/conversations/store";
import { IConversation, INewParticipant } from "@/types";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/app/providers/authProvider";
import { EConversationSocketEvents } from "@/config/socketEvents";
import { useSocket } from "@/app/providers/socketProvider";

interface IProps {
  conversation?: IConversation;
}

const MessageInput = ({ conversation }: IProps) => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | ArrayBuffer | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { users, resetUsers } = useAddUserStore();
  const { currentUser } = useCurrentUser();
  const socket = useSocket();

  const { register, handleSubmit, reset } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: "" },
  });

  const conversationMutation = useMutation({
    mutationFn: createConversation,
  });
  const messageMutation = useMutation({
    mutationFn: createMessage,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async ({ text }: MessageFormData) => {
    const textMessage = text.trim();

    if (!textMessage && !fileInputRef.current?.value) {
      return;
    }

    const postData = new FormData();
    postData.append("text", textMessage);
    postData.append("images", fileInputRef.current?.files?.[0] || "");

    try {
      if (!conversation?._id) {
        conversationMutation.mutate(
          {
            participants: users.map((user: INewParticipant) => user._id),
            name:
              users.length > 1
                ? users.map((user: INewParticipant) => user.username).join(", ")
                : users[0].username,
          },
          {
            onSuccess: (conversation) => {
              messageMutation.mutate(
                {
                  conversationId: conversation?._id,
                  postData,
                },
                {
                  onSuccess: () => {
                    navigate(`/conversation/${conversation._id}`);
                  },
                },
              );
            },
          },
        );
      } else {
        messageMutation.mutate(
          {
            conversationId: conversation?._id,
            postData,
          },
          {
            onSuccess: (message) => {
              socket?.emit(EConversationSocketEvents.newMessage, {
                userId: currentUser._id,
                conversation,
                message,
              });
            },
          },
        );
      }

      // Clear form
      reset({ text: "" });
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      resetUsers();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="sticky bottom-0 w-full self-end p-4">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview as string}
              alt="Preview"
              className="h-20 w-20 rounded-lg border border-zinc-700 object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute -right-1.5 -top-1.5 m-2 flex h-5 w-5 items-center justify-center rounded-full bg-main-secondary/30"
              type="button"
            >
              <AiOutlineClose className="size-3 text-main-primary" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2">
          <input
            type="text"
            className="w-full rounded-lg border border-main-secondary bg-main-background p-2 text-sm text-main-primary focus:border-main-accent focus:outline-none focus:ring-main-accent"
            placeholder="Type a message..."
            {...register("text")}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`flex ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <CiImageOn className="text-main-primary" size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle disabled:opacity-55"
          disabled={conversationMutation.isPending || messageMutation.isPending}
        >
          <BsSend className="text-main-accent" size={20} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
