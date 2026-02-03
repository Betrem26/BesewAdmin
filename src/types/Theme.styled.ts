export interface CustomThemeType {
    colors: {
      primary: {
        main: string;
        dark: string;
        light: string;
      };
      secondary: {
        main: string;
        dark: string;
        light: string;
      };
      success: {
        main: string;
        dark: string;
        light: string;
      };
      danger: {
        main: string;
        dark: string;
        light: string;
      };
      warning: {
        main: string;
        dark: string;
        light: string;
      };
      info: {
        main: string;
        dark: string;
        light: string;
      };
      gray:{
        light:string,
        medium:string,
        dark:string
      };
      black:{
        light:string,
        medium:string,
        dark:string
      };
      white:{
        light:string,
        medium:string,
        dark:string
      };
      light: string;
      dark: string;
      background: string;
      text: string;
      // Add more colors as needed
    };
    typography: {
      fontFamily: {
        primary: string;
        secondary: string;
        // Add more font families as needed
      };
      fontSize: {
        xxs:string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        xxl:string
        xxxl:string
        // Add more font sizes as needed
      };
      fontWeight: {
        regular: number;
        bold: number;
        // Add more font weights as needed
      };
      lineHeight: string;
      // Add more typography properties as needed
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      // Add more spacing values as needed
    };
    borderRadius: {
      small: string;
      medium: string;
      large: string;
      // Add more border radius options as needed
    };
    boxShadow: {
      small: string;
      medium: string;
      large: string;
      // Add more box shadow options as needed
    };
    breakpoints: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      // Add more breakpoints as needed
    };
    zIndex: {
      modal: number;
      overlay: number;
      // Add more z-index values as needed
    };
    // Add more global styles as needed
  }