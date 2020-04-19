import React from 'react';
import Loader from 'react-loader-spinner';
import propTypes from 'prop-types';

const Loading = ({ loading }) => (
	<div className='loading-react'>
		<Loader
			visible={loading}
			type='Puff'
			color='#61a42a'
			height={100}
			width={100}
		/>
	</div>
);
Loading.propTypes = {
	loading: propTypes.bool.isRequired,
};
export default Loading;
