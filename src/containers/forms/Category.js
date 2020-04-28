import React, { useState } from 'react';
import propTypes from 'prop-types';
import PerviewImage from 'components/PerviewImage';
import { Colxx } from 'components/common/CustomBootstrap';
import Loading from 'components/Loading';
import { Input, FormGroup, Label, Button, Form } from 'reactstrap';
const AddCategory = ({
	onSubmit,
	handleInput,
	isEdit = false,
	loading,
	CategoryForm,
}) => {
	const [viweImage, setViewImage] = useState(isEdit ? CategoryForm.image : '');
	return (
		<>
			<Loading loading={loading} />
			<Form onSubmit={onSubmit}>
				<FormGroup row>
					<Colxx sm={12}>
						<FormGroup>
							<Label for='exampleEmailGrid'>Category Name</Label>
							<Input
								type='text'
								required={true}
								value={CategoryForm.name}
								onChange={({ target }) => handleInput('name', target.value)}
								name='name'
								placeholder='Name'
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<FormGroup>
							<Label for='examplePasswordGrid'>Image</Label>
							<Input
								className='form-control'
								type='file'
								onChange={({ target }) => {
									handleInput('image', target.files[0]);
									setViewImage(URL.createObjectURL(target.files[0]));
								}}
								name='profile'
								required={isEdit ? false : true}
							/>
						</FormGroup>
					</Colxx>
					<Colxx sm={6}>
						<PerviewImage imageUrl={viweImage} />
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
AddCategory.prototype = {
	onSubmit: propTypes.func.isRequired,
	CategoryForm: propTypes.object.isRequired,
	handleInput: propTypes.func.isRequired,
	loading: propTypes.bool.isRequired,
	isEdit: propTypes.bool,
};
export default AddCategory;
