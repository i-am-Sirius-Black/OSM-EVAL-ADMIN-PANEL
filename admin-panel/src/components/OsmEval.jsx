

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSync, FaFilePdf } from 'react-icons/fa';

// function OsmEval() {
//     const [scans, setScans] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [lastUpdated, setLastUpdated] = useState(null);
//     const [selectedPdf, setSelectedPdf] = useState(null);
//     const [searchCopyBarcode, setSearchCopyBarcode] = useState('');
//     const [sortOrder, setSortOrder] = useState('desc'); // Default to descending
//     const [loading, setLoading] = useState(true);
  
//     const fetchScans = (page = 1) => {
//       setLoading(true);
//       axios
//         .get(`http://localhost:5000/api/scanning?page=${page}&limit=20`)
//         .then((res) => {
//           let data = res.data.data;
//           // Sort data by scannedAt
//           data.sort((a, b) => {
//             const dateA = new Date(a.scannedAt);
//             const dateB = new Date(b.scannedAt);
//             return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
//           });
//           // Filter by copy_barcode if search is active
//           if (searchCopyBarcode) {
//             data = data.filter((scan) =>
//               scan.copy_barcode.toLowerCase().includes(searchCopyBarcode.toLowerCase())
//             );
//           }
//           setScans(data);
//           setTotalPages(res.data.totalPages);
//           setCurrentPage(res.data.currentPage);
//           setLastUpdated(new Date().toLocaleTimeString());
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     };
  
//     useEffect(() => {
//       fetchScans();
//     }, [sortOrder]); // Re-fetch when sort order changes
  
//     const handleSearch = () => {
//       setCurrentPage(1); // Reset to first page on search
//       fetchScans(1);
//     };
  
//     const handleSortChange = (e) => {
//       setSortOrder(e.target.value);
//     };
  
//     const handleViewPdf = (sno) => {
//       // Assuming this function sets the PDF URL or data
//       setSelectedPdf(`http://localhost:5000/api/scanning/pdf/${sno}`);
//     };
  
//     // Loading skeleton component for table rows
//     const TableSkeleton = () => (
//       <>
//         {[...Array(5)].map((_, index) => (
//           <tr key={index} className="border-b animate-pulse">
//             <td className="p-4">
//               <div className="h-4 bg-gray-200 rounded w-16"></div>
//             </td>
//             <td className="p-4">
//               <div className="h-4 bg-gray-200 rounded w-40"></div>
//             </td>
//             <td className="p-4">
//               <div className="h-4 bg-gray-200 rounded w-24"></div>
//             </td>
//             <td className="p-4">
//               <div className="h-5 bg-gray-200 rounded w-5 mx-auto"></div>
//             </td>
//           </tr>
//         ))}
//       </>
//     );
  
//     return (
//       <div className="min-h-screen">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">OSM Evaluation</h2>
//           {lastUpdated && (
//             <span className="text-sm text-gray-600">
//               Last Refreshed: {lastUpdated}
//             </span>
//           )}
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//             <h3 className="text-xl font-semibold text-gray-700">Scan Records</h3>
//             <div className="flex items-center space-x-4">
//               <input
//                 type="text"
//                 placeholder="Search by Copy Barcode"
//                 value={searchCopyBarcode}
//                 onChange={(e) => setSearchCopyBarcode(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//               />
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Search
//               </button>
//               <select
//                 value={sortOrder}
//                 onChange={handleSortChange}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="desc">Scanned At (Newest First)</option>
//                 <option value="asc">Scanned At (Oldest First)</option>
//               </select>
//               <button
//                 onClick={() => fetchScans(currentPage)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaSync className="mr-2" /> Refresh
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-gray-100 text-gray-600">
//                   <th className="p-4 font-semibold">Scan ID</th>
//                   <th className="p-4 font-semibold">Scanned At</th>
//                   <th className="p-4 font-semibold">Copy Barcode</th>
//                   <th className="p-4 font-semibold">PDF</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <TableSkeleton />
//                 ) : (
//                   scans.map((scan) => (
//                     <tr key={scan.sno} className="border-b hover:bg-gray-50 transition-colors">
//                       <td className="p-4 text-gray-800">{scan.ScanId}</td>
//                       <td className="p-4 text-gray-800">{new Date(scan.scannedAt).toLocaleString()}</td>
//                       <td className="p-4 text-gray-800">{scan.copy_barcode}</td>
//                       <td className="p-4">
//                         <button
//                           onClick={() => handleViewPdf(scan.sno)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           <FaFilePdf size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="flex justify-between items-center mt-4">
//             <button
//               onClick={() => fetchScans(currentPage - 1)}
//               disabled={currentPage === 1 || loading}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() => fetchScans(currentPage + 1)}
//               disabled={currentPage === totalPages || loading}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
  
