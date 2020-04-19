import React from 'react';
import propTypes from 'prop-types';
import { Colxx } from 'components/common/CustomBootstrap';
import Loading from 'components/Loading';
import CustomSelectInput from 'components/common/CustomSelectInput';
import ReactQuill from 'react-quill';
import Select from 'react-select';
import { Input, FormGroup, Label, Button, Form } from 'reactstrap';
import 'react-quill/dist/quill.snow.css';
const optionData = [
	{ label: 'Montly', value: 1, key: 0 },
	{ label: 'Yearly', value: 2, key: 1 },
	{ label: 'Life Time', value: 3, key: 2 },
];
const quillModules = {
	toolbar: [
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'image'],
		['clean'],
	],
};
const MemberShipPlan = ({
	onSubmit,
	handleInput,
	isEdit = false,
	loading,
	memberShipForm,
}) => {
	return (
		<>
			<Loading loading={loading} />
			<Form onSubmit={onSubmit}>
				<FormGroup row>
					<Colxx sm={12}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Plan Name</Label>
							<Input
								type='text'
								required={true}
								value={memberShipForm.name}
								onChange={({ target }) => handleInput('name', target.value)}
								name='name'
								placeholder='Plan Name'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Plan Amount</Label>
							<Input
								type='number'
								required={true}
								value={memberShipForm.amount}
								onChange={({ target }) => handleInput('amount', target.value)}
								name='amount'
								placeholder='Amount'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Plan Type</Label>
							<Select
								components={{ Input: CustomSelectInput }}
								className='react-select'
								classNamePrefix='react-select'
								name='form-field-name'
								value={optionData.find(
									(value) => value.value === memberShipForm.type
								)}
								onChange={({ value }) => handleInput('type', value)}
								options={optionData}
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={12}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Description</Label>
							<ReactQuill
								toolbar={quillModules}
								value={memberShipForm.description}
								onChange={(value) => handleInput('description', value)}
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
MemberShipPlan.prototype = {
	onSubmit: propTypes.func.isRequired,
	memberShipForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	isEdit: propTypes.bool,
};
export default MemberShipPlan;
