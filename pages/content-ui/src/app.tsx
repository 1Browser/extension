import { useEffect } from 'react';
import { Provider } from '@extension/ui';
import { Floating } from './floating';

export default function App() {
  useEffect(() => {
    console.log('content ui loaded');
  }, []);

  return (
    <Provider>
      <Floating />
    </Provider>
  );
}
