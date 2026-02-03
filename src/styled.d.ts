import 'styled-components';
import { CustomThemeType } from './types/Theme.styled';

declare module 'styled-components' {
  export interface DefaultTheme extends CustomThemeType {}
}
