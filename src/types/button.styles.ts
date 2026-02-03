export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'icon';
    disabled?: boolean;
    onClick?: () => void;
    type?: 'submit' | 'button';
    children?: React.ReactNode;
    radius?: string;
    background?: string;
    width?: string;
    height?: string;
    padding?: string;
    hoverColor?: string; 
    hoverBackground?: string; 
    mediaQueryWidth?: string; 
    linearGradient?: string; 
    customStyle?: any;
  }