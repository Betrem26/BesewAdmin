// theme.ts

import { CustomThemeType } from "../types/Theme.styled";
  
  export const theme: CustomThemeType = {
    colors: {
      primary: {
        main: '#007bff',
        dark: '#0056b3',
        light: '#83c1ff',
      },
      secondary: {
        main: '#6c757d',
        dark: '#495057',
        light: '#b0b6bd',
      },
      success: {
        main: '#28a745',
        dark: '#218838',
        light: '#9be9a8',
      },
      danger: {
        main: '#dc3545',
        dark: '#c82333',
        light: '#f5c6cb',
      },
      warning: {
        main: '#ffc107',
        dark: '#e0a800',
        light: '#ffeeba',
      },
      info: {
        main: '#17a2b8',
        dark: '#117a8b',
        light: '#bee5eb',
      },
      gray:{
        light:"#D3D3D3dd",
        medium:"#808080",
        dark:"#555555"
      },
      black:{
        light:"#333333",
        medium:"#0f0f0f",
        dark:"#000000"
      },
      white:{
        light:"#FFFFFF",
        medium:"#FFFAFA",//snow white
        dark:"#FFFFF0"
      },
      light: '#f8f9fa',
      dark: '#343a40',
      background: '#ffffff',
      text: '#000000',
    },
    typography: {
      fontFamily: {
        primary: 'Verdana, sans-serif',
        secondary: 'Helvetica, sans-serif',
      },
      fontSize: {
        xxs:'7px',
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl:'50px',
        xxxl:'80px'
      },
      fontWeight: {
        regular: 400,
        bold: 700,
      },
      lineHeight: '1.5',
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    boxShadow: {
      small: '0 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 8px rgba(0, 0, 0, 0.1)',
      large: '0 8px 16px rgba(0, 0, 0, 0.1)',
    },
    breakpoints: {
      xs: '0',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
    },
    zIndex: {
      modal: 1000,
      overlay: 900,
    },
  };
  
  export default theme;
  