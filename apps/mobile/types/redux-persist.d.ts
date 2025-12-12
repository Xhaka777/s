declare module 'redux-persist/integration/react' {
    import * as React from 'react';
    import { Persistor } from 'redux-persist';
  
    interface PersistGateProps {
      loading?: React.ReactNode | null;
      onBeforeLift?: () => void | Promise<void>;
      persistor: Persistor;
      children?: React.ReactNode;
    }
  
    export class PersistGate extends React.Component<PersistGateProps> {}
  }
  
  declare module 'redux-persist/lib/storage' {
    const storage: any;
    export default storage;
  }