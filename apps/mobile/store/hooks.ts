import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// ✅ Export typed hooks from mobile app, not shared package
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T => 
  useSelector(selector);