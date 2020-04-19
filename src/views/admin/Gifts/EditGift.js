import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { editGift as EditExitGift } from 'Apis/admin';
import Gift from 'containers/forms/Gift';
import { NotificationManager } from 'components/common/react-notifications';
const EditGifts = React.memo(({ history, location }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const initialState = { ...location.state.gift };
	const [giftForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addGiftForm = (event) => {
		event.preventDefault();
		setIsLoading(true);
		EditExitGift(giftForm)
			.then(() => {
				history.push('/gifts');
				NotificationManager.success(
					'Gift Edit successfully',
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
					<h1>Edit Gift ({giftForm.name})</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Edit Gift</CardTitle>
							<Gift
								onSubmit={addGiftForm}
								loading={loading}
								giftForm={giftForm}
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

export default EditGifts;
