import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store';
import ApiTest from './components/ApiTest';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h1>API Endpoints Test</h1>
          <ApiTest />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
