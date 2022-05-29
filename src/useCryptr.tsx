import { useContext } from 'react';
import CryptrContext from './models/CryptrContext';

const useCryptr = () => useContext(CryptrContext);

export default useCryptr;