//         {/* Improved Full-Screen PDF Viewer Modal */}
//         {selectedPdf && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overflow-hidden">
//             <div className="bg-white w-full h-full flex flex-col max-h-screen">
//               {/* PDF Content */}
//               <div className="flex-grow overflow-hidden bg-gray-800">
//                 <iframe
//                   src={selectedPdf}
//                   className="w-full h-full border-0"
//                   title="PDF Viewer"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   export default OsmEval;





import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSync, FaFilePdf } from 'react-icons/fa';

// function OsmEval() {
//     const [scans, setScans] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [lastUpdated, setLastUpdated] = useState(null);
//     const [selectedPdf, setSelectedPdf] = useState(null);
//     const [searchCopyBarcode, setSearchCopyBarcode] = useState('');
//     const [sortOrder, setSortOrder] = useState('desc'); // Default to descending
//     const [loading, setLoading] = useState(true);
  
//     const fetchScans = (page = 1) => {
//       setLoading(true);
//       axios
//         .get(`http://localhost:5000/api/scanning?page=${page}&limit=20`)
//         .then((res) => {
//           let data = res.data.data;
//           // Sort data by scannedAt
//           data.sort((a, b) => {
//             const dateA = new Date(a.scannedAt);
//             const dateB = new Date(b.scannedAt);
//             return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
//           });
//           // Filter by copy_barcode if search is active
//           if (searchCopyBarcode) {
//             data = data.filter((scan) =>
//               scan.copy_barcode.toLowerCase().includes(searchCopyBarcode.toLowerCase())
//             );
//           }
//           setScans(data);
//           setTotalPages(res.data.totalPages);
//           setCurrentPage(res.data.currentPage);
//           setLastUpdated(new Date().toLocaleTimeString());
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     };
  
//     useEffect(() => {
//       fetchScans();
//     }, [sortOrder]); // Re-fetch when sort order changes
  
//     const handleSearch = () => {
//       setCurrentPage(1); // Reset to first page on search
//       fetchScans(1);
//     };
  
//     const handleSortChange = (e) => {
//       setSortOrder(e.target.value);
//     };
  
//     const handleViewPdf = (sno) => {
//       // Assuming this function sets the PDF URL or data
//       setSelectedPdf(`http://localhost:5000/api/scanning/pdf/${sno}`);
//     };
  
//     // Loading skeleton component for table rows
//     const TableSkeleton = () => (
//       <>
//         {[...Array(5)].map((_, index) => (
//           <tr key={index} className="border-b animate-pulse">
//             <td className="p-4">
//               <div className="h-4 bg-gray-200 rounded w-16"></div>
//             </td>
//             <td className="p-4">
//               <div className="h-4 bg-gray-200 rounded w-40"></div>
//             </td>
//             <td className="p-4">
//               <div className="h-4 bg-gray-200 rounded w-24"></div>
//             </td>
//             <td className="p-4">
//               <div className="h-5 bg-gray-200 rounded w-5 mx-auto"></div>
//             </td>
//           </tr>
//         ))}
//       </>
//     );
  
