import React from "react";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

export default function () {
  return (
    <main className="h-100 w-100">
      <Header  /> {/* Pass noTier based on the current path */}

      <div className="main-content">
        <div>
          <Sidebar />
        </div>

        <div className="website-content ">
          <Outlet /> {/* Dynamic content rendering */}
        
        </div>
      </div>
    </main>
  );
}
