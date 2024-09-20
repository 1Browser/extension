import { DEFAULT_THEME, MantineProvider } from '@mantine/core';
import { themeStorage } from '@extension/storage';
import { useStorage } from '@extension/shared';
import { MotionProvider } from '../motion/provider';

const theme = DEFAULT_THEME;

export function Provider({ children }: { children: React.ReactNode }) {
  const colorScheme = useStorage(themeStorage);
  return (
    <>
      {/* <ColorSchemeScript /> */}
      <MotionProvider>
        <MantineProvider forceColorScheme={colorScheme} theme={theme}>
          {children}
        </MantineProvider>
      </MotionProvider>
    </>
  );
}
