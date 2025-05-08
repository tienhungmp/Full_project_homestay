
import React, { createContext } from 'react';
import { AuthContextType } from './types';

// Create auth context with default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
