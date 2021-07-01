import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';

import NextLink from 'next/link';
import React from 'react';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery();
  let body = null;
  if (fetching) {
    body = null;
  } else if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href='/login'>
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link>register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant='link'
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position='sticky' top={0} bg={'blue.300'} p={4}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
