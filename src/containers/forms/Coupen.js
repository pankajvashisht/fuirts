import React from 'react';
import propTypes from 'prop-types';
import { Colxx } from 'components/common/CustomBootstrap';
import Loading from 'components/Loading';
import { minDate } from 'helpers/Utils';
import { Input, FormGroup, Label, Button, Form } from 'reactstrap';
const Coupen = ({
	onSubmit,
	handleInput,
	isEdit = false,
	loading,
	coupenForm,
}) => {
	return (
		<>
			<Loading loading={loading} />
			<Form onSubmit={onSubmit}>
				<FormGroup row>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Coupen Name</Label>
							<Input
								type='text'
								required={true}
								value={coupenForm.name}
								onChange={({ target }) => handleInput('name', target.value)}
								name='name'
								placeholder='Coupen Name'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Discount %</Label>
							<Input
								type='number'
								required={true}
								value={coupenForm.discount}
								onChange={({ target }) => handleInput('discount', target.value)}
								name='discount'
								placeholder='Discount %'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Start Date</Label>
							<Input
								type='date'
								required={true}
								min={minDate()}
								value={isEdit ? minDate(coupenForm.start_time) : minDate()}
								onChange={({ target }) =>
									handleInput('start_time', target.value)
								}
								name='start_time'
								placeholder='Start Date'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>End Date</Label>
							<Input
								type='date'
								required={true}
								value={isEdit ? minDate(coupenForm.end_time) : minDate()}
								onChange={({ target }) => handleInput('end_time', target.value)}
								name='end_time'
								placeholder='End Date'
							/>
						</FormGroup>
					</Colxx>
				</FormGroup>

				<Button
					disabled={loading}
					type='submit'
					className={`btn-shadow btn-multiple-state ${
						loading ? 'show-spinner' : ''
					}`}
					color='primary'
				>
					{isEdit ? 'Update' : 'Save'}
				</Button>
			</Form>
		</>
	);
};
Coupen.prototype = {
	onSubmit: propTypes.func.isRequired,
	coupenForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	isEdit: propTypes.bool,
};
export default Coupen;
