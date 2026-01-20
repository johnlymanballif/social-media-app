"use client";

import { Box } from "@mui/material";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  showNewPost?: boolean;
}

export function DashboardLayout({
  children,
  title,
  showNewPost = true,
}: DashboardLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          overflow: "hidden",
          ml: "260px", // Match drawer width
        }}
      >
        <Header title={title} showNewPost={showNewPost} />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
