// import { useEffect, useState } from "react";
// import axios from "axios";
// import LastUpdated from "../components/LastUpdated";
// import { FaSearch } from "react-icons/fa";

// const BaseURL = import.meta.env.VITE_API_URL;

// function Copies() {
//   const [copies, setCopies] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [searchBagId, setSearchBagId] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchCopies = async (page = 1) => {
//     setIsLoading(true);
//     try {
//       const url = `${BaseURL}/gunning?page=${page}&limit=20${
//         searchBagId ? `&bagId=${searchBagId}` : ""
//       }`;

//       const res = await axios.get(url);
//       setCopies(res.data.data);
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
//     fetchCopies();
//   }, []);

//   const handleSearch = () => {
//     setCurrentPage(1); // Reset to first page on new search
//     fetchCopies(1);
//   };

//   const filteredCopies = copies.filter((copy) => {
//     return (
//       filter === "all" ||
//       (filter === "Scanned" ? copy.IsScanned : !copy.IsScanned)
//     );
//   });

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Copy Management</h2>
//         <LastUpdated
//           lastUpdated={lastUpdated}
//           isLoading={isLoading}
//           onRefresh={() => fetchCopies(currentPage)}
//         />
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//           <h3 className="text-xl font-semibold text-gray-700">
//             Scanned Copies
//           </h3>

//           <div className="flex flex-wrap items-center gap-3">
//             {/* Search Input with Icon */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by BagID (e.g., CSE406-BAG-001)"
//                 value={searchBagId}
//                 onChange={(e) => setSearchBagId(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                 className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//               />
//               <FaSearch
//                 size={16}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//             </div>

//             {/* Filter Dropdown */}
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="py-2 px-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             >
//               <option value="all">All</option>
//               <option value="Scanned">Scanned</option>
//               <option value="Not Scanned">Not Scanned</option>
//             </select>

//             {/* Icon Only Search Trigger */}
//             <button
//               onClick={handleSearch}
//               className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
//               aria-label="Search"
//             >
//               <FaSearch size={16} />
//             </button>
//           </div>
//         </div>
//         <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold">Copy Barcode</th>
//                 <th className="p-4 font-semibold">Bag ID</th>
//                 <th className="p-4 font-semibold">Packing ID</th>
//                 <th className="p-4 font-semibold">Gunner ID</th>
//                 <th className="p-4 font-semibold">Gun Timestamp</th>
//                 <th className="p-4 font-semibold">Scanned</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCopies.map((copy) => (
//                 <tr
//                   key={copy.CopyBarcode}
//                   className="border-b hover:bg-gray-50 transition-colors"
//                 >
//                   <td className="p-4 text-gray-800">{copy.CopyBarcode}</td>
//                   <td className="p-4 text-gray-800">{copy.BagID}</td>
//                   <td className="p-4 text-gray-800">{copy.PackingID}</td>
//                   <td className="p-4 text-gray-800">{copy.GID}</td>
//                   <td className="p-4 text-gray-800">
//                     {new Date(copy.GunTS).toLocaleString()}
//                   </td>
//                   <td className="p-4">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         copy.IsScanned
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {copy.IsScanned ? "Yes" : "No"}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => fetchCopies(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => fetchCopies(currentPage + 1)}
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

// export default Copies;



//? v1.1 - ui updated

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LastUpdated from "../components/LastUpdated";
import { FaSearch } from "react-icons/fa";

const BaseURL = import.meta.env.VITE_API_URL;

// function Copies() {
//   const [copies, setCopies] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [searchBagId, setSearchBagId] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchCopies = async (page = 1) => {
//     setIsLoading(true);
//     try {
//       const url = `${BaseURL}/gunning?page=${page}&limit=20${
//         searchBagId ? `&bagId=${searchBagId}` : ""
//       }`;

//       const res = await axios.get(url);
//       setCopies(res.data.data);
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
//     fetchCopies();
//   }, []);

//   const handleSearch = () => {
//     setCurrentPage(1); // Reset to first page on new search
//     fetchCopies(1);
//   };

