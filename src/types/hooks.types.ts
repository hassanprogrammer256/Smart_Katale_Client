// app/hooks.ts
import {type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type store from '../app/store';


// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store.getState;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<ReturnType<AppStore>> = useSelector;