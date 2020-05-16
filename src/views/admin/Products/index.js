import React, { Fragment, useState, useEffect } from 'react';
import ListPageHeading from 'containers/pages/ListPageHeading';
import Pagination from 'containers/pages/Pagination';
import { Modal, ModalHeader, ModalBody, CardImg } from 'reactstrap';
import { products } from 'Apis/admin';
import { NotificationManager } from 'components/common/react-notifications';
import { Link } from 'react-router-dom';
import StatusUpdate from 'components/UpdateStatus';
import DeleteData from 'components/DeleteData';
import { convertDate } from 'constants/defaultValues';
import { additional } from './Constants';
const Products = React.memo(({ match, history }) => {
	const [pageInfo, setPageInfo] = useState(additional);
	const [totalProducts, setTotalProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPageSize, setSelectedPageSize] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [searchText, setSearchtext] = useState(undefined);
	const [showModel, setShowModel] = useState(false);
	const [imageView, setImageView] = useState('');
	useEffect(() => {
		products(currentPage, selectedPageSize, 0, searchText)
			.then((res) => {
				const { data } = res;
				const { result, pagination } = data.data;
				setIsLoading(false);
				setTotalProducts(result);
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
		totalProducts.splice(key, 1);
		setTotalProducts([...totalProducts]);
	};
	const updateLocal = (value, key) => {
		totalProducts[key] = value;
		setTotalProducts([...totalProducts]);
	};
	const startIndex = (currentPage - 1) * selectedPageSize;
	const endIndex = currentPage * selectedPageSize;
	return isLoading ? (
		<div className='loading' />
	) : (
		<Fragment>
			<ListPageHeading
				match={match}
				heading='Products'
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
						<th>Product Name</th>
						<th>Product Image</th>
						<th>Shop Name</th>
						<th>Price</th>
						<th>Stock</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{totalProducts.map((product, key) => (
						<>
							<tr key={key}>
								<td>{key + 1}</td>
								<td>
									<Link
										to={{
											pathname: '/product-details',
											state: { product },
										}}
										className='d-flex'
									>
										{' '}
										{product.name}
									</Link>
								</td>
								<td>
									<img
										onClick={() => {
											setShowModel(true);
											setImageView(product.image || '/assets/img/logo.jpeg');
										}}
										alt={product.name}
										src={product.image || '/assets/img/logo.jpeg'}
										className='list-thumbnail responsive border-0 card-img-left'
									/>
								</td>
								<td>{product.shop_name}</td>
								<td>{product.price}</td>
								<td>{product.stock}</td>
								<td>
									<StatusUpdate
										table='products'
										onUpdate={(data) => updateLocal(data, key)}
										data={product}
									/>
								</td>
								<td>{convertDate(product.created)}</td>
								<td>
									<Link
										to={{
											pathname: '/product-details',
											state: { product },
										}}
										className='btn btn-info btn-sm'
									>
										View
									</Link>{' '}
									<DeleteData
										classes='btn-sm'
										table='products'
										view='Product'
										data={product.id}
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
			<Modal isOpen={showModel} size='lg' toggle={() => setShowModel(false)}>
				<ModalHeader toggle={() => setShowModel(false)}>
					Image Preview
				</ModalHeader>
				<ModalBody>
					<CardImg top alt={imageView} src={imageView} />
				</ModalBody>
			</Modal>
		</Fragment>
	);
});

export default Products;