//   const filteredCopies = copies.filter((copy) => {
//     return (
//       filter === "all" ||
//       (filter === "Scanned" ? copy.IsScanned : !copy.IsScanned)
//     );
//   });

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Copy Management</h2>
//         <LastUpdated
//           lastUpdated={lastUpdated}
//           isLoading={isLoading}
//           onRefresh={() => fetchCopies(currentPage)}
//           className="text-sm text-gray-600"
//         />
//       </div>

//       {/* Main Card */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         {/* Card Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//           <h3 className="text-lg font-semibold text-gray-900">Scanned Copies</h3>
//           <div className="flex flex-wrap items-center gap-3">
//             {/* Search Input with Icon */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by BagID (e.g., CSE406-BAG-001)"
//                 value={searchBagId}
//                 onChange={(e) => setSearchBagId(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 className="pl-10 pr-4 py-2 w-full sm:w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               />
//               <FaSearch
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//             </div>

//             {/* Filter Dropdown */}
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//             >
//               <option value="all">All</option>
//               <option value="Scanned">Scanned</option>
//               <option value="Not Scanned">Not Scanned</option>
//             </select>

//             {/* Search Button */}
//             <button
//               onClick={handleSearch}
//               className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center"
//               aria-label="Search"
//             >
//               <FaSearch size={14} />
//             </button>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy Barcode</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bag ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packing ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gunner ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gun Timestamp</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanned</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCopies.map((copy) => (
//                 <tr key={copy.CopyBarcode} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{copy.CopyBarcode}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.BagID}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.PackingID}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.GID}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                     {new Date(copy.GunTS).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                         copy.IsScanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                       }`}
//                     >
//                       {copy.IsScanned ? 'Yes' : 'No'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Section */}
//         <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200">
//           <div className="flex-1 hidden sm:flex sm:items-center sm:justify-between">
//             <p className="text-sm text-gray-600">
//               Showing page <span className="font-medium">{currentPage}</span> of{' '}
//               <span className="font-medium">{totalPages}</span>
//             </p>
//             <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
//               <button
//                 onClick={() => fetchCopies(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`relative inline-flex items-center px-3 py-2 rounded-l-md text-sm font-medium ${
//                   currentPage === 1
//                     ? 'text-gray-300 cursor-not-allowed'
//                     : 'text-gray-500 hover:bg-gray-50'
//                 } transition-colors`}
//               >
//                 <span className="sr-only">Previous</span>
//                 ←
//               </button>
//               {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
//                 const pageNum = Math.min(Math.max(currentPage - 2, 1) + i, totalPages);
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => fetchCopies(pageNum)}
//                     className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
//                       currentPage === pageNum
//                         ? 'bg-blue-600 text-white'
//                         : 'text-gray-700 hover:bg-gray-50'
//                     } transition-colors`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//               <button
//                 onClick={() => fetchCopies(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`relative inline-flex items-center px-3 py-2 rounded-r-md text-sm font-medium ${
//                   currentPage === totalPages
//                     ? 'text-gray-300 cursor-not-allowed'
//                     : 'text-gray-500 hover:bg-gray-50'
//                 } transition-colors`}
//               >
//                 <span className="sr-only">Next</span>
//                 →
//               </button>
//             </nav>
//           </div>
//           {/* Mobile Pagination */}
//           <div className="flex flex-1 justify-between sm:hidden">
//             <button
//               onClick={() => fetchCopies(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Previous
//             </button>
//             <button
//               onClick={() => fetchCopies(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`px-4 py-2 rounded-md text-sm font-medium ${
//                 currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Copies;

//? v1.2 - search by copyid 

// function Copies() {
//   const [copies, setCopies] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [searchCopyBarcode, setSearchCopyBarcode] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchCopies = async (page = 1) => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${BaseURL}/gunning?page=${page}&limit=20`);
//       setCopies(res.data.data);
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
//     fetchCopies();
//   }, []);

//   // Filter copies based on both search term and status filter
//   const filteredCopies = useMemo(() => {
//     return copies.filter((copy) => {
//       const matchesSearch = searchCopyBarcode 
//         ? copy.CopyBarcode?.toLowerCase().includes(searchCopyBarcode.toLowerCase())
//         : true;
      
