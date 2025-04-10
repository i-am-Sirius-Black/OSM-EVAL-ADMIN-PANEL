// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSync, FaSearch } from 'react-icons/fa';
// import { EditIconButton, DeleteIconButton } from './Button';
// import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

// const BaseURL = import.meta.env.VITE_API_URL;


// function Database() {
//   // Separate states for each table
//   const [baggingData, setBaggingData] = useState([]);
//   const [gunningData, setGunningData] = useState([]);
  
//   const [selectedTable, setSelectedTable] = useState('tbl_bagging');
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({});
  
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [baggingFilter, setBaggingFilter] = useState('all');
//   const [gunningFilter, setGunningFilter] = useState('all');
  
//   // Separate pagination states
//   const [baggingPagination, setBaggingPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [gunningPagination, setGunningPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [lastUpdated, setLastUpdated] = useState(null);


//   // Helper to get current data based on selected table
//   const getCurrentData = () => {
//     return selectedTable === 'tbl_bagging' ? baggingData : gunningData;
//   };

//   // Helper to get current pagination based on selected table
//   const getCurrentPagination = () => {
//     return selectedTable === 'tbl_bagging' ? baggingPagination : gunningPagination;
//   };

//   // Get bagging status text and style
//   const getBaggingStatus = (item) => {
//     if (item.IsScanned && item.IsUploaded) {
//       return { text: 'Processed', style: 'bg-green-100 text-green-800' };
//     } else if (item.IsScanned && !item.IsUploaded) {
//       return { text: 'Processing', style: 'bg-blue-100 text-blue-800' };
//     } else {
//       return { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
//     }
//   };

//   // Get gunning status text and style
//   const getGunningStatus = (item) => {
//     return item.IsScanned 
//       ? { text: 'Scanned', style: 'bg-green-100 text-green-800' }
//       : { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
//   };

//   // Separate fetch functions for each table
//   const fetchBaggingData = (page = 1, search = '', filter = 'all') => {
//     const limit = 10;
//     let url = `${BaseURL}/bagging?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       if (filter === 'Processed') {
//         url += '&isScanned=true&isUploaded=true';
//       } else if (filter === 'Processing') {
//         url += '&isScanned=true&isUploaded=false';
//       } else if (filter === 'Not Scanned') {
//         url += '&isScanned=false';
//       }
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setBaggingData(res.data.data || []);
//         setBaggingPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setBaggingData([]);
//       });
//   };

//   const fetchGunningData = (page = 1, search = '', filter = 'all') => {
//     const limit = 20;
//     let url = `${BaseURL}/gunning?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       url += `&isScanned=${filter === 'Scanned'}`;
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setGunningData(res.data.data || []);
//         setGunningPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setGunningData([]);
//       });
//   };

//   // Fetch data based on selected table
//   const fetchData = (page = 1) => {
//     if (selectedTable === 'tbl_bagging') {
//       fetchBaggingData(page, searchTerm, baggingFilter);
//     } else {
//       fetchGunningData(page, searchTerm, gunningFilter);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable]);

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setFormData(item);
//   };

