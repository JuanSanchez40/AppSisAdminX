import React from 'react';
import ReportScreen from './components/ReportScreen';
import { CssBaseline, Container } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        
        <ReportScreen />
       
      </Container>
    </>
  );
}

export default App;