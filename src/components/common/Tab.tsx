const Tab = ({ label, isActive, onClick }) => (
  <div
    className="relative flex flex-1 cursor-pointer select-none justify-center p-3 transition-all duration-300 ease-in-out"
    onClick={onClick}
  >
    {label}
    <div
      className={`absolute bottom-0 h-1 w-10 rounded-full bg-main-accent transition-all duration-200 ease-in-out ${
        isActive ? "scale-100" : "scale-0 duration-75"
      }`}
    ></div>
  </div>
);

export default Tab;
