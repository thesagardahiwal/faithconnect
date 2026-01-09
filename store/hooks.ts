// create a useAppDispach and useAppSelector hooks
import type { AppDispatch, RootState } from '@/store/index';
import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);