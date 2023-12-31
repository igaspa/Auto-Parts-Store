import * as React from 'react';
import { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext, UserInfo } from '../context/authContext';

const theme = createTheme();

export default function SignIn () {
	const [error, setError] = useState();
	const navigate = useNavigate();

	const authContext = useContext(AuthContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const request = { email: data.get('email'), password: data.get('password') };
		try {
			const response = await axios.post('http://localhost:4000/login',
				request
			);
			authContext.setCurrentUser(new UserInfo(response.data.token, response.data.user.roleName));
			localStorage.setItem('token', response.data.token);
			navigate('/');
		} catch (err) {
			if (err.response && err.response.status === 400) {
				setError(err.response.data.message);
			} else {
				console.log(err);
				setError('Oops something went wrong...');
			}
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						paddingTop: 4,
						paddingBottom: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<Box
							component="img"
							sx={{
								height: 50,
								width: 70,
								paddingLeft: 1,
								paddingTop: 0.5,
								maxHeight: { xs: 233, md: 167 },
								maxWidth: { xs: 350, md: 250 }
							}}
							alt="HI"
							src="https://i0.wp.com/auralcrave.com/wp-content/uploads/2023/03/cagepascal.jpg?resize=810%2C580&ssl=1"
						/>
					</Avatar>
					<Typography component="h1" variant="h5">
            Sign in
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={<Checkbox value="remember" color="primary" />}
							label="Remember me"
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
              Sign In
						</Button>
					</Box>
				</Box>
				{error &&
            <Alert severity='error'>{error}
            </Alert>
				}
			</Container>
		</ThemeProvider>
	);
}
