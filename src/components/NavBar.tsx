import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';
import React from 'react';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

export const NavBar: React.FC<{}> = ({}) => {
  const { isOpen, onToggle } = useDisclosure();
  const [_, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // Tell this query not to run on server; avoids extra query when doing ssr
    pause: isServer(),
  });
  let body = null;
  if (fetching) {
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
              onClick={() => {
                logout();
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
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.600')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.700')}
        align={'center'}
      >
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <NextLink href='/'>
            <Link
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.600', 'white')}
            >
              LiReddit
            </Link>
          </NextLink>

          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          {body}
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.600', 'white');

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <NextLink href={navItem.href ?? '#'}>
            <Link
              p={2}
              fontSize={'sm'}
              fontWeight={500}
              color={linkColor}
              _hover={{
                textDecoration: 'none',
                color: linkHoverColor,
              }}
            >
              {navItem.label}
            </Link>
          </NextLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.600')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
      </Flex>
    </Stack>
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
