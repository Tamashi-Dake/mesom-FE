import { formatDate } from "@/utils/formatDate";
import { ToolTip } from "@/components/common/Tooltip";

const PostDate = ({ createdAt }) => {
  return (
    <div className={"flex gap-1 py-4"}>
      <div className="group relative">
        <div
          className={
            "custom-underline peer whitespace-nowrap text-sm text-main-secondary"
          }
        >
          {formatDate(createdAt, "full")}
        </div>
        <ToolTip
          className="translate-y-1 peer-focus:opacity-100 peer-focus-visible:visible peer-focus-visible:delay-200"
          tip={formatDate(createdAt, "full")}
        />
      </div>
    </div>
  );
};

export default PostDate;
