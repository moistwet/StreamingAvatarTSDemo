// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import './index.css';
// import App from './App';
// import HankoAuth from './components/HankoAuth';
// import { useSessionData } from './hooks/useSessionData';

// // Import Font Awesome CSS
// import '@fortawesome/fontawesome-free/css/all.min.css';

// const Root: React.FC = () => {
//   const { isValid, loading } = useSessionData();

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Router>
//       <Routes>
//         {!isValid ? (
//           <Route path="*" element={<HankoAuth />} />
//         ) : (
//           <Route path="*" element={<App />} />
//         )}
//       </Routes>
//     </Router>
//   );
// };

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <Root />
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import { useSessionData } from './hooks/useSessionData';

// Import Font Awesome CSS
import '@fortawesome/fontawesome-free/css/all.min.css';

const Root: React.FC = () => {
  const { loading } = useSessionData();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);