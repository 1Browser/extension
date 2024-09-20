import { IconViewportShort } from '@tabler/icons-react';
import { m } from 'framer-motion';

export const panelWidth = 200;

export function Panel() {
  return (
    <div className="absolute top-0 left-0 text-white">
      <div className="bg-gray-800 flex flex-row">
        <m.div
          className="p-2"
          style={{
            width: panelWidth,
          }}>
          1Browser Panel
          <div className="grid grid-cols-3">
            <ActionButton icon={<IconViewportShort />} label="Summary" onClick={() => {}} />
            <ActionButton icon={<IconViewportShort />} label="Summary" onClick={() => {}} />
            <ActionButton icon={<IconViewportShort />} label="Summary" onClick={() => {}} />
          </div>
        </m.div>
        <div className="p-2" style={{ width: 50 }}></div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div
      className="p-2 flex flex-col items-center justify-center opacity-80 hover:opacity-100 hover:bg-gray-700 rounded-md"
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      role="button"
      tabIndex={0}>
      {icon}
      <span className="text-xs">{label}</span>
    </div>
  );
}
