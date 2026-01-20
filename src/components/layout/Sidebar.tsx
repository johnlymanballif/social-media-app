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
} from "@mui/material";
import {
  CalendarMonth,
  Article,
  Schedule,
  BarChart,
  Link as LinkIcon,
  Group,
  Settings,
  Logout,
} from "@mui/icons-material";

const DRAWER_WIDTH = 260;

const navigation = [
  { name: "Calendar", href: "/calendar", icon: CalendarMonth },
  { name: "Posts", href: "/posts", icon: Article },
  { name: "Schedule", href: "/schedule", icon: Schedule },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Accounts", href: "/accounts", icon: LinkIcon },
  { name: "Team", href: "/team", icon: Group },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  workspaceName?: string;
}

export function Sidebar({ workspaceName = "My Workspace" }: SidebarProps) {
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
        href="/calendar"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2.5,
          py: 2,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: "linear-gradient(135deg, #006686 0%, #0080A8 100%)",
            boxShadow: 1,
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            letterSpacing: "-0.01em",
          }}
        >
          SocialHub
        </Typography>
      </Box>

      {/* Workspace Indicator */}
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            px: 2,
            py: 1.5,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
            }}
          >
            Workspace
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {workspaceName}
          </Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, px: 1.5, py: 1 }}>
        <List disablePadding>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    px: 2,
                    bgcolor: isActive ? "background.paper" : "transparent",
                    boxShadow: isActive ? 1 : 0,
                    "&:hover": {
                      bgcolor: isActive ? "background.paper" : alpha("#000", 0.04),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "primary.main" : "text.secondary",
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      variant: "body2",
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? "text.primary" : "text.secondary",
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
            borderRadius: 2,
            py: 1.25,
            px: 2,
            "&:hover": {
              bgcolor: alpha("#000", 0.04),
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
            <Logout sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Sign out"
            primaryTypographyProps={{
              variant: "body2",
              fontWeight: 500,
              color: "text.secondary",
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
}
