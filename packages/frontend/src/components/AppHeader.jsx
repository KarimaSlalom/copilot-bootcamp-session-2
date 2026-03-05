import { Box, Typography } from '@mui/material';

export default function AppHeader() {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: '#282c34',
        color: '#ffffff',
        p: 2.5,
        borderRadius: 2,
        mb: 2.5,
      }}
    >
      <Typography variant="h5" component="h1" sx={{ m: 0, fontWeight: 'bold' }}>
        To Do App
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        Keep track of your tasks
      </Typography>
    </Box>
  );
}
