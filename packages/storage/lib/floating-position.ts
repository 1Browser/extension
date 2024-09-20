import { createStorage } from './base';
import { StorageEnum } from './enums';
import type { BaseStorage } from './types';

const halfHeight = globalThis.innerHeight ? globalThis.innerHeight / 2 : 500;

const storage = createStorage<number>('floating-position', halfHeight, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const floatingPositionStorage: BaseStorage<number> & {
  update: (newPosition: number) => Promise<void>;
} = {
  ...storage,
  update: async (newPosition: number) => {
    console.debug('newPosition', newPosition);
    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > globalThis.innerHeight) {
      newPosition = globalThis.innerHeight;
    }
    console.debug('setting floating position to', newPosition);
    return storage.set(newPosition);
  },
};
