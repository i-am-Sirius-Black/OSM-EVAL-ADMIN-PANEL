

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import LastUpdated from './LastUpdated';
import { debounce } from 'lodash';

const BaseURL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [bags, setBags] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBags = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BaseURL}/bagging?page=${page}&limit=5`);
      console.log("bag updated from db");
      setBags(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };


  // Create debounced version with useMemo
  const debouncedFetchBags = useMemo(() => 
    debounce((page) => {
      fetchBags(page);
    }, 2000),
    [] 
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedFetchBags.cancel();
    };
  }, [debouncedFetchBags]);

  // Your refresh handler
  const handleRefresh = () => {
    debouncedFetchBags(currentPage);
  };



  useEffect(() => {
    fetchBags();
  }, []);

  const getStatus = (bag) => {
    if (!bag.IsScanned && !bag.IsUploaded) return 'Not Started';
    if (bag.IsScanned && !bag.IsUploaded) return 'Scanned';
    if (bag.IsScanned && bag.IsUploaded) return 'Uploaded';
    return 'Unknown';
  };

  const filteredBags = bags.filter((bag) => {
    const status = getStatus(bag);
    return filter === 'all' || status === filter;
  });

  // return (
  //   <div className="min-h-screen">
  //     <div className="flex justify-between items-center mb-6">
  //       <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
  //       <LastUpdated 
  //       lastUpdated={lastUpdated} 
  //       isLoading={isLoading} 
  //       onRefresh={() => fetchBags(currentPage)} 
  //       />

  //     </div>
  //     <div className="bg-white p-6 rounded-xl shadow-lg">
  //       <div className="flex justify-between items-center mb-4">
  //         <h3 className="text-xl font-semibold text-gray-700">Bag Status</h3>
  //         <div className="flex items-center space-x-4">
  //           <select
  //             value={filter}
  //             onChange={(e) => setFilter(e.target.value)}
  //             className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           >
  //             <option value="all">All</option>
  //             <option value="Not Started">Not Started</option>
  //             <option value="Scanned">Scanned</option>
  //             <option value="Uploaded">Uploaded</option>
  //           </select>
  //         </div>
  //       </div>
  //       <div className="overflow-x-auto">
  //         <table className="w-full text-left">
  //           <thead>
  //             <tr className="bg-gray-100 text-gray-600">
  //               <th className="p-4 font-semibold">Bag ID</th>
  //               <th className="p-4 font-semibold">Packing ID</th>
  //               <th className="p-4 font-semibold">Copies Count</th>
  //               <th className="p-4 font-semibold">Status</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {filteredBags.map((bag) => (
  //               <tr key={bag.BagID} className="border-b hover:bg-gray-50 transition-colors">
  //                 <td className="p-4 text-gray-800">{bag.BagID}</td>
  //                 <td className="p-4 text-gray-800">{bag.PackingID}</td>
  //                 <td className="p-4 text-gray-800">{bag.CopiesCount}</td>
  //                 <td className="p-4">
  //                   <span
  //                     className={`px-3 py-1 rounded-full text-sm font-medium ${
  //                       getStatus(bag) === 'Uploaded'
  //                         ? 'bg-green-100 text-green-800'
  //                         : getStatus(bag) === 'Scanned'
  //                         ? 'bg-yellow-100 text-yellow-800'
  //                         : 'bg-red-100 text-red-800'
  //                     }`}
  //                   >
  //                     {getStatus(bag)}
  //                   </span>
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //       <div className="flex justify-between items-center mt-4">
  //         <button
  //           onClick={() => fetchBags(currentPage - 1)}
  //           disabled={currentPage === 1}
  //           className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
  //         >
  //           Previous
  //         </button>
  //         <span className="text-gray-700">
  //           Page {currentPage} of {totalPages}
  //         </span>
  //         <button
  //           onClick={() => fetchBags(currentPage + 1)}
  //           disabled={currentPage === totalPages}
  //           className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
  //         >
  //           Next
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

//? new ui v1.1

return (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
      <LastUpdated 
        lastUpdated={lastUpdated} 
        isLoading={isLoading} 
        // onRefresh={() => fetchBags(currentPage)}
        onRefresh={handleRefresh}
        className="text-sm text-gray-600"
      />
    </div>

    {/* Main Card */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Bag Status</h3>
        <div className="flex items-center space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="all">All</option>
            <option value="Not Started">Not Started</option>
            <option value="Scanned">Scanned</option>
            <option value="Uploaded">Uploaded</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bag ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packing ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBags.map((bag) => (
              <tr key={bag.BagID} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bag.BagID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bag.PackingID}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{bag.CopiesCount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      getStatus(bag) === 'Uploaded'
                        ? 'bg-green-100 text-green-800'
                        : getStatus(bag) === 'Scanned'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {getStatus(bag)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200">
        <div className="flex-1 hidden sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => fetchBags(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 rounded-l-md text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              } transition-colors`}
            >
              <span className="sr-only">Previous</span>
              ←
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = Math.min(Math.max(currentPage - 2, 1) + i, totalPages);
              return (
                <button
                  key={pageNum}
                  onClick={() => fetchBags(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => fetchBags(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-2 rounded-r-md text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-500 hover:bg-gray-50'
              } transition-colors`}
            >
              <span className="sr-only">Next</span>
              →
            </button>
          </nav>
        </div>
        {/* Mobile Pagination */}
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => fetchBags(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => fetchBags(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
);


}

export default Dashboard;


//? v1.1 updated ui....

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FiRefreshCw, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// const BaseURL = import.meta.env.VITE_API_URL;

// function Dashboard() {
//   const [bags, setBags] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchBags = async (page = 1) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${BaseURL}/bagging?page=${page}&limit=10`);
//       setBags(res.data.data);
//       setTotalPages(res.data.totalPages);
//       setCurrentPage(res.data.currentPage);
//       setLastUpdated(new Date().toLocaleTimeString());
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBags();
//   }, []);

//   const getStatus = (bag) => {
//     if (!bag.IsScanned && !bag.IsUploaded) return 'Not Started';
//     if (bag.IsScanned && !bag.IsUploaded) return 'Scanned';
//     if (bag.IsScanned && bag.IsUploaded) return 'Uploaded';
//     return 'Unknown';
//   };

//   const filteredBags = bags.filter((bag) => {
//     const status = getStatus(bag);
//     return filter === 'all' || status === filter;
//   });

//   const statusColors = {
//     'Uploaded': 'bg-emerald-100 text-emerald-800',
//     'Scanned': 'bg-amber-100 text-amber-800',
//     'Not Started': 'bg-gray-100 text-gray-800'
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Bag Tracking</h1>
//             <p className="text-sm text-gray-500">
//               Last updated: {lastUpdated || 'Never'}
//             </p>
//           </div>
          
//           <button
//             onClick={() => fetchBags(currentPage)}
//             className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//             disabled={isLoading}
//           >
//             <FiRefreshCw className={`text-sm ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>

//         {/* Dashboard Card */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           {/* Card Header */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b border-gray-200 gap-3">
//             <h2 className="font-medium text-gray-800">Bag Status Overview</h2>
            
//             <div className="relative">
//               <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="pl-8 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
//               >
//                 <option value="all">All Statuses</option>
//                 <option value="Not Started">Not Started</option>
//                 <option value="Scanned">Scanned</option>
//                 <option value="Uploaded">Uploaded</option>
//               </select>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
//                   <th className="px-4 py-3 font-medium">Bag ID</th>
//                   <th className="px-4 py-3 font-medium">Packing ID</th>
//                   <th className="px-4 py-3 font-medium">Copies</th>
//                   <th className="px-4 py-3 font-medium">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredBags.length > 0 ? (
//                   filteredBags.map((bag) => (
//                     <tr key={bag.BagID} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900">{bag.BagID}</td>
//                       <td className="px-4 py-3 text-sm text-gray-500">{bag.PackingID}</td>
//                       <td className="px-4 py-3 text-sm text-gray-500">{bag.CopiesCount}</td>
//                       <td className="px-4 py-3">
//                         <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[getStatus(bag)]}`}>
//                           {getStatus(bag)}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="4" className="px-4 py-6 text-center text-sm text-gray-500">
//                       No bags found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
//             <button
//               onClick={() => fetchBags(currentPage - 1)}
//               disabled={currentPage === 1 || isLoading}
//               className="flex items-center px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <FiChevronLeft className="mr-1" /> Previous
//             </button>
            
//             <span className="text-sm text-gray-700">
//               Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
//             </span>
            
//             <button
//               onClick={() => fetchBags(currentPage + 1)}
//               disabled={currentPage === totalPages || isLoading}
//               className="flex items-center px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next <FiChevronRight className="ml-1" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;