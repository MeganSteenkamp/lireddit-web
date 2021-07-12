import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Heading,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/client';

const NavLink = ({ children }: { children: NavItem }) =>
  !children ? null : (
    <NextLink href={children.href ?? '#'}>
      <Link
        px={2}
        py={1}
        rounded={'md'}
        _hover={{
          textDecoration: 'none',
          bg: useColorModeValue('gray.200', 'gray.700'),
        }}
        href={'#'}
      >
        {children.label}
      </Link>
    </NextLink>
  );

export const NavBar = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [logout] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;
  if (loading) {
    body = null;
  } else if (!data?.me) {
    // user is not logged in
    body = (
      <>
        <NextLink href='/login'>
          <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'}>
            Sign In
          </Button>
        </NextLink>
        <NextLink href='/register'>
          <Button
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            color={'white'}
            bg={'pink.400'}
            _hover={{
              bg: 'pink.300',
            }}
          >
            Sign Up
          </Button>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex alignItems={'center'}>
        <Menu>
          <MenuButton
            as={Button}
            rounded={'full'}
            variant={'link'}
            cursor={'pointer'}
          >
            <Avatar size={'sm'} name={data.me.username} />
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={async () => {
                await logout();
                await apolloClient.resetStore();
              }}
              variant='link'
            >
              Sign out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex
          bg={useColorModeValue('white', 'gray.900')}
          color={useColorModeValue('gray.800', 'white')}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
        >
          <Flex
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            align={'center'}
            flex={1}
            m='auto'
            maxW={800}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <IconButton
              size={'md'}
              mr={6}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              <Box fontWeight={'semibold'}>
                <NextLink href='/'>LiReddit</NextLink>
              </Box>
              <HStack
                as={'nav'}
                spacing={4}
                display={{ base: 'none', md: 'flex' }}
              >
                {NAV_ITEMS.map((navItem) => (
                  <NavLink key={navItem.label}>{navItem}</NavLink>
                ))}
              </HStack>
            </HStack>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}
            >
              {body}
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {NAV_ITEMS.map((navItem) => (
                <NavLink key={navItem.label}>{navItem}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

interface NavItem {
  label: string;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Create Post',
    href: '/create-post',
  },
];
