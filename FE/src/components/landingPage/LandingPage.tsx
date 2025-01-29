import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { AUTH_LOCAL_STORAGE_KEY, HEADER_HEIGHT } from '../../constants/globalConstants';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useUserContext } from '../../context/userContext';
import { loginUser } from '../../services/userService';

type LoginFormInputs = {
	username: string;
	password: string;
};

const LandingPage = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();

	const { setUser } = useUserContext();

	const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
		console.log('Form submitted with data:', data);
		const { password, username } = data;
		const userInformation = await loginUser({
			password,
			username,
		});
		console.log(userInformation);
		if (userInformation.success) {
			console.log('i am in');
			setUser(userInformation.data.user);
			localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, userInformation.data.user.authToken);
		}
	};

	return (
		<Box
			sx={{
				minHeight: `calc(100vh - ${2 * parseInt(HEADER_HEIGHT)}px)`,
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				bgcolor: '#f4f4f4',
			}}>
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
							helperText={errors.username?.message ? errors.username.message.toString() : ''}
						/>
						<TextField
							fullWidth
							label="Password"
							type="password"
							variant="outlined"
							margin="normal"
							{...register('password', { required: 'Password is required' })}
							error={!!errors.password}
							helperText={errors.password?.message ? errors.password.message.toString() : ''}
						/>
						<Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
							Login
						</Button>
					</form>
				</CardContent>
			</Card>
		</Box>
	);
};

export default LandingPage;
