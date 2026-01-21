"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  alpha,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  CalendarMonth,
  Article,
  BarChart,
  Link as LinkIcon,
  Group,
  Settings,
  Logout,
  KeyboardArrowDown,
} from "@mui/icons-material";

const DRAWER_WIDTH = 240;

const navigation = [
  { name: "Posts", href: "/posts", icon: Article },
  { name: "Calendar", href: "/calendar", icon: CalendarMonth },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Accounts", href: "/accounts", icon: LinkIcon },
  { name: "Team", href: "/team", icon: Group },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ workspaceName = "My Workspace" }: { workspaceName?: string }) {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "grey.50",
        },
      }}
    >
      {/* Logo */}
      <Box
        component={Link}
        href="/posts"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 2,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            background: "linear-gradient(135deg, #006686 0%, #0080A8 100%)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "16px",
            color: "text.primary",
          }}
        >
          SocialHub
        </Typography>
      </Box>

      {/* Workspace switcher - compact */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 1.5,
            cursor: "pointer",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            "&:hover": {
              borderColor: "primary.main",
            },
          }}
        >
          <Avatar
            sx={{
              width: 24,
              height: 24,
              fontSize: "11px",
              bgcolor: "primary.main",
            }}
          >
            {workspaceName.charAt(0)}
          </Avatar>
          <Typography
            variant="body2"
            sx={{
              flex: 1,
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {workspaceName}
          </Typography>
          <KeyboardArrowDown sx={{ fontSize: 16, color: "text.secondary" }} />
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 1.5, py: 1 }}>
        <List disablePadding>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    borderRadius: 1.5,
                    py: 1,
                    px: 2,
                    bgcolor: isActive ? "white" : "transparent",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    border: isActive ? "1px solid" : "none",
                    borderColor: "divider",
                    "&:hover": {
                      bgcolor: isActive ? "white" : alpha("#000", 0.03),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    <Icon sx={{ fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "text.primary" : "text.secondary",
                      fontSize: "13px",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Sign Out */}
      <Divider sx={{ mx: 2 }} />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={() => signOut({ callbackUrl: "/login" })}
          sx={{
            borderRadius: 1.5,
            py: 1,
            px: 2,
            "&:hover": {
              bgcolor: alpha("#000", 0.04),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
            <Logout sx={{ fontSize: 18 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: 500,
              color: "text.secondary",
              fontSize: "13px",
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
