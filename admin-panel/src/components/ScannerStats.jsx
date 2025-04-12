// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSync, FaUserCheck } from 'react-icons/fa';

// const BaseURL = import.meta.env.VITE_API_URL;

// function ScannerStats() {
//   const [stats, setStats] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const fetchStats = (page = 1) => {
//     axios.get(`${BaseURL}/scanner-stats?page=${page}&limit=10`).then((res) => {
//       setStats(res.data.data);
//       setTotalPages(res.data.totalPages);
//       setCurrentPage(res.data.currentPage);
//       setLastUpdated(new Date().toLocaleTimeString());
//     });
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Scanner Stats</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-gray-700">Scanner Performance</h3>
//           <button
//             onClick={() => fetchStats(currentPage)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             <FaSync className="mr-2" /> Refresh
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {stats.map((scanner) => (
//             <div
//               key={scanner.uid}
//               className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//             >
//               <div className="flex items-center space-x-4">
//                 <div className="bg-blue-100 p-3 rounded-full">
//                   <FaUserCheck className="text-blue-600" size={24} />
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800">{scanner.name || scanner.uid}</h4>
//                   <p className="text-sm text-gray-600">UID: {scanner.uid}</p>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <p className="text-2xl font-bold text-blue-600">{scanner.scanCount}</p>
//                 <p className="text-sm text-gray-500">Scans Completed</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-between items-center mt-6">
//           <button
//             onClick={() => fetchStats(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => fetchStats(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ScannerStats;

import { useEffect, useState } from "react";
import axios from "axios";
// import { ArrowLeft, ArrowRight, RotateCw, Activity } from 'lucide-react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiRotateCw, FiActivity } from "react-icons/fi";
import LastUpdated from "./LastUpdated";

const BaseURL = import.meta.env.VITE_API_URL;

function ScannerStats() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${BaseURL}/scanner-stats?page=${page}&limit=9`
      );
      setStats(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Failed to fetch scanner stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800">
            Scanner Statistics
          </h2>

          <LastUpdated
            lastUpdated={lastUpdated}
            isLoading={isLoading}
            onRefresh={() => fetchStats(currentPage)}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((scanner) => (
            <div
              key={scanner.uid}
              className="bg-white rounded-lg shadow-sm p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FiActivity size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 truncate">
                  <h4 className="font-medium text-gray-900 truncate capitalize">
                    {scanner.name || `Scanner ${scanner.uid.substring(0, 6)}`}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {scanner.uid}
                  </p>
                </div>
              </div>

              <div className="flex items-baseline">
                <span className="text-2xl font-semibold text-gray-900">
                  {scanner.scanCount}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  completed scans
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {stats.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiActivity size={32} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-gray-700 font-medium mb-1">
              No scanner data available
            </h3>
            <p className="text-gray-500 text-sm">
              Try refreshing or check back later
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && stats.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FiRotateCw
              size={32}
              className="text-blue-500 mx-auto mb-4 animate-spin"
            />
            <h3 className="text-gray-700 font-medium">
              Loading scanner data...
            </h3>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => fetchStats(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded hover:bg-gray-100 text-gray-700 disabled:text-gray-300 transition-colors"
                aria-label="Previous page"
              >
                <FaArrowLeft size={16} />
              </button>

              <div className="px-4 py-2 text-sm text-gray-700">
                {currentPage} <span className="text-gray-400">of</span>{" "}
                {totalPages}
              </div>

              <button
                onClick={() => fetchStats(currentPage + 1)}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded hover:bg-gray-100 text-gray-700 disabled:text-gray-300 transition-colors"
                aria-label="Next page"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerStats;
