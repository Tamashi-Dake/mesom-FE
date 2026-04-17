import { Link, useRouteError } from "react-router-dom";

const ErrorElement = () => {
  // Lấy thông tin lỗi từ useRouteError
  const error = useRouteError();

  return (
    <div className="mx-auto my-10 bg-main-background text-center text-main-primary">
      <h2 className="text-2xl font-bold text-main-accent">Đã có lỗi xảy ra!</h2>

      {/* Kiểm tra và hiển thị thông tin lỗi nếu có */}
      <p className="">
        {error?.message || "Có lỗi xảy ra, vui lòng thử lại sau."}
      </p>

      <p>
        Quay lại{" "}
        <Link to="/" className="text-main-accent">
          Trang Chủ
        </Link>
      </p>
    </div>
  );
};

export default ErrorElement;
