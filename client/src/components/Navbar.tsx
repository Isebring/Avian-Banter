import {
    Box,
    Burger,
    Divider,
    Drawer,
    Group,
    Header,
    MediaQuery,
    ScrollArea,
    createStyles,
    rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

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
  //   const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const { classes, theme } = useStyles();

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    closeDrawer();
  }

  return (
    <Box sx={{ position: 'sticky', top: 0, left: 0, right: 0, zIndex: 1 }}>
      <Header height={65} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
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
          <Group
            sx={{ height: '100%' }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <Link to="/" className={classes.link} onClick={scrollToTop}>
              <IconInfoCircle
                style={{ marginRight: '0.2rem' }}
                size="1.2rem"
                stroke={0.8}
              />
              About
            </Link>
          </Group>

          <Group className={classes.hiddenMobile}>
            <Link
              onClick={scrollToTop}
              style={{ textDecoration: 'none' }}
              to="/profile"
            ></Link>
          </Group>

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
        <Link
          onClick={scrollToTop}
          style={{ textDecoration: 'none' }}
          to="/profile"
        ></Link>

        <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
          <Divider
            my="lg"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />

          <a href="/" className={classes.link}>
            <IconInfoCircle
              style={{ marginRight: '0.2rem' }}
              size="1.2rem"
              stroke={0.8}
            />
            About
          </a>

          <Divider
            my="lg"
            color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}
          />

          <Group position="center" grow pb="xl" px="md"></Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
