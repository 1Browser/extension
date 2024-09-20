import { Text, AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useState } from 'react';

export function Shell({ children }: { children: React.ReactNode }) {
  const [openedNavbar, setOpenedNavbar] = useState(false);

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !openedNavbar },
      }}
      padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={openedNavbar} onClick={() => setOpenedNavbar(!openedNavbar)} hiddenFrom="sm" size="sm" />
          <Text>1Browser</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