//     return (
//       <div className="min-h-screen">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-3xl font-bold text-gray-800">OSM Evaluation</h2>
//           {lastUpdated && (
//             <span className="text-sm text-gray-600">
//               Last Refreshed: {lastUpdated}
//             </span>
//           )}
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-lg">
//           <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
//             <h3 className="text-xl font-semibold text-gray-700">Scan Records</h3>
//             <div className="flex items-center space-x-4">
//               <input
//                 type="text"
//                 placeholder="Search by Copy Barcode"
//                 value={searchCopyBarcode}
//                 onChange={(e) => setSearchCopyBarcode(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//               />
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 Search
//               </button>
//               <select
//                 value={sortOrder}
//                 onChange={handleSortChange}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="desc">Scanned At (Newest First)</option>
//                 <option value="asc">Scanned At (Oldest First)</option>
//               </select>
//               <button
//                 onClick={() => fetchScans(currentPage)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaSync className="mr-2" /> Refresh
//               </button>
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-gray-100 text-gray-600">
//                   <th className="p-4 font-semibold">Scan ID</th>
//                   <th className="p-4 font-semibold">Scanned At</th>
//                   <th className="p-4 font-semibold">Copy Barcode</th>
//                   <th className="p-4 font-semibold">PDF</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <TableSkeleton />
//                 ) : (
//                   scans.map((scan) => (
//                     <tr key={scan.sno} className="border-b hover:bg-gray-50 transition-colors">
//                       <td className="p-4 text-gray-800">{scan.ScanId}</td>
//                       <td className="p-4 text-gray-800">{new Date(scan.scannedAt).toLocaleString()}</td>
//                       <td className="p-4 text-gray-800">{scan.copy_barcode}</td>
//                       <td className="p-4">
//                         <button
//                           onClick={() => handleViewPdf(scan.sno)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           <FaFilePdf size={20} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//           <div className="flex justify-between items-center mt-4">
//             <button
//               onClick={() => fetchScans(currentPage - 1)}
//               disabled={currentPage === 1 || loading}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="text-gray-700">
//               Page {currentPage} of {totalPages}
//             </span>
//             <button
//               onClick={() => fetchScans(currentPage + 1)}
//               disabled={currentPage === totalPages || loading}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
  
//         {/* Improved Full-Screen PDF Viewer Modal */}
//         {selectedPdf && (
//           <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center overflow-hidden">
//             <div className="bg-white w-full h-full flex flex-col max-h-screen">
//               {/* Modal Header */}
//               <div className="flex justify-between items-center px-6 py-3 bg-gray-100 border-b">
//                 <h3 className="text-lg font-semibold text-gray-800">PDF Document Viewer</h3>
//                 <div className="flex items-center space-x-4">
//                   {/* Download button */}
//                   <a 
//                     href={selectedPdf} 
//                     download 
//                     className="flex items-center text-blue-600 hover:text-blue-800"
//                   >
//                     <FaDownload className="mr-1" /> Download
//                   </a>
//                   {/* Close button */}
//                   <button
//                     onClick={() => setSelectedPdf(null)}
//                     className="flex items-center text-gray-700 hover:text-gray-900 bg-gray-200 hover:bg-gray-300 rounded-full p-2 transition"
//                   >
//                     <FaTimes size={20} />
//                   </button>
//                 </div>
//               </div>
              
//               {/* PDF Content */}
//               <div className="flex-grow overflow-hidden bg-gray-800">
//                 <iframe
//                   src={selectedPdf}
//                   className="w-full h-full border-0"
//                   title="PDF Viewer"
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
  
//   export default OsmEval;


const BaseURL = import.meta.env.VITE_API_URL;

