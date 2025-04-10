

// import { useState } from 'react';
// import { FaHome, FaDatabase, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
// import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
// import { useNavigate } from 'react-router-dom';
// import { FaFilePdf } from "react-icons/fa";
// import { RiAdminFill } from "react-icons/ri";

// function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const navigate = useNavigate();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
//   const menuItems = [
//     { name: 'Dashboard', icon: <FaHome />, path: '/' },
//     { name: 'Database', icon: <FaDatabase />, path: '/database' },
//     { name: 'Copies', icon: <FaFileAlt />, path: '/copies' },
//     { name: 'Users', icon: <FaUsers />, path: '/users' },
//     { name: 'Osm-Evaluation', icon: <FaFilePdf />, path: '/osm-eval' },
//   ];

//   const confirmLogout = () => {
//     setShowLogoutConfirm(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminUser');
//     setShowLogoutConfirm(false);
//     navigate('/login');
//   };

//   const cancelLogout = () => {
//     setShowLogoutConfirm(false);
//   };

//   return (
//     <>
//       <div
//         className={`${
//           sidebarOpen ? 'w-64' : 'w-20'
//         } bg-zinc-700 text-white h-full transition-all duration-300`}
//       >
//         <div className="p-4 flex justify-between items-center">
//         <div className='flex items-center gap-1'>
//         <span><RiAdminFill size={20}/> </span>
//         <h1 className={`${sidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Admin Panel</h1>
//         </div>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
//             {sidebarOpen ? <LuPanelRightOpen size={20}/> : <LuPanelLeftOpen size={20}/>}
//           </button>
//         </div>
//         <ul>
//           {menuItems.map((item) => (
//             <li
//               key={item.name}
//               className="p-4 hover:bg-blue-700 cursor-pointer flex items-center transition-colors duration-200"
//               onClick={() => navigate(item.path)}
//             >
//               <span className="mr-3">{item.icon}</span>
//               <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
//             </li>
//           ))}
//           <li
//             className="p-4 hover:bg-red-500 cursor-pointer flex items-center mt-auto transition-colors duration-200"
//             onClick={confirmLogout}
//           >
//             <span className="mr-3"><FaSignOutAlt /></span>
//             <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
//           </li>
//         </ul>
//       </div>

//       {/* Simplified Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black
        
//         bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 overflow-hidden">
//             <div className="px-6 py-5 border-b border-gray-200">
//               <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
//             </div>
            
//             <div className="px-6 py-4">
//               <p className="text-gray-600">Are you sure you want to sign out of your account?</p>
//             </div>
            
//             <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
//               <button
//                 onClick={cancelLogout}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Sidebar;




//? cloude code below with ui improvements


import { useState, useEffect } from 'react';
import { FaHome, FaDatabase, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { LuPanelLeftClose, LuPanelRightClose } from "react-icons/lu";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/' },
    { name: 'Database', icon: <FaDatabase />, path: '/database' },
    { name: 'Copies', icon: <FaFileAlt />, path: '/copies' },
    { name: 'Users', icon: <FaUsers />, path: '/users' },
    { name: 'Osm-Evaluation', icon: <FaFilePdf />, path: '/osm-eval' },
  ];

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <>
      <div
        className={`fixed md:relative h-screen z-20 shadow-lg transition-all duration-150 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-zinc-800 text-white`}
      >

        <div className="p-4 flex justify-between items-center border-b border-zinc-700">
          <div className='flex items-center gap-2'>
            <RiAdminFill className="text-blue-400" size={20} />
            <h1 
              className={`text-lg font-semibold transition-opacity duration-150 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              Admin Panel
            </h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-zinc-400 hover:text-white"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? <LuPanelLeftClose size={18} /> : <LuPanelRightClose size={18} />}
          </button>
        </div>
        
        <nav className="mt-2">
          <ul>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <button
                    className={`w-full py-3 px-4 flex items-center ${
                      isActive 
                        ? 'text-white border-l-4 border-blue-400 bg-zinc-700' 
                        : 'text-zinc-400 hover:text-zinc-200 border-l-2 border-transparent'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} text-lg`}>{item.icon}</span>
                    <span 
                      className={`whitespace-nowrap transition-all duration-150 ${
                        sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-4 w-full">
          <button
            className="w-full py-3 px-4 flex items-center text-zinc-400 hover:text-red-400"
            onClick={confirmLogout}
          >
            <span className={`${sidebarOpen ? 'mr-3' : 'mx-auto'} text-lg`}>
              <FaSignOutAlt />
            </span>
            <span 
              className={`whitespace-nowrap transition-all duration-150 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              }`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Improved Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
            </div>
            
            <div className="p-5">
              <p className="text-gray-600">Are you sure you want to sign out of your account?</p>
            </div>
            
            <div className="bg-gray-50 p-4 flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;