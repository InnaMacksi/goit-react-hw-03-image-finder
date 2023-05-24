import { Component } from 'react';
import { searchPhoto } from 'Api/api-search';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import LargeImage from './LargeImage/LargeImage';
import ButtonUp from './ButtonUp/ButtonUp';
import Notiflix from 'notiflix';

export class App extends Component{

 state = {
    search: '',
    items: [],
    loading: false,
    error: null,
    page: 1,
    showModal: false,
    largeImage: null,
  };  


  onSubmit = (e)=>{
    e.preventDefault();
    
    this.setState({ searchWord: e.target.searchWord.value.trim() })
  }

componentDidUpdate(prevProps, prevState) {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      this.fetchPhotos();
    }
    else if (prevState.search === search) { 
      Notiflix.Notify.info('Please, change your search query.');
      return;
    }
  }
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
  return (
    <div
      style={{
        height: '100vh',
        display: 'bloc',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101'
      }}
    >
        <Searchbar onSubmit={searchItems} />
        <ImageGallery items={items} showLargeImage={showLargeImage} />
        {loading && <Loader/>}
        {error && <p>{error}</p>}
        {Boolean(items.length) && <Button onClick={loadMore} />}
        {items.length > 12 && <ButtonUp onClick={handleScrollUp} />}
        {showModal && <Modal close={closeModal}>
          <LargeImage {...largeImage} />
        </Modal>}
      
    </div>
  );}
};
