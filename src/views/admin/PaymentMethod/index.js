import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import { paymentMethod } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import DeleteData from 'components/DeleteData';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const PaymentTypes = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalMethods, setTotalMethods] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		paymentMethod(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalMethods(result);
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
		totalMethods.splice(key, 1);
		setTotalMethods([...totalMethods]);
	};
	const updateLocal = (value, key) => {
		totalMethods[key] = value;
		setTotalMethods([...totalMethods]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Payment Type'
				addShow
				Addname='+ Add New Method'
				onClick={() => history.push('/add-payment-method')}
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
						<th>Logo</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalMethods.map((types, key) => (
						<>
							<tr>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-payment-type',
											state: { types },
										}}
										className='d-flex'
									>
										{' '}
										{types.name}
									</Link>
								</td>
								<td>
									<Link
										to={{
											pathname: '/edit-payment-type',
											state: { types },
										}}
										className='d-flex'
									>
										<img
											alt={types.name}
											src={types.logo}
											className='list-thumbnail responsive border-0 card-img-left'
										/>
									</Link>
								</td>
								<td>
									<StatusUpdate
										table='payment_types'
										onUpdate={(data) => updateLocal(data, key)}
										data={types}
									/>
								</td>
								<td>{convertDate(types.created)}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-payment-type',
											state: { types },
										}}
										className='btn btn-info btn-sm'
									>
										Edit
									</Link>{' '}
									<DeleteData
										classes='btn-sm'
										table='payment_types'
										view='Payment Method'
										data={types.id}
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

export default PaymentTypes;
