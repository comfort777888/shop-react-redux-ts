import React from 'react';
import qs from 'qs';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import { setCategoryId, setCurrentPage, setFilters } from '../redux/slices/filterSlice';
import { fetchPizzas } from '../redux/slices/pizzasSlice';
import Categories from './../components/Categories';
import Sort, { sortList } from './../components/Sort';
import PizzaBlock from './../components/PizzaBlock';
import Skeleton from './../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { items, status } = useSelector((state) => state.pizzas);
  const { categoryId, sort, currentPage, searchValue } = useSelector((state) => state.filter);

  //const [items, setItems] = React.useState([]);
  //const [isLoading, setIsLoading] = React.useState(true);

  //const [currentPage, setCurrentPage] = React.useState(1);
  //const [sortType, setSortType] = React.useState({ name: 'популярности', sortProperty: 'rating' });

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => dispatch(setCurrentPage(number));

  const getPizzas = async () => {
    // axios
    //   .get(
    //     `https://652d06acf9afa8ef4b26a53e.mockapi.io/items?page=${currentPage}&limit=4&${
    //       categoryId > 0 ? `category=${categoryId}` : ''
    //     }&sortBy=${sort.sortProperty.replace('-', '')}&order=${
    //       sort.sortProperty.includes('-') ? 'asc' : 'desc'
    //     }${search}`,
    //   )
    //   .then((res) => {
    //     setItems(res.data);
    //     setIsLoading(false);
    //   })
    //   .catch((err) => {
    //     setIsLoading(false);
    //   });

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(fetchPizzas({ sortBy, order, category, search, currentPage }));
  };

  //Если был первый рендер, то проверяем URL-параметры и сохраняем в redux
  React.useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );
      isSearch.current = true;
    }
  }, []);

  //Если был первый рендер, то запрашиваем пиццы
  React.useEffect(() => {
    // fetch(
    //   `https://652d06acf9afa8ef4b26a53e.mockapi.io/items?page=${currentPage}&limit=4&${
    //     categoryId > 0 ? `category=${categoryId}` : ''
    //   }&sortBy=${sort.sortProperty.replace('-', '')}&order=${
    //     sort.sortProperty.includes('-') ? 'asc' : 'desc'
    //   }${search}`,
    // )
    //   .then((res) => {
    //     return res.json();
    //   })
    //   .then((json) => {
    //     setItems(json);
    //     setIsLoading(false);
    //   });
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      getPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  //Если изменились параметры и был первый рендер
  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });
      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, currentPage]);

  const pizzas = items.map((obj) => (
    <Link key={obj.id} to={`/pizza/${obj.id}`}>
      <PizzaBlock {...obj} />
    </Link>
  ));
  const skeletons = [...new Array(4)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка 😕</h2>
          <p>К сожалению, не удалось получить пиццы. Попробуйте повторить попытку позже.</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}

      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
}

export default Home;
