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
const Gifts = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalGifts, setTotalGifts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		getGiftList(0, currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalGifts(result);
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
		totalGifts.splice(key, 1);
		setTotalGifts([...totalGifts]);
	};
	const updateLocal = (value, key) => {
		totalGifts[key] = value;
		setTotalGifts([...totalGifts]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Gifts'
				addShow
				Addname='+ Add New Gift'
				onClick={() => history.push('/add-gift')}
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
						<th>Gift Name</th>
						<th>Gift Price</th>
						<th>Total Apply</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalGifts.map((gift, key) => (
						<>
							<tr>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-gifts',
											state: { gift },
										}}
										className='d-flex'
									>
										{' '}
										{gift.name}
									</Link>
								</td>
								<td>
									<Link
										to={{
											pathname: '/edit-gifts',
											state: { gift },
										}}
										className='d-flex'
									>
										{gift.price}
									</Link>
								</td>
								<td>{gift.total_apply}</td>
								<td>
									<StatusUpdate
										table='coupons'
										onUpdate={(data) => updateLocal(data, key)}
										data={gift}
									/>
								</td>
								<td>{convertDate(gift.created)}</td>
								<td>
									<Link
										to={{
											pathname: '/edit-gifts',
											state: { gift },
										}}
										className='btn btn-info btn-sm'
									>
										Edit
									</Link>{' '}
									<DeleteData
										classes='btn-sm'
										table='coupons'
										view='Gifts'
										data={gift.id}
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

export default Gifts;
