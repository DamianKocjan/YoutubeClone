import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import { AuthProvider } from '../auth';
import { queryClient } from '../api';

const IndexProviders: React.FC = ({ children }) => {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </Router>
  );
};

export default IndexProviders;
