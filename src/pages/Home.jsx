import React from 'react';
import qs from 'qs';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';
import Categories from './../components/Categories';
import Sort from './../components/Sort';
import PizzaBlock from './../components/PizzaBlock';
import Skeleton from './../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination';
import { SearchContext } from '../App';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);

  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  //const [currentPage, setCurrentPage] = React.useState(1);
  //const [sortType, setSortType] = React.useState({ name: 'популярности', sortProperty: 'rating' });

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };

  const onChangePage = (number) => dispatch(setCurrentPage(number));

  React.useEffect(() => {
    const search = searchValue ? `&search=${searchValue}` : '';

    setIsLoading(true);
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

    axios
      .get(
        `https://652d06acf9afa8ef4b26a53e.mockapi.io/items?page=${currentPage}&limit=4&${
          categoryId > 0 ? `category=${categoryId}` : ''
        }&sortBy=${sort.sortProperty.replace('-', '')}&order=${
          sort.sortProperty.includes('-') ? 'asc' : 'desc'
        }${search}`,
      )
      .then((res) => {
        setItems(res.data);
        setIsLoading(false);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  React.useEffect(() => {
    const queryString = qs.stringify({
      sortProperty: sort.sortProperty,
      categoryId,
      currentPage,
    });

    navigate(`?${queryString}`);
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
}

export default Home;
