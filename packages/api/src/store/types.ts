export interface AuthState {
  token: string | null;
}


export interface BaseRootState {
  auth: AuthState;
}

export type RootState = BaseRootState & {
  [key: string]: any;
};

