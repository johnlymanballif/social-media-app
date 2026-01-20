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
      <Toolbar sx={{ gap: 2, px: 3 }}>
        {/* Title */}
        <Typography
          variant="h5"
          component="h1"
          sx={{
            fontWeight: 600,
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
            borderRadius: 2.5,
            bgcolor: "grey.100",
            "&:hover": {
              bgcolor: "grey.200",
            },
            "&:focus-within": {
              bgcolor: "background.paper",
              boxShadow: (theme) => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              border: "1px solid",
              borderColor: "primary.main",
            },
            border: "1px solid transparent",
            transition: "all 0.2s ease",
            width: 280,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Search sx={{ fontSize: 20 }} />
          </Box>
          <InputBase
            placeholder="Search..."
            sx={{
              width: "100%",
              py: 1,
              pl: 5,
              pr: 2,
              fontSize: "0.875rem",
              "& input::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* New Post Button */}
        {showNewPost && (
          <Button
            component={Link}
            href="/posts/new"
            variant="contained"
            startIcon={<Add />}
            sx={{
              px: 2.5,
              py: 1,
              fontWeight: 500,
            }}
          >
            New Post
          </Button>
        )}

        {/* Notifications */}
        <IconButton
          sx={{
            color: "text.secondary",
            "&:hover": {
              bgcolor: "grey.100",
            },
          }}
        >
          <Badge
            variant="dot"
            color="error"
            overlap="circular"
            sx={{
              "& .MuiBadge-badge": {
                top: 4,
                right: 4,
              },
            }}
          >
            <NotificationsOutlined />
          </Badge>
        </IconButton>

        {/* User Avatar */}
        <Avatar
          src={session?.user?.image || undefined}
          sx={{
            width: 38,
            height: 38,
            bgcolor: "primary.main",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "box-shadow 0.2s ease",
            "&:hover": {
              boxShadow: 2,
            },
          }}
        >
          {getInitials(session?.user?.name || session?.user?.email || "U")}
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
