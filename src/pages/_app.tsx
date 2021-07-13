import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '../theme';
import Head from 'next/head';

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Component m={0} {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default MyApp;
