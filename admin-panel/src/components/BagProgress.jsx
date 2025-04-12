import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSync,
  FaBoxOpen,
  FaCheck,
  FaCloudUploadAlt,
  FaHistory,
} from "react-icons/fa";

const BaseURL = import.meta.env.VITE_API_URL;

function BagProgress() {
  const [stats, setStats] = useState({
    totalBags: 0,
    scanned: 0,
    uploaded: 0,
    notProcessed: 0,
  });
  const [bagData, setBagData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get all bags to calculate stats
      const allBagsResponse = await axios.get(`${BaseURL}/bagging`, {
        params: { limit: 1000 }, // Get a large number to calculate stats
      });

      const bags = allBagsResponse.data.data || [];

      // Calculate stats based on API data
      const totalBags = bags.length;
      const scanned = bags.filter((bag) => bag.IsScanned).length;
      const uploaded = bags.filter(
        (bag) => bag.IsScanned && bag.IsUploaded
      ).length;
      const notProcessed = bags.filter(
        (bag) => !bag.IsScanned && !bag.IsUploaded
      ).length;

      setStats({
        totalBags,
        scanned,
        uploaded,
        notProcessed,
      });

      // Get paginated data for the activity table
      const paginatedResponse = await axios.get(`${BaseURL}/bagging`, {
        params: { page, limit: 10 },
      });

      setBagData(paginatedResponse.data.data || []);
      setTotalPages(paginatedResponse.data.totalPages || 1);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Clean up interval on component unmount
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [page]);

  const toggleAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    } else {
      const interval = setInterval(fetchStats, 10000); // Every 10 seconds
      setRefreshInterval(interval);
    }
  };

  // Calculate completion percentage
  const completionPercentage =
    stats.totalBags > 0
      ? Math.round((stats.scanned / stats.totalBags) * 100)
      : 0;

  // Calculate upload percentage
  const uploadPercentage =
    stats.scanned > 0 ? Math.round((stats.uploaded / stats.scanned) * 100) : 0;

  // Calculate bags remaining
  const bagsRemaining = stats.totalBags - stats.scanned;

  // Handle pagination
  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  // Determine bag status based on isScanned and isUploaded
  const getBagStatus = (bag) => {
    if (bag.IsScanned && bag.IsUploaded) {
      return {
        action: "Data Uploaded",
        status: "Completed",
        statusClass: "bg-blue-100 text-blue-800",
      };
    } else if (bag.IsScanned && !bag.IsUploaded) {
      return {
        action: "Bag Scanned",
        status: "Success",
        statusClass: "bg-green-100 text-green-800",
      };
    } else {
      return {
        action: "Not Scanned",
        status: "Not Started",
        statusClass: "bg-gray-200 text-gray-600",
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Bag Progress Dashboard
          </h2>
          {lastUpdated && (
            <span className="text-sm text-gray-600">
              Last refreshed: {lastUpdated}
            </span>
          )}
        </div>

        {/* <div className="flex space-x-3">
          <button
            onClick={toggleAutoRefresh}
            className={`flex items-center px-4 py-2 ${
              refreshInterval ? "bg-green-600" : "bg-gray-600"
            } text-white rounded-lg hover:opacity-90 transition`}
          >
            <FaHistory className="mr-2" />{" "}
            {refreshInterval ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </button>
          <button
            onClick={fetchStats}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />{" "}
            Refresh Now
          </button>
        </div> */}

        <div className="flex space-x-2">
          <button
            onClick={toggleAutoRefresh}
            className={`flex items-center p-2 rounded-lg ${
              refreshInterval
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition-colors`}
            title={
              refreshInterval ? "Auto-refresh is on" : "Auto-refresh is off"
            }
          >
            <FaHistory
              className={`text-sm ${
                refreshInterval ? "text-green-600" : "text-gray-500"
              }`}
            />
          </button>
          <button
            onClick={fetchStats}
            className="flex items-center p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
            disabled={loading}
            title="Refresh data"
          >
            <FaSync
              className={`text-sm ${
                loading ? "animate-spin text-blue-600" : "text-blue-500"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border-l-4 border-teal-500">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <FaBoxOpen className="text-teal-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {stats.totalBags}
              </p>
              <p className="text-sm text-gray-600">Total Bags</p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm mt-2 text-gray-600">
              {completionPercentage}% of total process complete
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border-l-4 border-blue-500">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FaCheck className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{stats.scanned}</p>
              <p className="text-sm text-gray-600">Bags Scanned</p>
            </div>
          </div>
          <div className="mt-auto">
            <p className="text-sm text-gray-600">
              {bagsRemaining} bags remaining to be scanned
            </p>
            {stats.scanned > 0 && stats.totalBags > 0 && (
              <p className="text-sm font-medium mt-1">
                Rate: ~{Math.round((stats.scanned / stats.totalBags) * 100)}%
                scanned
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border-l-4 border-purple-500">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FaCloudUploadAlt className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {stats.uploaded}
              </p>
              <p className="text-sm text-gray-600">Bags Uploaded</p>
            </div>
          </div>
          <div className="mt-auto">
            {stats.scanned > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${uploadPercentage}%` }}
                ></div>
              </div>
            )}
            <p className="text-sm mt-2 text-gray-600">
              {stats.scanned > 0
                ? `${uploadPercentage}% of scanned bags uploaded`
                : "No bags scanned yet"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-full border-l-4 border-gray-500">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-gray-100 rounded-lg">
              <FaBoxOpen className="text-gray-600" size={24} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {stats.notProcessed}
              </p>
              <p className="text-sm text-gray-600">Not Processed</p>
            </div>
          </div>
          <div className="mt-auto">
            {stats.totalBags > 0 && (
              <p className="text-sm text-gray-600">
                {Math.round((stats.notProcessed / stats.totalBags) * 100)}% of
                bags not yet processed
              </p>
            )}
            {/* 
            // Commented out as requested - can be used in future implementations
            {stats.notProcessed > 0 && (
              <button className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-800">
                View unprocessed bags
              </button>
            )}
            */}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-700">
            Bag Activity Log
          </h3>

          <span
            className={`relative inline-flex items-center text-xs font-medium px-3 py-1 rounded-full ${
              refreshInterval
                ? "bg-gradient-to-r from-blue-50 via-red-50 to-blue-50 border border-blue-200 text-blue-800"
                : "bg-gray-50 border border-gray-200 text-gray-600"
            }`}
          >
            <span
              className={`relative flex h-2 w-2 mr-2 ${
                refreshInterval ? "bg-green-500 animate-pulse" : "bg-gray-400"
              } rounded-full`}
            ></span>
            Live Updates-{refreshInterval ? "On" : "Off"}
          </span>
          
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bag ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Packing ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bagData.map((bag) => {
                  const { action, status, statusClass } = getBagStatus(bag);
                  return (
                    <tr key={bag.BagID}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bag.BagID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bag.PackingID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    page === 1
                      ? "text-gray-300"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className={`relative ml-3 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    page === totalPages
                      ? "text-gray-300"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{" "}
                    <span className="font-medium">{totalPages}</span> pages
                  </p>
                </div>
                <div>
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={handlePrevPage}
                      disabled={page === 1}
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 ${
                        page === 1
                          ? "text-gray-300"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }).map(
                      (_, i) => {
                        const pageNum = Math.min(
                          Math.max(page - 2, 1) + i,
                          totalPages
                        );
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                              page === pageNum
                                ? "bg-blue-600 text-white focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "text-gray-900 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={handleNextPage}
                      disabled={page === totalPages}
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 ${
                        page === totalPages
                          ? "text-gray-300"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      &rarr;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BagProgress;
