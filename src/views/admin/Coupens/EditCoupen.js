import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { editGift as EditExitGift } from 'Apis/admin';
import Coupen from 'containers/forms/Coupen';
import { NotificationManager } from 'components/common/react-notifications';
const EditCoupen = React.memo(({ history, location }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const initialState = { ...location.state.coupen };
	const [coupenForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addCoupenForm = (event) => {
		event.preventDefault();
		setIsLoading(true);
		EditExitGift(coupenForm)
			.then(() => {
				history.push('/coupens');
				NotificationManager.success(
					'Coupen Edit successfully',
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
					<h1>Edit Coupen ({coupenForm.name})</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Edit Coupen</CardTitle>
							<Coupen
								onSubmit={addCoupenForm}
								loading={loading}
								coupenForm={coupenForm}
								isEdit
								handleInput={handleInput}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default EditCoupen;
