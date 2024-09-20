import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { Provider, Shell } from '@extension/ui';
import { Button } from '@mantine/core';

const Options = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg';

  return (
    <Provider>
      <Shell>
        <div className={`App ${isLight ? 'text-gray-900 bg-slate-50' : 'text-gray-100 bg-gray-800'}`}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
          <p>
            Edit <code>pages/options/src/options.tsx</code>
          </p>
          <Button className="mt-4" onClick={themeStorage.toggle}>
            Toggle theme
          </Button>
        </div>
      </Shell>
    </Provider>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
