import React, { Fragment, useState } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
const ProductDetails = ({ location: { state = {} } }) => {
	const [productDetails] = useState({ ...state.product });
	return (
		<Fragment>
			<Card>
				<CardHeader>
					<h1 style={{ paddingTop: '31px' }}> Product Details </h1>
				</CardHeader>
			</Card>
			<CardBody>
				<div>
					<b> Name </b> : {productDetails.name}
				</div>
				<hr />
				<div>
					<b> Shop name </b> : {productDetails.shop_name}
				</div>
				<hr />
				<div>
					<b> Category Name </b> : {productDetails.category_name}
				</div>
				<hr />
				<div>
					<b> Stock </b> : {productDetails.stock}
				</div>
				<hr />
				<div>
					<b> Description </b> : {productDetails.description}
				</div>

				<hr />
			</CardBody>
		</Fragment>
	);
};

export default ProductDetails;
