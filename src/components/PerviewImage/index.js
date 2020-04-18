import React from 'react';
import propTypes from 'prop-types';
const PerviewImage = ({ imageUrl }) =>
	imageUrl && <img src={imageUrl} height='100' width='100' />;
PerviewImage.propTypes = {
	imageUrl: propTypes.string.isRequired,
};
export default PerviewImage;
