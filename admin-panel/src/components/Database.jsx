
import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import { DeleteIconButton, EditIconButton } from "./Button";
import LastUpdated from "./LastUpdated";

const BaseURL = import.meta.env.VITE_API_URL;

// Enhanced collapsible JSON component with better UI
function CollapsibleJSON({ data, tableName }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPreview = (data, tableName) => {
    if (typeof data !== "object" || data === null) {
      return String(data);
    }

    if (tableName === "tbl_bagging" && data.BagID) {
      const status =
        data.IsScanned && data.IsUploaded
          ? "Processed"
          : data.IsScanned && !data.IsUploaded
          ? "Processing"
          : "Not Scanned";

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

    if (tableName === "tbl_gunning" && data.CopyBarcode) {
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
    if (keys.length === 0) return "{}";

    const firstKey = keys[0];
    return `${firstKey}: ${data[firstKey]}, ... (${keys.length} fields)`;
  };

  return (
    <div className="font-sans">
      <div
        className={`rounded-md transition-all duration-200 ${
          isExpanded ? "bg-gray-50 shadow-sm" : "hover:bg-gray-50"
        }`}
      >
        <div
          className="flex items-center cursor-pointer p-2 rounded-md"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span
            className={`mr-2 text-gray-500 transition-transform duration-200 ${
              isExpanded ? "transform rotate-90" : ""
            }`}
          >
            <FaChevronRight size={14} />
          </span>
          <div className="flex-grow">{getPreview(data, tableName)}</div>
        </div>

        {isExpanded && (
          <div className="pl-8 pr-4 pb-3 pt-1">
            <div className="bg-white rounded-md border border-gray-200 p-3 shadow-sm">
              <div className="grid gap-2">
                {Object.entries(data).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-12 gap-2 items-start"
                  >
                    <span className="col-span-3 text-sm font-medium text-gray-600">
                      {key}:
                    </span>
                    <span className="col-span-9 text-sm text-gray-800 break-all">
                      {typeof value === "object" && value !== null
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
  const [selectedTable, setSelectedTable] = useState("tbl_bagging");
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [baggingFilter, setBaggingFilter] = useState("all");
  const [gunningFilter, setGunningFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allBaggingData, setAllBaggingData] = useState([]);
  const [allGunningData, setAllGunningData] = useState([]);

  // Get current filter based on selected table
  const currentFilter =
    selectedTable === "tbl_bagging" ? baggingFilter : gunningFilter;

  // Get all data for the current table
  const allData = useMemo(() => {
    return selectedTable === "tbl_bagging" ? allBaggingData : allGunningData;
  }, [selectedTable, allBaggingData, allGunningData]);

  // Filter data based on search term and filter
  const filteredData = useMemo(() => {
    let results = [...allData];

    // Apply search filter
    if (searchTerm) {
      results = results.filter((item) => {
        if (selectedTable === "tbl_bagging") {
          return item.BagID?.toLowerCase().includes(searchTerm.toLowerCase());
        } else {
          return (
            item.CopyBarcode?.toLowerCase().includes(
              searchTerm.toLowerCase()
            ) || item.BagID?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      });
    }

    // Apply status filter
    if (currentFilter !== "all") {
      if (selectedTable === "tbl_bagging") {
        results = results.filter((item) => {
          if (currentFilter === "Processed")
            return item.IsScanned && item.IsUploaded;
          if (currentFilter === "Processing")
            return item.IsScanned && !item.IsUploaded;
          if (currentFilter === "Not Scanned") return !item.IsScanned;
          return true;
        });
      } else {
        results = results.filter((item) => {
          if (currentFilter === "Scanned") return item.IsScanned;
          if (currentFilter === "Not Scanned") return !item.IsScanned;
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
      const url = `${BaseURL}/${
        selectedTable === "tbl_bagging" ? "bagging" : "gunning"
      }`;

      const res = await axios.get(url);

      if (selectedTable === "tbl_bagging") {
        setAllBaggingData(res.data.data || []);
      } else {
        setAllGunningData(res.data.data || []);
      }

      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);

      if (selectedTable === "tbl_bagging") {
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
    if (selectedTable === "tbl_bagging") {
      setAllBaggingData(
        allBaggingData.map((d) => (d.BagID === editItem.BagID ? formData : d))
      );
    } else {
      setAllGunningData(
        allGunningData.map((d) =>
          d.CopyBarcode === editItem.CopyBarcode ? formData : d
        )
      );
    }
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      if (selectedTable === "tbl_bagging") {
        setAllBaggingData(allBaggingData.filter((item) => item.BagID !== id));
      } else {
        setAllGunningData(
          allGunningData.filter((item) => item.CopyBarcode !== id)
        );
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
      return { text: "Processed", style: "bg-green-100 text-green-800" };
    } else if (item.IsScanned && !item.IsUploaded) {
      return { text: "Processing", style: "bg-blue-100 text-blue-800" };
    } else {
      return { text: "Not Scanned", style: "bg-red-100 text-red-800" };
    }
  };

  const getGunningStatus = (item) => {
    return item.IsScanned
      ? { text: "Scanned", style: "bg-green-100 text-green-800" }
      : { text: "Not Scanned", style: "bg-red-100 text-red-800" };
  };

  const getRowKey = (item) => {
    return selectedTable === "tbl_bagging"
      ? `bagging-${item.BagID}`
      : `gunning-${item.CopyBarcode}`;
  };

  const getDeleteId = (item) => {
    return selectedTable === "tbl_bagging" ? item.BagID : item.CopyBarcode;
  };

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">
//           Database Management
//         </h2>
//         <div className="flex items-center gap-4">
//           <LastUpdated
//             lastUpdated={lastUpdated}
//             isLoading={isLoading}
//             onRefresh={fetchData}
//           />
//         </div>
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
//                   selectedTable === "tbl_bagging"
//                     ? "Search by BagID..."
//                     : "Search by Barcode or BagID..."
//                 }
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>

//             {selectedTable === "tbl_bagging" ? (
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
//           </div>
//         </div>

//         <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {isLoading ? (
//                 <tr>
//                   <td colSpan="3" className="p-8 text-center text-gray-500">
//                     Loading data...
//                   </td>
//                 </tr>
//               ) : filteredData.length > 0 ? (
//                 filteredData.map((item) => {
//                   const itemStatus =
//                     selectedTable === "tbl_bagging"
//                       ? getBaggingStatus(item)
//                       : getGunningStatus(item);

//                   return (
//                     <tr
//                       key={getRowKey(item)}
//                       className="border-b hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="p-4 text-gray-800">
//                         <CollapsibleJSON
//                           data={item}
//                           tableName={selectedTable}
//                         />
//                       </td>
//                       <td className="p-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${itemStatus.style}`}
//                         >
//                           {itemStatus.text}
//                         </span>
//                       </td>
//                       <td className="p-4">
//                         <div className="flex space-x-1">
//                           <EditIconButton onClick={() => handleEdit(item)} />
//                           <DeleteIconButton
//                             onClick={() => handleDelete(getDeleteId(item))}
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="3" className="p-8 text-center text-gray-500">
//                     {allData.length === 0
//                       ? "No data available"
//                       : "No matching records found"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="mt-4 text-sm text-gray-600">
//           Showing {filteredData.length} of {allData.length} records
//         </div>
//       </div>

// {editItem && (
//   <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//     <div className="bg-white  p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//       <h3 className="text-lg font-medium mb-5 text-gray-800 ">
//         Edit Record
//       </h3>
//       <form className="space-y-4">
//         {Object.keys(editItem).map((key) => {
//           const isBooleanField = typeof editItem[key] === 'boolean';
//           const isIdField = key === 'BagID' || key === 'CopyBarcode' || key === 'PackingID' || key === 'GID' || key === 'GunTS';
          
//           return (
//             <div key={key} className="space-y-1">
//               <label className="text-sm font-medium text-gray-600 d">
//                 {key}
//               </label>
//               {isBooleanField ? (
//                 <select
//                   value={formData[key]}
//                   onChange={(e) =>
//                     setFormData({ 
//                       ...formData, 
//                       [key]: e.target.value === 'true' 
//                     })
//                   }
//                   className="w-full p-2 bg-gray-50  border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
//                 >
//                   <option value="true">True</option>
//                   <option value="false">False</option>
//                 </select>
//               ) : (
//                 <input
//                   type="text"
//                   value={formData[key] || ''}
//                   onChange={(e) =>
//                     setFormData({ ...formData, [key]: e.target.value })
//                   }
//                   className={`w-full p-2 bg-gray-50  border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm ${
//                     isIdField ? 'bg-gray-100  cursor-not-allowed' : ''
//                   }`}
//                   disabled={isIdField}
//                 />
//               )}
//             </div>
//           );
//         })}
//         <div className="flex justify-end space-x-3 pt-5">
//           <button
//             type="button"
//             onClick={() => setEditItem(null)}
//             className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800  transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="button"
//             onClick={handleSave}
//             className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
//           >
//             Save
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>
// )}

//     </div>
//   );

//?v.1.1- ui update

return (
  <div className="min-h-screen bg-gray-50 p-6">
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Database Management</h2>
      <div className="flex items-center gap-4">
        <LastUpdated
          lastUpdated={lastUpdated}
          isLoading={isLoading}
          onRefresh={fetchData}
          className="text-sm text-gray-600"
        />
      </div>
    </div>

    {/* Main Card */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Select Table:</label>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="tbl_bagging">Bagging</option>
            <option value="tbl_gunning">Gunning</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <FaSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
          </div>

          {selectedTable === 'tbl_bagging' ? (
            <select
              value={baggingFilter}
              onChange={(e) => handleBaggingFilterChange(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">All</option>
              <option value="Scanned">Scanned</option>
              <option value="Not Scanned">Not Scanned</option>
            </select>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto max-h-[65vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-600">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Loading data...</p>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => {
                const itemStatus =
                  selectedTable === 'tbl_bagging'
                    ? getBaggingStatus(item)
                    : getGunningStatus(item);

                return (
                  <tr
                    key={getRowKey(item)}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-gray-900">
                      <CollapsibleJSON data={item} tableName={selectedTable} />
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${itemStatus.style}`}
                      >
                        {itemStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <EditIconButton onClick={() => handleEdit(item)} />
                        <DeleteIconButton
                          onClick={() => handleDelete(getDeleteId(item))}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="p-8 text-center text-gray-600">
                  {allData.length === 0
                    ? 'No data available'
                    : 'No matching records found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Record Count */}
      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredData.length} of {allData.length} records
      </div>
    </div>

    {/* Edit Modal */}
    {editItem && (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Edit Record</h3>
          <form className="space-y-4">
            {Object.keys(editItem).map((key) => {
              const isBooleanField = typeof editItem[key] === 'boolean';
              const isIdField =
                key === 'BagID' ||
                key === 'CopyBarcode' ||
                key === 'PackingID' ||
                key === 'GID' ||
                key === 'GunTS';

              return (
                <div key={key} className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  {isBooleanField ? (
                    <select
                      value={formData[key] ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [key]: e.target.value === 'true',
                        })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[key] || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, [key]: e.target.value })
                      }
                      className={`w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isIdField ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={isIdField}
                    />
                  )}
                </div>
              );
            })}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Save
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



