export interface InputProps {
    type?: string; // Add the type prop
    disabled?: boolean;
    placeholder?: string;
    value?: string;
    name?:string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    radius?: string;
    background?: string;
    width?: string;
    height?: string;
    padding?: string;
    customStyle?: any;
    fontSize?:any;
    color?:string;
  }