import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "../features/shared/components/Nav";
import Footer from "../features/shared/components/Footer";

const AppLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Nav />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
