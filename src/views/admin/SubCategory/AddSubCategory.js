import React, { Fragment, useState, useReducer } from 'react';
import { Colxx, Separator } from 'components/common/CustomBootstrap';
import { Row, Card, CardBody, CardTitle } from 'reactstrap';
import { addSubCategoryApi } from 'Apis/admin';
import { initialState } from './Constants';
import AddSubCategory from 'containers/forms/AddSubCategory';
import { NotificationManager } from 'components/common/react-notifications';
const AddSubCategoryForm = React.memo(({ history }) => {
	const reducer = (form, action) => {
		switch (action.key) {
			case action.key:
				return { ...form, [action.key]: action.value };
			default:
				throw new Error('Unexpected action');
		}
	};
	const [subCategoryForm, dispatch] = useReducer(reducer, initialState);
	const [loading, setIsLoading] = useState(false);
	const addCategory = (event) => {
		event.preventDefault();
		setIsLoading(true);
		addSubCategoryApi(subCategoryForm)
			.then(() => {
				history.push('/sub-categories');
				NotificationManager.success(
					'Sub Category added successfully',
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
					<h1>Add Sub Category</h1>
					<Separator className='mb-5' />
				</Colxx>
			</Row>
			<Row className='mb-4'>
				<Colxx xxs='12'>
					<Card>
						<CardBody>
							<CardTitle>Add sub Category</CardTitle>
							<AddSubCategory
								onSubmit={addCategory}
								loading={loading}
								SubCategoryForm={subCategoryForm}
								handleInput={handleInput}
							/>
						</CardBody>
					</Card>
				</Colxx>
			</Row>
		</Fragment>
	);
});

export default AddSubCategoryForm;
