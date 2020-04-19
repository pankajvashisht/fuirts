import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import { getGiftList } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import DeleteData from 'components/DeleteData';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const Coupens = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalCoupens, setTotalCoupens] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		getGiftList(1, currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalCoupens(result);
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
		totalCoupens.splice(key, 1);
		setTotalCoupens([...totalCoupens]);
	};
	const updateLocal = (value, key) => {
		totalCoupens[key] = value;
		setTotalCoupens([...totalCoupens]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Coupens'
				addShow
				Addname='+ Add New Coupen'
				onClick={() => history.push('/add-coupen')}
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
						<th>Coupens Name</th>
						<th>Discount %</th>
						<th>Start Date</th>
						<th>End Date</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalCoupens.map((coupen, key) => (
						<>
							<tr>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-coupens',
											state: { coupen },
										}}
										className='d-flex'
									>
										{' '}
										{coupen.name}
									</Link>
								</td>
								<td>
									<Link
										to={{
											pathname: '/edit-coupens',
											state: { coupen },
										}}
										className='d-flex'
									>
										{coupen.discount}
									</Link>
								</td>
								<td>{convertDate(coupen.start_time)}</td>
								<td>{convertDate(coupen.end_time)}</td>
								<td>
									<StatusUpdate
										table='coupons'
										onUpdate={(data) => updateLocal(data, key)}
										data={coupen}
									/>
								</td>
								<td>{convertDate(coupen.created)}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-coupens',
											state: { coupen },
										}}
										className='btn btn-info btn-sm'
									>
										Edit
									</Link>{' '}
									<DeleteData
										classes='btn-sm'
										table='coupons'
										view='coupen'
										data={coupen.id}
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

export default Coupens;
