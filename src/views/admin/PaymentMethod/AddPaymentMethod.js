import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { addPaymentTypes } from 'Apis/admin';
import { initialState } from './Constants';
import AddPaymentMethod from 'containers/forms/AddPaymentMethod';
import { NotificationManager } from 'components/common/react-notifications';
const AddPaymentType = React.memo(({ history }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const [paymentForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addPaymentForm = (event) => {
		event.preventDefault();
		setIsLoading(true);
		addPaymentTypes(paymentForm)
			.then(() => {
				history.push('/payment-methods');
				NotificationManager.success(
					'Payment method added successfully',
					'Success',
					3000,
					null,
					null,
					''
				);
			})
			.catch((err) => {
				if (err.response) {
					const { data } = err.response;
					NotificationManager.warning(
						data.error_message,
						'Something went wrong',
						3000,
						null,
						null,
						''
					);
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleInput = (key, value) => {
		dispatch({ key, value });
	};
	return (
		<Fragment>
			<Row>
				<Colxx xxs='12'>
					<h1>Add Payment Method</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Add Payment Method</CardTitle>
							<AddPaymentMethod
								onSubmit={addPaymentForm}
								loading={loading}
								paymentForm={paymentForm}
								handleInput={handleInput}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddPaymentType;
