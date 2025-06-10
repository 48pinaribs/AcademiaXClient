import React from 'react';
import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import './Styles/Footer.css'; // Import your CSS file for custom styles

const Footer = () => {
  return (
    <Box
      component="footer"
      className='footer-box'
    >
      <Container maxWidth="lg">
        <Grid container justifyContent="space-between" >
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'gray' }}>
              © {new Date().getFullYear()} Academia<span style={{ color: '#fbc02d' }}>X</span>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 }, color: 'gray' }}>
            <MuiLink href="/about" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Hakkında
            </MuiLink>
            <MuiLink href="/contact" color="inherit" underline="hover" sx={{ mx: 1 }}>
              İletişim
            </MuiLink>
            <MuiLink href="/privacy" color="inherit" underline="hover" sx={{ mx: 1 }}>
              Gizlilik
            </MuiLink>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
