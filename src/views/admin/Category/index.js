import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import { getCategory } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import DeleteData from 'components/DeleteData';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const Categories = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalCategories, setTotalCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		getCategory(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalCategories(result);
				additional.totalItemCount = pagination.totalRecord;
				additional.selectedPageSize = pagination.limit;
				additional.totalPage = pagination.totalPage;
				setPageInfo({ ...additional });
			})
			.catch((err) => {
				setIsLoading(false);
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
			});
	}, [selectedPageSize, currentPage, searchText]);
	const onSearchKey = (event) => {
		setSearchtext(event.target.value);
	};
	const changePageSize = (value) => {
		setIsLoading(true);
		setSelectedPageSize(value);
	};
	const onChangePage = (value) => {
		setCurrentPage(value);
	};
	const DeleteDataLocal = (key) => {
		totalCategories.splice(key, 1);
		setTotalCategories([...totalCategories]);
	};
	const updateLocal = (value, key) => {
		totalCategories[key] = value;
		setTotalCategories([...totalCategories]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Categories'
				addShow
				Addname='+ Add New Category'
				onClick={() => history.push('/add-category')}
				changePageSize={changePageSize}
				selectedPageSize={selectedPageSize}
				totalItemCount={pageInfo.totalItemCount}
				startIndex={startIndex}
				endIndex={endIndex}
				onSearchKey={onSearchKey}
				orderOptions={pageInfo.orderOptions}
				pageSizes={pageInfo.pageSizes}
			/>
			<table className='table table-striped'>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Image</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalCategories.map((category, key) => (
						<>
							<tr>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit',
											state: { category },
										}}
										className='d-flex'
									>
										{' '}
										{category.name}
									</Link>
								</td>
								<td>
									<Link
										to={{
											pathname: '/edit-payment-type',
											state: { category },
										}}
										className='d-flex'
									>
										<img
											alt={category.name}
											src={category.image}
											className='list-thumbnail responsive border-0 card-img-left'
										/>
									</Link>
								</td>
								<td>
									<StatusUpdate
										table='categories'
										onUpdate={(data) => updateLocal(data, key)}
										data={category}
									/>
								</td>
								<td>{convertDate(category.created)}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-category',
											state: { category },
										}}
										className='btn btn-info btn-sm'
									>
										Edit
									</Link>{' '}
									<DeleteData
										classes='btn-sm'
										table='categories'
										view='Category'
										data={category.id}
										ondelete={() => DeleteDataLocal(key)}
									>
										Delete
									</DeleteData>
								</td>
							</tr>
						</>
					))}
				</tbody>
			</table>
			<Pagination
				currentPage={currentPage}
				totalPage={pageInfo.totalPage}
				onChangePage={(i) => onChangePage(i)}
			/>
		</Fragment>
	);
});

export default Categories;
