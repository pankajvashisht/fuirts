import React from 'react';
import propTypes from 'prop-types';
import { Colxx } from 'components/common/CustomBootstrap';
import Loading from 'components/Loading';
import { Input, FormGroup, Label, Button, Form } from 'reactstrap';
const Gift = ({ onSubmit, handleInput, isEdit = false, loading, giftForm }) => {
	return (
		<>
			<Loading loading={loading} />
			<Form onSubmit={onSubmit}>
				<FormGroup row>
					<Colxx sm={12}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Gift Name</Label>
							<Input
								type='text'
								required={true}
								value={giftForm.name}
								onChange={({ target }) => handleInput('name', target.value)}
								name='name'
								placeholder='Gift Name'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Gift Price</Label>
							<Input
								type='number'
								required={true}
								value={giftForm.price}
								onChange={({ target }) => handleInput('price', target.value)}
								name='price'
								placeholder='Price'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Total Apply</Label>
							<Input
								type='number'
								required={true}
								value={giftForm.total_apply}
								onChange={({ target }) =>
									handleInput('total_apply', target.value)
								}
								name='total_apply'
								placeholder='Total Apply'
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
Gift.prototype = {
	onSubmit: propTypes.func.isRequired,
	giftForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	isEdit: propTypes.bool,
};
export default Gift;
