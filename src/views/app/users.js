import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from '../../containers/pages/ListPageHeading';
import Pagination from '../../containers/pages/Pagination';
import { users } from '../../Apis/admin';
import { NotificationManager } from '../../components/common/react-notifications';
import { Card } from 'reactstrap';
import { NavLink, Link } from 'react-router-dom';
import classnames from 'classnames';
import { ContextMenuTrigger } from 'react-contextmenu';
import { Colxx } from '../../components/common/CustomBootstrap';
import StatusUpdate from '../../components/UpdateStatus';
import DeleteData from '../../components/DeleteData';
import { convertDate } from '../../constants/defaultValues';
const additional = {
	currentPage: 1,
	totalItemCount: 0,
	totalPage: 1,
	search: '',
	pageSizes: [10, 20, 50, 100],
};
const Users = React.memo((props) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalPosts, setTotalPost] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	useEffect(() => {
		users(currentPage, selectedPageSize, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalPost(result);
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
	const onCheckItem = (key, value) => {};
	const DeleteDataLocal = (key) => {
		totalPosts.splice(key, 1);
		setTotalPost([...totalPosts]);
	};
	const updateLocal = (value, key) => {
		totalPosts[key] = value;
		setTotalPost([...totalPosts]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={props.match}
				heading='Users'
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
						<th>Profile</th>
						<th>Email</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalPosts.map((post, key) => (
						<>
							<tr>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/user-details',
											state: { post },
										}}
										className='d-flex'
									>
										{' '}
										{post.name}
									</Link>
								</td>
								<td>
									<Link
										to={{
											pathname: '/user-details',
											state: { post },
										}}
										className='d-flex'
									>
										<img
											alt={post.name}
											src={post.profile}
											className='list-thumbnail responsive border-0 card-img-left'
										/>
									</Link>
								</td>
								<td>{post.email}</td>
								<td>
									<StatusUpdate
										table='users'
										onUpdate={(data) => updateLocal(data, key)}
										data={post}
									/>
								</td>
								<td>{convertDate(post.created)}</td>
								<td>
									<DeleteData
										table='users'
										data={post.id}
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

export default Users;
