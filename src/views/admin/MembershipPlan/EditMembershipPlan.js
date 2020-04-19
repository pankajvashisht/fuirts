import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { editMemberShipPlan } from 'Apis/admin';
import MembershipPlan from 'containers/forms/MembershipPlan';
import { NotificationManager } from 'components/common/react-notifications';
const EditMemberShip = React.memo(({ history, location }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const initialState = { ...location.state.plans };
	const [memberShipForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addPlanForm = (event) => {
		event.preventDefault();
		setIsLoading(true);
		editMemberShipPlan(memberShipForm)
			.then(() => {
				history.push('/membership-plans');
				NotificationManager.success(
					'Plan Edit successfully',
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
					<h1>Edit Plan ({memberShipForm.name})</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Edit Plan</CardTitle>
							<MembershipPlan
								onSubmit={addPlanForm}
								loading={loading}
								isEdit
								memberShipForm={memberShipForm}
								handleInput={handleInput}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default EditMemberShip;
