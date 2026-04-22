import { FronteggProvider } from "@frontegg/react";
import { memo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { sanboxContextOptions } from "./config/sanboxContextOptions";
import Main from "./components/Main";
import DeviceVerifyPage from "./components/DeviceVerifyPage";

const App = () => {
  const [fronteggLoading, setFronteggLoading] = useState(true);
  
  return (
    <>
    <BrowserRouter>
      <FronteggProvider
        contextOptions={sanboxContextOptions}
        hostedLoginBox={true}
        authOptions={{
          keepSessionAlive: true,
        }}
        customLoader={setFronteggLoading}
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/activate" element={<DeviceVerifyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </FronteggProvider>
    </BrowserRouter>
    {fronteggLoading && <div className="spinner"></div>}
    </>
  );
};

export default memo(App);
