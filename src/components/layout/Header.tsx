"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Badge,
  InputBase,
  Box,
  alpha,
} from "@mui/material";
import {
  Search,
  Add,
  NotificationsOutlined,
} from "@mui/icons-material";

interface HeaderProps {
  title: string;
  showNewPost?: boolean;
}

export function Header({ title, showNewPost = true }: HeaderProps) {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2, px: 3, minHeight: "64px" }}>
        {/* Page title - subtle */}
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </Typography>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Search */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 1.5,
            bgcolor: "grey.100",
            width: 220,
            transition: "all 0.15s ease",
            "&:focus-within": {
              bgcolor: "background.paper",
              boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              border: "1px solid",
              borderColor: "primary.main",
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Search sx={{ fontSize: 18 }} />
          </Box>
          <InputBase
            placeholder="Search..."
            sx={{
              width: "100%",
              py: 1,
              pl: 4.5,
              pr: 2,
              fontSize: "13px",
              "& input::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* New Post Button - primary action */}
        {showNewPost && (
          <Button
            component={Link}
            href="/posts/new"
            variant="contained"
            startIcon={<Add sx={{ fontSize: 18 }} />}
            sx={{
              px: 2.5,
              py: 1,
              fontWeight: 500,
              fontSize: "13px",
              borderRadius: 1.5,
            }}
          >
            New Post
          </Button>
        )}

        {/* Notifications */}
        <IconButton
          sx={{
            width: 36,
            height: 36,
            color: "text.secondary",
            "&:hover": {
              bgcolor: "grey.100",
            },
          }}
        >
          <Badge
            variant="dot"
            color="error"
            sx={{
              "& .MuiBadge-badge": {
                top: 3,
                right: 3,
              },
            }}
          >
            <NotificationsOutlined sx={{ fontSize: 20 }} />
          </Badge>
        </IconButton>

        {/* User Avatar */}
        <Avatar
          src={session?.user?.image || undefined}
          sx={{
            width: 34,
            height: 34,
            bgcolor: "primary.main",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "box-shadow 0.15s ease",
            "&:hover": {
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            },
          }}
        >
          {getInitials(session?.user?.name || session?.user?.email || "U")}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
