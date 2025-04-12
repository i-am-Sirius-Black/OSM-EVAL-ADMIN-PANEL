import { FiRotateCw } from "react-icons/fi";

const LastUpdated = ({ lastUpdated, isLoading, onRefresh }) => {
  if (!lastUpdated) return null;

  return (
    <span className="text-xs text-gray-500 flex items-center">
     Last Updated {lastUpdated}
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="ml-3 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        aria-label="Refresh data"
      >
        <FiRotateCw
          size={16}
          className={isLoading ? "animate-spin" : ""}
        />
      </button>
    </span>
  );
};

export default LastUpdated;
