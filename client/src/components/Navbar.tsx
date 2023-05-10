import {
  Box,
  Burger,
  Button,
  Divider,
  Drawer,
  Group,
  Header,
  MediaQuery,
  ScrollArea,
  Text,
  createStyles,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconDoor,
  IconDoorEnter,
  IconMessageCircle,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { SocketData } from '../../../server/communication';
import { useSocket } from '../context/SocketContext';
import { useUsername } from '../context/UsernameContext';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: rem(42),
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    }),
  },

  subLink: {
    width: '100%',
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[7]
          : theme.colors.gray[0],
    }),

    '&:active': theme.activeStyles,
  },

  hiddenMobile: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },
}));

export function Navigationbar() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [
    messagesDrawerOpened,
    { toggle: toggleMessagesDrawer, close: closeMessagesDrawer },
  ] = useDisclosure(false);
  //   const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { username } = useUsername();
  const sessionID = localStorage.getItem('sessionID');
  const { users, createDMRoom } = useSocket();
  const navigate = useNavigate();

  const currentUserID = localStorage.getItem('sessionID');
  const filteredUsers = users.filter((user) => user.userID !== currentUserID);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    closeDrawer();
    closeMessagesDrawer();
  }

  const handleCreateDMRoom = (recipientUserID: string) => {
    createDMRoom(recipientUserID);
    navigate(`dm/${recipientUserID}`);
  };

  return (
    <Box sx={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 1 }}>
      <Header height={65} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          {sessionID ? (
            <MediaQuery query="(max-width: 500px)" styles={{ width: '190px' }}>
              <img
                src="/avian-banter-logo.svg"
                alt="AvianBanter logo"
                width="200px"
                height="52px"
              />
            </MediaQuery>
          ) : (
            <Link onClick={scrollToTop} to="/">
              <MediaQuery
                query="(max-width: 500px)"
                styles={{ width: '190px' }}
              >
                <img
                  src="/avian-banter-logo.svg"
                  alt="AvianBanter logo"
                  width="200px"
                  height="52px"
                />
              </MediaQuery>
            </Link>
          )}

          <Group
            sx={{ height: '100%' }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link
              to="/createroom"
              className={classes.link}
              onClick={scrollToTop}
            >
              <IconDoor
                style={{ marginRight: '0.2rem' }}
                size="1.2rem"
                stroke={0.8}
              />
              Create Room
            </Link>
            <Link to="/joinroom" className={classes.link} onClick={scrollToTop}>
              <IconDoorEnter
                style={{ marginRight: '0.2rem' }}
                size="1.2rem"
                stroke={0.8}
              />
              Join Room
            </Link>
            <Button
              className={classes.link}
              variant="hidden"
              onClick={toggleMessagesDrawer}
            >
              <IconMessageCircle
                style={{ marginRight: '0.2rem' }}
                size="1.2rem"
                stroke={0.8}
              />
              Messages
            </Button>
          </Group>
          <Text>{username}</Text>
          <Group className={classes.hiddenMobile}></Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="AvianBanter"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        {/* <Link
          onClick={scrollToTop}
          style={{ textDecoration: 'none' }}
          to="/profile"
        ></Link> */}

        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="lg"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />
          <a href="/createroom" onClick={scrollToTop} className={classes.link}>
            <IconDoor
              style={{ marginRight: '0.2rem' }}
              size="1.2rem"
              stroke={0.8}
            />
            Create Room
          </a>
          <Divider
            my="lg"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />
          <a href="/joinroom" onClick={scrollToTop} className={classes.link}>
            <IconDoorEnter
              style={{ marginRight: '0.2rem' }}
              size="1.2rem"
              stroke={0.8}
            />
            Join Room
          </a>
          <Divider
            my="lg"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />
          <Button
            className={classes.link}
            variant="hidden"
            onClick={toggleMessagesDrawer}
          >
            <IconMessageCircle
              style={{ marginRight: '0.2rem' }}
              size="1.2rem"
              stroke={0.8}
            />
            Messages
          </Button>
          <Divider
            my="lg"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />
          <Group position="center" grow pb="xl" px="md"></Group>
        </ScrollArea>
      </Drawer>
      <Drawer
        opened={messagesDrawerOpened}
        onClose={closeMessagesDrawer}
        position="right"
        size="40%"
        padding="md"
        title="Messages"
        zIndex={1000000}
      >
        {filteredUsers &&
          filteredUsers.map((user: SocketData) => (
            <div key={user.userID}>
              <Text>{user.username}</Text>
              <Button onClick={() => handleCreateDMRoom(user.userID)}>
                Send Direct Message
              </Button>
            </div>
          ))}
      </Drawer>
    </Box>
  );
}
