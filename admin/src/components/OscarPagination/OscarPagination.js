import React from 'react';
import { useLocation } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import styles from './OscarPagination.module.scss';


function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const OscarPagination = ({ metadata, paginateUrl }) => {
  let query = useQuery();
  const [paginate, setPagination] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);

  React.useEffect(() => {
    setPagination({...metadata});

    let loopCount = metadata?.last_page;
    if (metadata?.last_page > 5) {
      loopCount = 4
    };

    let pageNumber = Number(query.get("page")) || 1;
    setPageNo(pageNumber);
    let data = [];

    for (let number = 1; number <= loopCount; number++) {
      data.push(
        <Pagination.Item key={number} active={number === Number(pageNumber)}>
          {number}
        </Pagination.Item>,
      );
    }
    setItems(data);
  }, [metadata]);

  const changePagination = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= paginate.last_page) {
      let searchNameData = query.get("searchName") ? "&searchName=" + query.get("searchName") : "";
      window.location.href = paginateUrl + pageNumber + searchNameData;
    }
  }

  return (
    <div className={styles.paginationContainer}>
      <Pagination>
        <Pagination.First onClick={(event) => changePagination(1)} />
        <Pagination.Prev onClick={(event) => changePagination(pageNo - 1)} />
        <Pagination onClick={(event) => changePagination(Number(event.target.text))}>{items}</Pagination>
        {paginate?.last_page > 5 &&
          (<>
            <Pagination.Ellipsis />
            <Pagination.Item active={paginate?.last_page === pageNo} onClick={() => changePagination(paginate?.last_page)}>{paginate?.last_page}</Pagination.Item>
          </>)
        }
        <Pagination.Next onClick={(event) => changePagination(pageNo + 1)} />
        <Pagination.Last onClick={(event) => changePagination(Number(paginate?.last_page))} />
      </Pagination>
      <br />
    </div>);
};

export default OscarPagination;