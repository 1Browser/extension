import { useStorage } from '@extension/shared';
import { floatingPositionStorage } from '@extension/storage';
import { m, useDragControls, type PanInfo } from 'framer-motion';
import { useRef, useState } from 'react';
import { Panel, panelWidth } from './panel';
import { IconCircleNumber1 } from '@tabler/icons-react';

export function Floating() {
  const position = useStorage(floatingPositionStorage);
  const dragControls = useDragControls();

  const containerRef = useRef<HTMLDivElement>(null);

  const startDrag = async (e: React.PointerEvent<HTMLDivElement>) => {
    dragControls.start(e);
    // await chrome.runtime.sendMessage({ type: 'openSidebar' });
  };

  const updatePosition = (_e: MouseEvent | TouchEvent | PointerEvent) => {
    const y = _e instanceof MouseEvent ? _e.clientY : _e.touches[0].clientY;

    floatingPositionStorage.update(y);
  };

  const closeTimer = useRef<number | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleMouseLeave = () => {
    closeTimer.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const handleMouseEnter = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
    }
    setIsOpen(true);
  };

  return (
    <div
      className="fixed top-0 h-screen w-0"
      style={{
        right: 40,
        zIndex: 2147483647,
      }}
      ref={containerRef}>
      <m.div
        drag="y"
        dragControls={dragControls}
        dragConstraints={containerRef}
        dragElastic={0.2}
        dragMomentum={false}
        initial={{ opacity: 0, y: position - 20, x: panelWidth }}
        animate={{ opacity: 0.5, y: position - 20, x: isOpen ? -panelWidth : 0 }}
        whileHover={{ opacity: 1 }}
        whileDrag={{ scale: 1.05 }}
        onDragEnd={updatePosition}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        <div className="flex flex-row">
          {/* handle bar */}
          <m.div
            className="bg-gray-800 rounded-tl-md rounded-bl-md px-2 py-1 cursor-move"
            style={{ width: 40 }}
            onPointerDown={startDrag}>
            <IconCircleNumber1 className="text-white" />
          </m.div>

          <div className="relative">
            <Panel />
          </div>
        </div>
      </m.div>
    </div>
  );
}
