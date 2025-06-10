import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem,
  useMediaQuery, useTheme, Avatar, Divider, ListItemIcon, Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import { jwtDecode } from 'jwt-decode';
import Logout from '@mui/icons-material/Logout';

const Header = () => {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const role = decoded?.role;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState(null);

  const open = Boolean(anchorEl);
  const avatarMenuOpen = Boolean(avatarMenuAnchor);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleAvatarClick = (event) => setAvatarMenuAnchor(event.currentTarget);
  const handleAvatarClose = () => setAvatarMenuAnchor(null);

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
    handleAvatarClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    handleMenuClose();
    handleAvatarClose();
  };

  const menuItems = () => {
    switch (role) {
      case "Administrator":
        return [
          { label: "Courses", path: "/admin/courses" },
          { label: "Students", path: "/admin/students" },
          { label: "Teachers", path: "/admin/teachers" },
        ];
      case "Teacher":
        return [
          { label: "Courses", path: "/teachercourse" },
        ];
      case "Student":
        return [
          { label: "Course Enrollment", path: "/selectcourse" },
          { label: "My Courses", path: "/enrolledcourse" },
          { label: "Campus Map", path: "/studenthomepage" },
        ];
      default:
        return [];
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1a237e", height: isMobile ? 64 : 80 }}>
      <Toolbar sx={{ height: "100%", display: "flex", justifyContent: "space-between"}}>
        {/* Logo */}
        <Box display="flex" alignItems="center" onClick={() => navigate("/profilepage")} sx={{ cursor: "pointer" }}>
          <SchoolIcon sx={{ fontSize: 40, mr: 1 }} />
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            Academia<span style={{ color: "#fbc02d" }}>X</span>
          </Typography>
        </Box>
        {/* Menü */}
        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {menuItems().map((item, index) => (
                <MenuItem key={index} onClick={() => handleNavigate(item.path)}>
                  {item.label}
                </MenuItem>
              ))}
              {role && <MenuItem onClick={handleLogout}>Logout</MenuItem>}
            </Menu>
          </>
        ) : (
          <Box display="flex" alignItems="center" gap={1}>
            {menuItems().map((item, index) => (
              <Button color="inherit" component={Link} to={item.path} key={index} >
                {item.label}
              </Button>
            ))}

            {/* Avatar Menü */}
            <Tooltip title="Hesap">
              <IconButton onClick={handleAvatarClick} size="small" sx={{ ml: 1 }}>
                <Avatar src="" sx={{ width: 32, height: 32 }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={avatarMenuAnchor}
              open={avatarMenuOpen}
              onClose={handleAvatarClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
            >
              <MenuItem onClick={() => handleNavigate("/profilepage")}>
                <Avatar /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
