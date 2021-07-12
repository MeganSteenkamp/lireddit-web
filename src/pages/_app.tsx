import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { PaginatedPosts } from '../generated/graphql';
import theme from '../theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      <ColorModeProvider
        options={{
          useSystemColorMode: true,
          initialColorMode: 'dark',
        }}
      >
        <Component m={0} {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