function OsmEval() {
    const [scans, setScans] = useState([]);
    const [originalData, setOriginalData] = useState([]); // Store the unfiltered data
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [searchCopyBarcode, setSearchCopyBarcode] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default to descending
    const [loading, setLoading] = useState(true);
  
    const fetchScans = (page = 1) => {
      setLoading(true);
      axios
        .get(`${BaseURL}/scanning?page=${page}&limit=20`)
        .then((res) => {
          const fetchedData = res.data.data;
          setOriginalData(fetchedData); // Save original unfiltered data
          
          // Apply initial sort
          const sortedData = sortData(fetchedData, sortOrder);
          setScans(sortedData);
          
          setTotalPages(res.data.totalPages);
          setCurrentPage(res.data.currentPage);
          setLastUpdated(new Date().toLocaleTimeString());
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };
  
    // Function to sort data
    const sortData = (data, order) => {
      return [...data].sort((a, b) => {
        const dateA = new Date(a.scannedAt);
        const dateB = new Date(b.scannedAt);
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    };
  
    // Function to filter data
    const filterData = (data, searchTerm) => {
      if (!searchTerm) return data;
      
      return data.filter((scan) => 
        scan.copy_barcode && scan.copy_barcode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };
  
    // Apply both sorting and filtering
    const applyFiltersAndSort = () => {
      const filteredData = filterData(originalData, searchCopyBarcode);
      const sortedAndFilteredData = sortData(filteredData, sortOrder);
      setScans(sortedAndFilteredData);
    };
  
    useEffect(() => {
      fetchScans();
    }, []); // Only fetch on component mount
  
    // Re-apply sorting when sort order changes
    useEffect(() => {
      if (originalData.length > 0) {
        applyFiltersAndSort();
      }
    }, [sortOrder]);
  
    const handleSearch = () => {
      applyFiltersAndSort();
    };
  
    const handleSearchInputChange = (e) => {
      setSearchCopyBarcode(e.target.value);
    };
  
    const handleSortChange = (e) => {
      setSortOrder(e.target.value);
    };
  
    const handleViewPdf = (sno) => {
      // Open PDF in a new tab
      const pdfUrl = `${BaseURL}/scanning/pdf/${sno}`;
      window.open(pdfUrl, '_blank');
    };
  
    const refreshData = () => {
      fetchScans(currentPage);
    };
  
    // Loading skeleton component for table rows
    const TableSkeleton = () => (
      <>
        {[...Array(5)].map((_, index) => (
          <tr key={index} className="border-b animate-pulse">
            <td className="p-4">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </td>
            <td className="p-4">
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </td>
            <td className="p-4">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </td>
            <td className="p-4">
              <div className="h-5 bg-gray-200 rounded w-5 mx-auto"></div>
            </td>
          </tr>
        ))}
      </>
    );
  
    return (
      <div className="min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">OSM Evaluation</h2>
          {lastUpdated && (
            <span className="text-sm text-gray-600">
              Last Refreshed: {lastUpdated}
            </span>
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-xl font-semibold text-gray-700">Scan Records</h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search by Copy Barcode"
                  value={searchCopyBarcode}
                  onChange={handleSearchInputChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
                <button
                  onClick={handleSearch}
                  className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Scanned At (Newest First)</option>
                <option value="asc">Scanned At (Oldest First)</option>
              </select>
              <button
                onClick={refreshData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 text-gray-600">
                  <th className="p-4 font-semibold">Scan ID</th>
                  <th className="p-4 font-semibold">Scanned At</th>
                  <th className="p-4 font-semibold">Copy Barcode</th>
                  <th className="p-4 font-semibold">PDF</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : scans.length > 0 ? (
                  scans.map((scan) => (
                    <tr key={scan.sno} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-800">{scan.ScanId}</td>
                      <td className="p-4 text-gray-800">{new Date(scan.scannedAt).toLocaleString()}</td>
                      <td className="p-4 text-gray-800">{scan.copy_barcode}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleViewPdf(scan.sno)}
                        //   className="text-blue-600 hover:text-blue-800"
                        className="
                        p-2 
                        text-blue-500 
                        hover:text-blue-700 
                        hover:bg-red-50 
                        rounded-full 
                        transition-all 
                        duration-200 
                        transform-gpu     
                        hover:scale-[1.05] 
                        hover:-translate-y-px
                        active:translate-y-0 
                    "
                          title="Open PDF in new tab"
                        >
                          <FaFilePdf size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No records found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => fetchScans(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchScans(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default OsmEval;