//       const matchesFilter = 
//         filter === "all" ||
//         (filter === "Scanned" ? copy.IsScanned : !copy.IsScanned);
      
//       return matchesSearch && matchesFilter;
//     });
//   }, [copies, searchCopyBarcode, filter]);

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Copy Management</h2>
//         <LastUpdated
//           lastUpdated={lastUpdated}
//           isLoading={isLoading}
//           onRefresh={() => fetchCopies(currentPage)}
//           className="text-sm text-gray-600"
//         />
//       </div>

//       {/* Main Card */}
//       <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//         {/* Card Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//           <h3 className="text-lg font-semibold text-gray-900">Scanned Copies</h3>
//           <div className="flex flex-wrap items-center gap-3">
//             {/* Search Input with Icon - Now searches by CopyBarcode */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by Copy Barcode"
//                 value={searchCopyBarcode}
//                 onChange={(e) => setSearchCopyBarcode(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full sm:w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//               />
//               <FaSearch
//                 size={14}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//             </div>

//             {/* Filter Dropdown */}
//             <select
//               value={filter}
//               onChange={(e) => setFilter(e.target.value)}
//               className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//             >
//               <option value="all">All</option>
//               <option value="Scanned">Scanned</option>
//               <option value="Not Scanned">Not Scanned</option>
//             </select>
//           </div>
//         </div>

//         {/* Table Section */}
//         <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy Barcode</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bag ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packing ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gunner ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gun Timestamp</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanned</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredCopies.length > 0 ? (
//                 filteredCopies.map((copy) => (
//                   <tr key={copy.CopyBarcode} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{copy.CopyBarcode}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.BagID}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.PackingID}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.GID}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                       {new Date(copy.GunTS).toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                           copy.IsScanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {copy.IsScanned ? 'Yes' : 'No'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No copies found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Section - Removed since we're not doing API pagination for filtered results */}
//       </div>
//     </div>
//   );
// }

//? v1.3 - All filtering and searching happens on the backend, Only 20 records are transferred per request (configurable via limit)

function Copies() {
  const [copies, setCopies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchCopies = async (page = 1, search = "", scannedFilter = null) => {
    setIsLoading(true);
    try {
      let isScanned = null;
      if (scannedFilter === "Scanned") isScanned = true;
      if (scannedFilter === "Not Scanned") isScanned = false;

      const url = `${BaseURL}/gunning?page=${page}&limit=20${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }${isScanned !== null ? `&isScanned=${isScanned}` : ""}`;

      const res = await axios.get(url);
      setCopies(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Set new timeout
    setSearchTimeout(
      setTimeout(() => {
        setCurrentPage(1); // Reset to first page when search changes
        fetchCopies(1, value, filter !== "all" ? filter : null);
      }, 500) // 500ms debounce delay
    );
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    setCurrentPage(1); // Reset to first page when filter changes
    fetchCopies(1, searchTerm, value !== "all" ? value : null);
  };

  // Initial load and page change
  useEffect(() => {
    fetchCopies(currentPage, searchTerm, filter !== "all" ? filter : null);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Copy Management</h2>
        <LastUpdated
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefresh={() => fetchCopies(currentPage, searchTerm, filter !== "all" ? filter : null)}
          className="text-sm text-gray-600"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Scanned Copies</h3>
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Copy Barcode, Bag ID, or Packing ID"
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 w-full sm:w-72 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <FaSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={handleFilterChange}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All</option>
              <option value="Scanned">Scanned</option>
              <option value="Not Scanned">Not Scanned</option>
            </select>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copy Barcode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bag ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Packing ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gunner ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gun Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scanned</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {copies.length > 0 ? (
                copies.map((copy) => (
                  <tr key={copy.CopyBarcode} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{copy.CopyBarcode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.BagID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.PackingID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{copy.GID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(copy.GunTS).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          copy.IsScanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {copy.IsScanned ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    {isLoading ? 'Loading...' : 'No copies found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex items-center justify-between mt-6 px-4 py-3 border-t border-gray-200">
          <div className="flex-1 flex sm:justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-3 py-2 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = Math.min(Math.max(currentPage - 2, 1) + i, totalPages);
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-3 py-2 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Copies;


