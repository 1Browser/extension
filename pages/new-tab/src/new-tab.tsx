import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { themeStorage } from '@extension/storage';
import { Button } from '@mantine/core';
import { t } from '@extension/i18n';
import { Provider } from '@extension/ui';

const NewTab = () => {
  const theme = useStorage(themeStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'new-tab/logo_horizontal.svg' : 'new-tab/logo_horizontal_dark.svg';

  console.log(t('hello', 'World'));

  return (
    <Provider>
      <div className={`App ${isLight ? 'bg-slate-50' : 'bg-gray-800'}`}>
        <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
          <p>
            Edit <code>pages/new-tab/src/NewTab.tsx</code>
          </p>
          <h6>The color of this paragraph is defined using SASS.</h6>
          <Button className="mt-4" onClick={themeStorage.toggle}>
            {t('toggleTheme')}
          </Button>
        </header>
      </div>
    </Provider>
  );
};

export default withErrorBoundary(withSuspense(NewTab, <div>{t('loading')}</div>), <div> Error Occur </div>);
