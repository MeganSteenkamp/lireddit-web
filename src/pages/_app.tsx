import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Component m={0} {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
