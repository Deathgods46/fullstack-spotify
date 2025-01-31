import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@mui/material';
import {
  AUTH_LOCAL_STORAGE_KEY,
  HEADER_HEIGHT,
} from '../../constants/globalConstants';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useUserContext } from '../../context/userContext';
import { addUser, loginUser } from '../../services/userService';
import useSpotify from '../../hooks/useSpotify';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

type LoginFormInputs = {
  username: string;
  password: string;
  email?: string;
};

const LandingPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const { setUser, setLocalStorageAuthToken } = useUserContext();
  const { initSpotify } = useSpotify();

  const [isLogin, setIsLogin] = useState(true);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { password, username } = data;
    if (isLogin) {
      const userInformation = await loginUser({
        password,
        username,
      });
      if (!userInformation.success) {
        toast.error('User not found!');
        return;
      }
      if (userInformation.success) {
        setUser(userInformation.data.user);
        localStorage.setItem(
          AUTH_LOCAL_STORAGE_KEY,
          userInformation.data.user.authToken,
        );
        setLocalStorageAuthToken(userInformation.data.user.authToken);
      }
    } else {
      const response = await addUser({email: data.email ?? '', password: data.password, username: data.username});
      if (response.success) {
        setUser(response.data);
        localStorage.setItem(
          AUTH_LOCAL_STORAGE_KEY,
          response.data.authToken,
        );
        setLocalStorageAuthToken(response.data.authToken);
      } else {
        toast.error(response.message);
      }
    }
    await initSpotify();

  };

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${2 * parseInt(HEADER_HEIGHT)}px)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f4f4f4',
      }}
    >
      <Card sx={{ width: 350, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              {...register('username', { required: 'Username is required' })}
              error={!!errors.username}
              helperText={
                errors.username?.message
                  ? errors.username.message.toString()
                  : ''
              }
            />
            {!isLogin &&
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={
                errors.email?.message
                  ? errors.email.message.toString()
                  : ''
              }
            />
            }
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              margin="normal"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={
                errors.password?.message
                  ? errors.password.message.toString()
                  : ''
              }
            />
            <Typography
              variant="body2"
              color="primary"
              align="center"
              sx={{ mt: 2, cursor: 'pointer' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'New user? Register' : 'Already have an account? Login'}
            </Typography>

            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
              {isLogin ? 'Login' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LandingPage;
