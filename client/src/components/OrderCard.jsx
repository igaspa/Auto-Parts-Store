import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { useContext } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { orderStatusDisplay } from '../utils/helper';

export default function OrderCard ({ order, onChangeCallback }) {
	const navigate = useNavigate();
	const authContext = useContext(AuthContext);
	const role = authContext.currentUser !== null ? authContext.currentUser.role : false;

	const handleClickConfirm = async (id) => {
		const jwt = localStorage.getItem('token');
		const config = {
			headers: { Authorization: `Bearer ${jwt}` }
		};
		await axios.put(`http://localhost:4000/order/confirm/${id}`, {}, config);
		await onChangeCallback();
	};

	const handleClickComplete = async (id) => {
		const jwt = localStorage.getItem('token');
		const config = {
			headers: { Authorization: `Bearer ${jwt}` }
		};
		await axios.put(`http://localhost:4000/order/complete/${id}`, {}, config);
		await onChangeCallback();
	};

	OrderCard.propTypes = {
		order: PropTypes.object,
		onChangeCallback: PropTypes.func
	};

	const handleClickItem = () => {
		navigate('/pending-items');
	};

	const buttonOnOrder = (order) => {
		if (role === 'Salesperson') {
			if (order.orderStatus === 'pending_confirmation') {
				return (
					<Button color="primary" onClick={() => { handleClickConfirm(order.id); }}>Confirm Order</Button>
				);
			} else if (order.orderStatus === 'ready_for_pickup') {
				return (
					<Button color="primary" onClick={() => { handleClickComplete(order.id); }}>Complete Order</Button>
				);
			} else if (order.orderStatus === 'pending_delivery') {
				return (
					<Button color="primary" onClick={() => { handleClickItem(); }}>Pending Items</Button>
				);
			}
		}
	};

	return (
		<Paper
			sx={{
				p: 2,
				margin: '2%',
				padding: '4%',
				maxWidth: 500,
				flexGrow: 1
			}}
		>
			<Grid
				container
				spacing={2}
				direction="column"
				alignItems="center"
				justify="center"
			>
				<Grid item xs={12} container>
					<Grid item xs={6} alignContent="center">
						<Typography variant='h5'>Customer:</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h5'>{order.user.fullName}</Typography>
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={6} alignContent="center">
						<Typography variant='h5'>Order Number:</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='p'>{order.id}</Typography>
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={6} alignContent="center">
						<Typography variant='h5'>Ordered Date:</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='p'>{order.orderDate}</Typography>
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={6} alignContent="center">
						<Typography variant='h5'>Status:</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='p'> {orderStatusDisplay[order.orderStatus]}</Typography>
					</Grid>
				</Grid>
				<Grid item xs={12} container>
					<Grid item xs={6} alignContent="center">
						<Typography variant='h5'>Price:</Typography>
					</Grid>
					<Grid item xs={6}>
						<Typography variant='h5'>{order.finalPrice} {order.currency}</Typography>
					</Grid>
				</Grid>
				<Grid item xs={12} marginTop={3} >
					{ buttonOnOrder(order) }
				</Grid>
			</Grid>
		</Paper>
	);
}
