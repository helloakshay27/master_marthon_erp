import React from "react";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

export default function () {
  return (
    <>
      <Header />
      <div className="main-content">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
