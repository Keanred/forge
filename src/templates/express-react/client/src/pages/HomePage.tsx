import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { getItems } from '../api';

export const HomePage = () => {
  const { data: items, isPending, isError } = useQuery({ queryKey: ['items'], queryFn: getItems });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Items
      </Typography>

      {isPending && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error">Failed to load items. Is the server running?</Typography>
      )}

      {items && items.length === 0 && (
        <Typography color="text.secondary">No items yet.</Typography>
      )}

      {items && items.length > 0 && (
        <Paper variant="outlined">
          <List disablePadding>
            {items.map((item, index) => (
              <ListItem key={item.id} divider={index < items.length - 1}>
                <ListItemText
                  primary={item.name}
                  secondary={item.description ?? undefined}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};
