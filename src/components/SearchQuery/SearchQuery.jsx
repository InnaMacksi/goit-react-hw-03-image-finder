import { Component } from 'react';
import { searchPhoto } from 'Api/api-search';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Loader from 'components/Loader/Loader';
import Button from 'components/Button/Button';
import Modal from 'components/Modal/Modal';
import LargeImage from 'components/LargeImage/LargeImage';
import ButtonUp from 'components/ButtonUp/ButtonUp';
// import Notiflix from 'notiflix';

class SearchQuery extends Component {
  state = {
    search: '',
    items: [],
    loading: false,
    error: null,
    page: 1,
    showModal: false,
    largeImage: null,
  };

componentDidUpdate(prevProps, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.fetchPhotos();
    } 
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { search, page } = this.state;
  //   if (prevState.search !== search || prevState.page !== page) {
  //     this.fetchPhotos();
  //   } else if (prevState.search === search && prevState.items.length > 0){
  //           this.setState(prevState => ({
  //             items: [...prevState.items],
  //           }))};
  // }

  async fetchPhotos() {
    try {
      this.setState({loading: true});
      const { search, page } = this.state;
      const data = await searchPhoto(search, page);
      this.setState(({ items }) => ({items: [...items, ...data.hits]}))
    }
    catch (error) {
      this.setState({ error: error.message })
    }
    finally {this.setState({ loading: false })

    }
  }
  
  searchItems = ({ search }) => {
    this.setState({ search, items: [], page: 1 });
  };

  loadMore = () => {
    this.setState(({ page }) => ({ page: page + 1 }))
    
  }
  
  showLargeImage = ({ largeImageURL, tags }) => {
    this.setState({
      largeImage: {
        largeImageURL,
        tags,
      },
      showModal: true,
    })
  }

  closeModal = () => {
  this.setState({
      largeImage: null,
      showModal: false,
    });
  }
  handleScrollUp = (e)=> {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}
render() {
    const { items, loading, error, showModal, largeImage } = this.state;
    const { searchItems, loadMore, showLargeImage, closeModal, handleScrollUp } = this;
    // console.log(items);
    return (
      <>
        <Searchbar onSubmit={searchItems} />
        <ImageGallery items={items} showLargeImage={showLargeImage} />
        {loading && <Loader/>}
        {error && <p>{error}</p>}
        {Boolean(items.length) && <Button onClick={loadMore} />}
        {items.length > 12 && <ButtonUp onClick={handleScrollUp} />}
        {showModal && <Modal close={closeModal}>
          <LargeImage {...largeImage} />
        </Modal>}
      </>
    );
  }
}

export default SearchQuery;
