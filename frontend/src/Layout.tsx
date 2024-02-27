import React from "react";
import Header from "./components/Header";
import { Toaster } from "@/components/ui/sonner";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div>{children}</div>
      <Toaster />
    </div>
  );
};

export default Layout;
