import { Component } from 'react';
import LoaderView from './components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import fetchImage from './services/imagesApi';
import Searchbar from './components/Searchbar';
import ImageGallery from './components/ImageGallery';
import Modal from './components/Modal';
import Button from './components/Button';
import 'react-toastify/dist/ReactToastify.css';
import s from './App.module.css';

class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    totalHits: 0,
    largeImageURL: '',
    page: 1,
    error: null,
    isLoading: false,
    showModal: false,
    showButton: false,
    message: '',
    targetImage: null,
  };

  componentDidMount() {
    this.searchImages();
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;
    if (prevState.searchQuery !== searchQuery) {
      this.searchImages(searchQuery, 1);
      this.setState({ page: 1 });
    }
    if (prevState.page !== page) {
      this.searchImages(searchQuery, page);
    }
  }

  searchImages(searchQuery = '', page = 1) {
    if (searchQuery !== '') {
      this.setState({
        isLoading: true,
      });

      fetchImage(searchQuery, page)
        .then(data => {
          if (page === 1) {
            this.setState({ totalHits: data.totalHits, images: data.hits });
          } else {
            this.setState(prevState => ({
              images: [...prevState.images, ...data.hits],
            }));
            this.onScrollPage();
          }
          this.onCheckButton();
        })
        .catch(error =>
          this.setState({ error: 'Smth went wrong:( please try again' }),
        )
        .finally(() => this.setState({ isLoading: false }));
    } else {
      this.setState({
        images: [],
        showButton: false,
      });
    }
  }

  onSubmit = value => {
    this.setState({ searchQuery: value });
  };

  onIncrementPage = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  onScrollPage = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.clientHeight,
        behavior: 'smooth',
      });
    }, 1200);
  };

  onCheckButton = () => {
    const { totalHits, images } = this.state;
    if (totalHits > images.length) {
      this.setState({ showButton: true });
    } else {
      this.setState({ showButton: false });
    }
    if (!totalHits) {
      toast.error('No result:( try smth else');
      return;
    }
  };

  toggleModal = ({ status, src, alt }) => {
    if (status) {
      this.setState({
        targetImage: { src, alt },
        showModal: true,
      });
    } else {
      this.setState({
        targetImage: null,
        showModal: false,
      });
    }
  };

  render() {
    const {
      images,
      isLoading,
      showModal,
      targetImage,
      showButton,
    } = this.state;
    
    return (
      <div className={s.app}>
        <Searchbar onSubmit={this.onSubmit} />
        {isLoading && <LoaderView />}
        {images.length > 0 && (
          <ImageGallery images={images} toggleModal={this.toggleModal} />
        )}
        {showModal && (
          <Modal
            src={targetImage.src}
            alt={targetImage.alt}
            toggleModal={this.toggleModal}
          />
        )}
        {showButton && <Button onClick={this.onIncrementPage} />}
        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}
export default App;
