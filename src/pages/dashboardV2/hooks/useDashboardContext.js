import { useContext } from 'react';
import DashboardContext from '../context/DashboardContext';

export default function useDashboardContext() {
  return useContext(DashboardContext);
}
