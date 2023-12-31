import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const FilterManufacturer = ({ onChange }) => {
	const [manufacturer, setManufacturer] = useState([]);
	useEffect(() => {
		async function fetchData () {
			try {
				const response = await axios.get('http://localhost:4000/manufacturer');
				setManufacturer(response.data);
			} catch (err) {
				console.log(err);
			}
		}
		fetchData();
	}, []);

	FilterManufacturer.propTypes = {
		onChange: PropTypes.func
	};

	return (
		<Stack spacing={3} sx={{ width: 200 }}>
			<Autocomplete
				id="tags-outlined"
				options={manufacturer}
				getOptionLabel={(option) => option.brand}
				isOptionEqualToValue={(option, value) => option.brand === value.brand}
				onChange={onChange}
				renderInput={(params) => (
					<TextField
						{...params}
						placeholder="Manufacturer"
					/>
				)}
			/>
		</Stack>
	);
};

export default FilterManufacturer;