//   const handleSave = () => {
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingData(baggingData.map(d => 
//         d.BagID === editItem.BagID ? formData : d
//       ));
//     } else {
//       setGunningData(gunningData.map(d => 
//         d.CopyBarcode === editItem.CopyBarcode ? formData : d
//       ));
//     }
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       if (selectedTable === 'tbl_bagging') {
//         setBaggingData(baggingData.filter(item => item.BagID !== id));
//       } else {
//         setGunningData(gunningData.filter(item => item.CopyBarcode !== id));
//       }
//     }
//   };

//   const handleSearch = () => {
//     // Reset to first page when searching
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchBaggingData(1, searchTerm, baggingFilter);
//     } else {
//       setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchGunningData(1, searchTerm, gunningFilter);
//     }
//   };

//   const handleBaggingFilterChange = (newFilter) => {
//     setBaggingFilter(newFilter);
//     setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchBaggingData(1, searchTerm, newFilter);
//   };

//   const handleGunningFilterChange = (newFilter) => {
//     setGunningFilter(newFilter);
//     setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchGunningData(1, searchTerm, newFilter);
//   };

//   const getRowKey = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? `bagging-${item.BagID}` 
//       : `gunning-${item.CopyBarcode}`;
//   };

//   const getDeleteId = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? item.BagID 
//       : item.CopyBarcode;
//   };

//   // Get current data and pagination for rendering
//   const currentData = getCurrentData();
//   const { currentPage, totalPages } = getCurrentPagination();

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//           <div className="flex items-center space-x-4">
//             <label className="text-gray-700 font-semibold">Select Table:</label>
//             <select
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="tbl_bagging">Bagging</option>
//               <option value="tbl_gunning">Gunning</option>
//             </select>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             <div className="relative flex-grow">
//               <input
//                 type="text"
//                 placeholder={
//                   selectedTable === 'tbl_bagging' 
//                     ? 'Search by BagID...' 
//                     : 'Search by Barcode or BagID...'
//                 }
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
            
//             {selectedTable === 'tbl_bagging' ? (
//               <select
//                 value={baggingFilter}
//                 onChange={(e) => handleBaggingFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Processed">Processed</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             ) : (
//               <select
//                 value={gunningFilter}
//                 onChange={(e) => handleGunningFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Scanned">Scanned</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             )}
            
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
//               >
//                 <FaSearch className="mr-2" /> Search
//               </button>
//               <button
//                 onClick={() => fetchData(currentPage)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaSync className="mr-2" /> Refresh
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((item) => {
//                 const itemStatus = selectedTable === 'tbl_bagging' 
//                   ? getBaggingStatus(item) 
//                   : getGunningStatus(item);
                
//                 return (
//                   <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
//                     <td className="p-4 text-gray-800">
//                       <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${itemStatus.style}`}>
//                         {itemStatus.text}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex space-x-1">
//                         <EditIconButton onClick={() => handleEdit(item)} />
//                         <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => {
//               const newPage = currentPage - 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => {
//               const newPage = currentPage + 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
//             <form className="space-y-4">
//               {Object.keys(editItem).map((key) => (
//                 <div key={key}>
//                   <label className="block text-gray-600 font-medium">{key}</label>
//                   <input
//                     type="text"
//                     value={formData[key] || ''}
//                     onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setEditItem(null)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Database;



//? below one is collapsable ui for json data


// import { useState, useEffect } from 'react';
// import { FaSearch, FaSync, FaChevronDown, FaChevronRight } from 'react-icons/fa';
// import axios from 'axios';
// import { DeleteIconButton, EditIconButton } from './Button';


// const BaseURL = import.meta.env.VITE_API_URL;



// // New collapsible JSON component
// function CollapsibleJSON({ data }) {
//   const [isExpanded, setIsExpanded] = useState(false);
  
//   // Create a simplified one-line preview
//   const getPreview = (data) => {
//     if (typeof data !== 'object' || data === null) {
//       return String(data);
//     }
    
//     // For Bagging records, show BagID
//     if (data.BagID) {
//       return `BagID: ${data.BagID}`;
//     }
    
//     // For Gunning records, show CopyBarcode
//     if (data.CopyBarcode) {
//       return `Barcode: ${data.CopyBarcode}`;
//     }
    
//     // Generic fallback
//     const keys = Object.keys(data);
//     if (keys.length === 0) return '{}';
    
//     const firstKey = keys[0];
//     return `${firstKey}: ${data[firstKey]}, ... (${keys.length} fields)`;
//   };

//   return (
//     <div className="text-sm font-mono">
//       <div 
//         className="flex items-start cursor-pointer hover:bg-gray-100 p-1 rounded"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <span className="mr-2 mt-1 text-gray-500">
//           {isExpanded ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
//         </span>
//         {isExpanded ? (
//           <pre className="whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
//         ) : (
//           <div className="truncate max-w-xs lg:max-w-md xl:max-w-lg">
//             {getPreview(data)}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function Database() {
//   // Separate states for each table
//   const [baggingData, setBaggingData] = useState([]);
//   const [gunningData, setGunningData] = useState([]);
  
//   const [selectedTable, setSelectedTable] = useState('tbl_bagging');
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({});
  
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [baggingFilter, setBaggingFilter] = useState('all');
//   const [gunningFilter, setGunningFilter] = useState('all');
  
//   // Separate pagination states
//   const [baggingPagination, setBaggingPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [gunningPagination, setGunningPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [lastUpdated, setLastUpdated] = useState(null);


//   // Helper to get current data based on selected table
//   const getCurrentData = () => {
//     return selectedTable === 'tbl_bagging' ? baggingData : gunningData;
//   };

//   // Helper to get current pagination based on selected table
//   const getCurrentPagination = () => {
//     return selectedTable === 'tbl_bagging' ? baggingPagination : gunningPagination;
//   };

//   // Get bagging status text and style
//   const getBaggingStatus = (item) => {
//     if (item.IsScanned && item.IsUploaded) {
//       return { text: 'Processed', style: 'bg-green-100 text-green-800' };
//     } else if (item.IsScanned && !item.IsUploaded) {
//       return { text: 'Processing', style: 'bg-blue-100 text-blue-800' };
//     } else {
//       return { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
//     }
//   };

//   // Get gunning status text and style
//   const getGunningStatus = (item) => {
//     return item.IsScanned 
//       ? { text: 'Scanned', style: 'bg-green-100 text-green-800' }
//       : { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
//   };

//   // Separate fetch functions for each table
//   const fetchBaggingData = (page = 1, search = '', filter = 'all') => {
//     const limit = 10;
//     let url = `${BaseURL}/bagging?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       if (filter === 'Processed') {
//         url += '&isScanned=true&isUploaded=true';
//       } else if (filter === 'Processing') {
//         url += '&isScanned=true&isUploaded=false';
//       } else if (filter === 'Not Scanned') {
//         url += '&isScanned=false';
//       }
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setBaggingData(res.data.data || []);
//         setBaggingPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setBaggingData([]);
//       });
//   };

//   const fetchGunningData = (page = 1, search = '', filter = 'all') => {
//     const limit = 20;
//     let url = `${BaseURL}/gunning?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       url += `&isScanned=${filter === 'Scanned'}`;
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setGunningData(res.data.data || []);
//         setGunningPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setGunningData([]);
//       });
//   };

//   // Fetch data based on selected table
//   const fetchData = (page = 1) => {
//     if (selectedTable === 'tbl_bagging') {
//       fetchBaggingData(page, searchTerm, baggingFilter);
//     } else {
//       fetchGunningData(page, searchTerm, gunningFilter);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable]);

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setFormData(item);
//   };

//   const handleSave = () => {
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingData(baggingData.map(d => 
//         d.BagID === editItem.BagID ? formData : d
//       ));
//     } else {
//       setGunningData(gunningData.map(d => 
//         d.CopyBarcode === editItem.CopyBarcode ? formData : d
//       ));
//     }
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       if (selectedTable === 'tbl_bagging') {
//         setBaggingData(baggingData.filter(item => item.BagID !== id));
//       } else {
//         setGunningData(gunningData.filter(item => item.CopyBarcode !== id));
//       }
//     }
//   };

//   const handleSearch = () => {
//     // Reset to first page when searching
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchBaggingData(1, searchTerm, baggingFilter);
//     } else {
//       setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchGunningData(1, searchTerm, gunningFilter);
//     }
//   };

//   const handleBaggingFilterChange = (newFilter) => {
//     setBaggingFilter(newFilter);
//     setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchBaggingData(1, searchTerm, newFilter);
//   };

//   const handleGunningFilterChange = (newFilter) => {
//     setGunningFilter(newFilter);
//     setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchGunningData(1, searchTerm, newFilter);
//   };

//   const getRowKey = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? `bagging-${item.BagID}` 
//       : `gunning-${item.CopyBarcode}`;
//   };

//   const getDeleteId = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? item.BagID 
//       : item.CopyBarcode;
//   };

//   // Get current data and pagination for rendering
//   const currentData = getCurrentData();
//   const { currentPage, totalPages } = getCurrentPagination();

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//           <div className="flex items-center space-x-4">
//             <label className="text-gray-700 font-semibold">Select Table:</label>
//             <select
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="tbl_bagging">Bagging</option>
//               <option value="tbl_gunning">Gunning</option>
//             </select>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             <div className="relative flex-grow">
//               <input
//                 type="text"
//                 placeholder={
//                   selectedTable === 'tbl_bagging' 
//                     ? 'Search by BagID...' 
//                     : 'Search by Barcode or BagID...'
//                 }
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
            
//             {selectedTable === 'tbl_bagging' ? (
//               <select
//                 value={baggingFilter}
//                 onChange={(e) => handleBaggingFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Processed">Processed</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             ) : (
//               <select
//                 value={gunningFilter}
//                 onChange={(e) => handleGunningFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Scanned">Scanned</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             )}
            
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
//               >
//                 <FaSearch className="mr-2" /> Search
//               </button>
//               <button
//                 onClick={() => fetchData(currentPage)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaSync className="mr-2" /> Refresh
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((item) => {
//                 const itemStatus = selectedTable === 'tbl_bagging' 
//                   ? getBaggingStatus(item) 
//                   : getGunningStatus(item);
                
//                 return (
//                   <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
//                     <td className="p-4 text-gray-800">
//                       {/* Replaced JSON display with CollapsibleJSON component */}
//                       <CollapsibleJSON data={item} />
//                     </td>
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${itemStatus.style}`}>
//                         {itemStatus.text}
//                       </span>
//                     </td>
//                     <td className="p-4">
//                       <div className="flex space-x-1">
//                         <EditIconButton onClick={() => handleEdit(item)} />
//                         <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => {
//               const newPage = currentPage - 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => {
//               const newPage = currentPage + 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
//             <form className="space-y-4">
//               {Object.keys(editItem).map((key) => (
//                 <div key={key}>
//                   <label className="block text-gray-600 font-medium">{key}</label>
//                   <input
//                     type="text"
//                     value={formData[key] || ''}
//                     onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setEditItem(null)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Database;


//? collapsable ui for json data part2.....


// import { useState, useEffect } from 'react';
// import { FaSearch, FaSync, FaChevronDown, FaChevronRight } from 'react-icons/fa';
// import axios from 'axios';
// import { DeleteIconButton, EditIconButton } from './Button';


// const BaseURL = import.meta.env.VITE_API_URL;




// // Enhanced collapsible JSON component with better UI
// function CollapsibleJSON({ data, tableName }) {
//     const [isExpanded, setIsExpanded] = useState(false);
    
//     // Create a better preview based on table type
//     const getPreview = (data, tableName) => {
//       if (typeof data !== 'object' || data === null) {
//         return String(data);
//       }
      
//       // Different preview based on table type
//       if (tableName === 'tbl_bagging' && data.BagID) {
//         const status = data.IsScanned && data.IsUploaded 
//           ? 'Processed' 
//           : data.IsScanned && !data.IsUploaded 
//             ? 'Processing' 
//             : 'Not Scanned';
            
//         return (
//           <div className="flex items-center">
//             <span className="font-semibold text-gray-800">BagID: </span>
//             <span className="ml-1 text-blue-600">{data.BagID}</span>
//             {data.CreatedAt && (
//               <span className="ml-3 text-gray-500 text-xs">
//                 Created: {new Date(data.CreatedAt).toLocaleDateString()}
//               </span>
//             )}
//           </div>
//         );
//       }
      
//       // For Gunning records
//       if (tableName === 'tbl_gunning' && data.CopyBarcode) {
//         return (
//           <div className="flex items-center">
//             <span className="font-semibold text-gray-800">Copy Barcode: </span>
//             <span className="ml-1 text-blue-600">{data.CopyBarcode}</span>
//             {data.BagID && (
//               <span className="ml-3">
//                 <span className="text-gray-600">Bag: </span>
//                 <span className="text-gray-800">{data.BagID}</span>
//               </span>
//             )}
//           </div>
//         );
//       }
      
//       // Generic fallback
//       const keys = Object.keys(data);
//       if (keys.length === 0) return '{}';
      
//       const firstKey = keys[0];
//       return `${firstKey}: ${data[firstKey]}, ... (${keys.length} fields)`;
//     };
  
//     return (
//       <div className="font-sans">
//         <div 
//           className={`rounded-md transition-all duration-200 ${isExpanded ? 'bg-gray-50 shadow-sm' : 'hover:bg-gray-50'}`}
//         >
//           <div 
//             className="flex items-center cursor-pointer p-2 rounded-md"
//             onClick={() => setIsExpanded(!isExpanded)}
//           >
//             <span className={`mr-2 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}>
//               <FaChevronRight size={14} />
//             </span>
//             <div className="flex-grow">
//               {getPreview(data, tableName)}
//             </div>
//           </div>
          
//           {isExpanded && (
//             <div className="pl-8 pr-4 pb-3 pt-1">
//               <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
//                 <div className="grid gap-2">
//                   {Object.entries(data).map(([key, value]) => (
//                     <div key={key} className="grid grid-cols-12 gap-2 items-start">
//                       <span className="col-span-3 text-sm font-medium text-gray-600">{key}:</span>
//                       <span className="col-span-9 text-sm text-gray-800 break-all">
//                         {typeof value === 'object' && value !== null 
//                           ? JSON.stringify(value) 
//                           : String(value)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

  
// function Database() {
//   // Separate states for each table
//   const [baggingData, setBaggingData] = useState([]);
//   const [gunningData, setGunningData] = useState([]);
  
//   const [selectedTable, setSelectedTable] = useState('tbl_bagging');
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({});
  
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [baggingFilter, setBaggingFilter] = useState('all');
//   const [gunningFilter, setGunningFilter] = useState('all');
  
//   // Separate pagination states
//   const [baggingPagination, setBaggingPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [gunningPagination, setGunningPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [lastUpdated, setLastUpdated] = useState(null);


//   // Helper to get current data based on selected table
//   const getCurrentData = () => {
//     return selectedTable === 'tbl_bagging' ? baggingData : gunningData;
//   };

//   // Helper to get current pagination based on selected table
//   const getCurrentPagination = () => {
//     return selectedTable === 'tbl_bagging' ? baggingPagination : gunningPagination;
//   };

//   // Get bagging status text and style
//   const getBaggingStatus = (item) => {
//     if (item.IsScanned && item.IsUploaded) {
//       return { text: 'Processed', style: 'bg-green-100 text-green-800' };
//     } else if (item.IsScanned && !item.IsUploaded) {
//       return { text: 'Processing', style: 'bg-blue-100 text-blue-800' };
//     } else {
//       return { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
//     }
//   };

//   // Get gunning status text and style
//   const getGunningStatus = (item) => {
//     return item.IsScanned 
//       ? { text: 'Scanned', style: 'bg-green-100 text-green-800' }
//       : { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
//   };

//   // Separate fetch functions for each table
//   const fetchBaggingData = (page = 1, search = '', filter = 'all') => {
//     const limit = 10;
//     let url = `${BaseURL}/bagging?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       if (filter === 'Processed') {
//         url += '&isScanned=true&isUploaded=true';
//       } else if (filter === 'Processing') {
//         url += '&isScanned=true&isUploaded=false';
//       } else if (filter === 'Not Scanned') {
//         url += '&isScanned=false';
//       }
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setBaggingData(res.data.data || []);
//         setBaggingPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setBaggingData([]);
//       });
//   };

//   const fetchGunningData = (page = 1, search = '', filter = 'all') => {
//     const limit = 20;
//     let url = `${BaseURL}/gunning?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       url += `&isScanned=${filter === 'Scanned'}`;
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setGunningData(res.data.data || []);
//         setGunningPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setGunningData([]);
//       });
//   };

//   // Fetch data based on selected table
//   const fetchData = (page = 1) => {
//     if (selectedTable === 'tbl_bagging') {
//       fetchBaggingData(page, searchTerm, baggingFilter);
//     } else {
//       fetchGunningData(page, searchTerm, gunningFilter);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable]);

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setFormData(item);
//   };

//   const handleSave = () => {
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingData(baggingData.map(d => 
//         d.BagID === editItem.BagID ? formData : d
//       ));
//     } else {
//       setGunningData(gunningData.map(d => 
//         d.CopyBarcode === editItem.CopyBarcode ? formData : d
//       ));
//     }
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       if (selectedTable === 'tbl_bagging') {
//         setBaggingData(baggingData.filter(item => item.BagID !== id));
//       } else {
//         setGunningData(gunningData.filter(item => item.CopyBarcode !== id));
//       }
//     }
//   };

//   const handleSearch = () => {
//     // Reset to first page when searching
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchBaggingData(1, searchTerm, baggingFilter);
//     } else {
//       setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchGunningData(1, searchTerm, gunningFilter);
//     }
//   };

//   const handleBaggingFilterChange = (newFilter) => {
//     setBaggingFilter(newFilter);
//     setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchBaggingData(1, searchTerm, newFilter);
//   };

//   const handleGunningFilterChange = (newFilter) => {
//     setGunningFilter(newFilter);
//     setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchGunningData(1, searchTerm, newFilter);
//   };

//   const getRowKey = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? `bagging-${item.BagID}` 
//       : `gunning-${item.CopyBarcode}`;
//   };

//   const getDeleteId = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? item.BagID 
//       : item.CopyBarcode;
//   };

//   // Get current data and pagination for rendering
//   const currentData = getCurrentData();
//   const { currentPage, totalPages } = getCurrentPagination();

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-4 rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//           <div className="flex items-center space-x-4">
//             <label className="text-gray-700 font-semibold">Select Table:</label>
//             <select
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="tbl_bagging">Bagging</option>
//               <option value="tbl_gunning">Gunning</option>
//             </select>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             <div className="relative flex-grow">
//               <input
//                 type="text"
//                 placeholder={
//                   selectedTable === 'tbl_bagging' 
//                     ? 'Search by BagID...' 
//                     : 'Search by Barcode or BagID...'
//                 }
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
            
//             {selectedTable === 'tbl_bagging' ? (
//               <select
//                 value={baggingFilter}
//                 onChange={(e) => handleBaggingFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Processed">Processed</option>
//                 <option value="Processing">Processing</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             ) : (
//               <select
//                 value={gunningFilter}
//                 onChange={(e) => handleGunningFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Scanned">Scanned</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             )}
            
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
//               >
//                 <FaSearch className="mr-2" /> Search
//               </button>
//               <button
//                 onClick={() => fetchData(currentPage)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaSync className="mr-2" /> Refresh
//               </button>
//             </div>
//           </div>
//         </div>
        
//        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold ">Details</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.length > 0 ? (
//                 currentData.map((item) => {
//                   const itemStatus = selectedTable === 'tbl_bagging' 
//                     ? getBaggingStatus(item) 
//                     : getGunningStatus(item);
                  
//                   return (
//                     <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
//                       <td className="p-4 text-gray-800">
//                         {/* Updated CollapsibleJSON with tableName prop */}
//                         <CollapsibleJSON data={item} tableName={selectedTable} />
//                       </td>
//                       <td className="p-4">
//                         <span className={`px-3 py-1 rounded-full text-sm font-medium ${itemStatus.style}`}>
//                           {itemStatus.text}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex space-x-1">
//                           <EditIconButton onClick={() => handleEdit(item)} />
//                           <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="p-8 text-center text-gray-500">
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>




        
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => {
//               const newPage = currentPage - 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => {
//               const newPage = currentPage + 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
//             <form className="space-y-4">
//               {Object.keys(editItem).map((key) => (
//                 <div key={key}>
//                   <label className="block text-gray-600 font-medium">{key}</label>
//                   <input
//                     type="text"
//                     value={formData[key] || ''}
//                     onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setEditItem(null)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Database;


//? version with client side search filter

import { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaSync, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import { DeleteIconButton, EditIconButton } from './Button';

const BaseURL = import.meta.env.VITE_API_URL;

// Enhanced collapsible JSON component with better UI
function CollapsibleJSON({ data, tableName }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getPreview = (data, tableName) => {
    if (typeof data !== 'object' || data === null) {
      return String(data);
    }
    
    if (tableName === 'tbl_bagging' && data.BagID) {
      const status = data.IsScanned && data.IsUploaded 
        ? 'Processed' 
        : data.IsScanned && !data.IsUploaded 
          ? 'Processing' 
          : 'Not Scanned';
          
      return (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800">BagID: </span>
          <span className="ml-1 text-blue-600">{data.BagID}</span>
          {data.CreatedAt && (
            <span className="ml-3 text-gray-500 text-xs">
              Created: {new Date(data.CreatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      );
    }
    
    if (tableName === 'tbl_gunning' && data.CopyBarcode) {
      return (
        <div className="flex items-center">
          <span className="font-semibold text-gray-800">Copy Barcode: </span>
          <span className="ml-1 text-blue-600">{data.CopyBarcode}</span>
          {data.BagID && (
            <span className="ml-3">
              <span className="text-gray-600">Bag: </span>
              <span className="text-gray-800">{data.BagID}</span>
            </span>
          )}
        </div>
      );
    }
    
    const keys = Object.keys(data);
    if (keys.length === 0) return '{}';
    
    const firstKey = keys[0];
    return `${firstKey}: ${data[firstKey]}, ... (${keys.length} fields)`;
  };

  return (
    <div className="font-sans">
      <div className={`rounded-md transition-all duration-200 ${isExpanded ? 'bg-gray-50 shadow-sm' : 'hover:bg-gray-50'}`}>
        <div 
          className="flex items-center cursor-pointer p-2 rounded-md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className={`mr-2 text-gray-500 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`}>
            <FaChevronRight size={14} />
          </span>
          <div className="flex-grow">
            {getPreview(data, tableName)}
          </div>
        </div>
        
        {isExpanded && (
          <div className="pl-8 pr-4 pb-3 pt-1">
            <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
              <div className="grid gap-2">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-12 gap-2 items-start">
                    <span className="col-span-3 text-sm font-medium text-gray-600">{key}:</span>
                    <span className="col-span-9 text-sm text-gray-800 break-all">
                      {typeof value === 'object' && value !== null 
                        ? JSON.stringify(value) 
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Database() {
  const [selectedTable, setSelectedTable] = useState('tbl_bagging');
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [baggingFilter, setBaggingFilter] = useState('all');
  const [gunningFilter, setGunningFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allBaggingData, setAllBaggingData] = useState([]);
  const [allGunningData, setAllGunningData] = useState([]);

  // Get current filter based on selected table
  const currentFilter = selectedTable === 'tbl_bagging' ? baggingFilter : gunningFilter;
  
  // Get all data for the current table
  const allData = useMemo(() => {
    return selectedTable === 'tbl_bagging' ? allBaggingData : allGunningData;
  }, [selectedTable, allBaggingData, allGunningData]);

  // Filter data based on search term and filter
  const filteredData = useMemo(() => {
    let results = [...allData];
    
    // Apply search filter
    if (searchTerm) {
      results = results.filter(item => {
        if (selectedTable === 'tbl_bagging') {
          return item.BagID?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return (
            item.CopyBarcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.BagID?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }
    
    // Apply status filter
    if (currentFilter !== 'all') {
      if (selectedTable === 'tbl_bagging') {
        results = results.filter(item => {
          if (currentFilter === 'Processed') return item.IsScanned && item.IsUploaded;
          if (currentFilter === 'Processing') return item.IsScanned && !item.IsUploaded;
          if (currentFilter === 'Not Scanned') return !item.IsScanned;
          return true;
        });
      } else {
        results = results.filter(item => {
          if (currentFilter === 'Scanned') return item.IsScanned;
          if (currentFilter === 'Not Scanned') return !item.IsScanned;
          return true;
        });
      }
    }
    
    return results;
  }, [allData, searchTerm, currentFilter, selectedTable]);

  // Fetch all data for the selected table
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const url = `${BaseURL}/${selectedTable === 'tbl_bagging' ? 'bagging' : 'gunning'}`;
      const res = await axios.get(url);
      
      if (selectedTable === 'tbl_bagging') {
        setAllBaggingData(res.data.data || []);
      } else {
        setAllGunningData(res.data.data || []);
      }
      
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      if (selectedTable === 'tbl_bagging') {
        setAllBaggingData([]);
      } else {
        setAllGunningData([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData(item);
  };

  const handleSave = () => {
    // Update the appropriate data set
    if (selectedTable === 'tbl_bagging') {
      setAllBaggingData(allBaggingData.map(d => 
        d.BagID === editItem.BagID ? formData : d
      ));
    } else {
      setAllGunningData(allGunningData.map(d => 
        d.CopyBarcode === editItem.CopyBarcode ? formData : d
      ));
    }
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (selectedTable === 'tbl_bagging') {
        setAllBaggingData(allBaggingData.filter(item => item.BagID !== id));
      } else {
        setAllGunningData(allGunningData.filter(item => item.CopyBarcode !== id));
      }
    }
  };

  const handleBaggingFilterChange = (newFilter) => {
    setBaggingFilter(newFilter);
  };

  const handleGunningFilterChange = (newFilter) => {
    setGunningFilter(newFilter);
  };

  const getBaggingStatus = (item) => {
    if (item.IsScanned && item.IsUploaded) {
      return { text: 'Processed', style: 'bg-green-100 text-green-800' };
    } else if (item.IsScanned && !item.IsUploaded) {
      return { text: 'Processing', style: 'bg-blue-100 text-blue-800' };
    } else {
      return { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
    }
  };

  const getGunningStatus = (item) => {
    return item.IsScanned 
      ? { text: 'Scanned', style: 'bg-green-100 text-green-800' }
      : { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
  };

  const getRowKey = (item) => {
    return selectedTable === 'tbl_bagging' 
      ? `bagging-${item.BagID}` 
      : `gunning-${item.CopyBarcode}`;
  };

  const getDeleteId = (item) => {
    return selectedTable === 'tbl_bagging' 
      ? item.BagID 
      : item.CopyBarcode;
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-600">
              Last Refreshed: {lastUpdated}
            </span>
          )}
          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} /> 
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-semibold">Select Table:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tbl_bagging">Bagging</option>
              <option value="tbl_gunning">Gunning</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={
                  selectedTable === 'tbl_bagging' 
                    ? 'Search by BagID...' 
                    : 'Search by Barcode or BagID...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            {selectedTable === 'tbl_bagging' ? (
              <select
                value={baggingFilter}
                onChange={(e) => handleBaggingFilterChange(e.target.value)}
                className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Processed">Processed</option>
                <option value="Processing">Processing</option>
                <option value="Not Scanned">Not Scanned</option>
              </select>
            ) : (
              <select
                value={gunningFilter}
                onChange={(e) => handleGunningFilterChange(e.target.value)}
                className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Scanned">Scanned</option>
                <option value="Not Scanned">Not Scanned</option>
              </select>
            )}
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600 sticky top-0">
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    Loading data...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item) => {
                  const itemStatus = selectedTable === 'tbl_bagging' 
                    ? getBaggingStatus(item) 
                    : getGunningStatus(item);
                  
                  return (
                    <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-800">
                        <CollapsibleJSON data={item} tableName={selectedTable} />
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${itemStatus.style}`}>
                          {itemStatus.text}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-1">
                          <EditIconButton onClick={() => handleEdit(item)} />
                          <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    {allData.length === 0 ? 'No data available' : 'No matching records found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length} of {allData.length} records
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
            <form className="space-y-4">
              {Object.keys(editItem).map((key) => (
                <div key={key}>
                  <label className="block text-gray-600 font-medium">{key}</label>
                  <input
                    type="text"
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={key === 'BagID' || key === 'CopyBarcode'} // Prevent editing IDs
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Database;