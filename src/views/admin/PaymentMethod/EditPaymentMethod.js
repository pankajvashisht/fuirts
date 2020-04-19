import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { EditPaymentTypes } from 'Apis/admin';
import AddPaymentMethod from 'containers/forms/AddPaymentMethod';
import { NotificationManager } from 'components/common/react-notifications';
const EditPaymentType = React.memo(({ history, location }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const initialState = { ...location.state.types };
	const [paymentForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addPaymentForm = (event) => {
		event.preventDefault();
		setIsLoading(true);
		EditPaymentTypes(paymentForm)
			.then(() => {
				history.push('/payment-methods');
				NotificationManager.success(
					'Payment method Edit successfully',
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
					<h1>Edit Payment Method ({paymentForm.name})</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Edit Payment Method</CardTitle>
							<AddPaymentMethod
								onSubmit={addPaymentForm}
								loading={loading}
								isEdit
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

export default EditPaymentType;
