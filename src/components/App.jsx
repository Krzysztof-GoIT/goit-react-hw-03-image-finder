import { Component } from 'react';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { SearchBar } from './SearchBar/SearchBar';
import { Button } from './Button/Button';
import { getAPI } from '../pixabay-api';
import { Loader } from './Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    search: '',
    page: 1,
    images: [],
    isLoading: false,
    isError: false,
    isEnd: false,
  };

  componentDidUpdate = async (_prevProps, prevState) => {
    const { search, page } = this.state;
    if (prevState.search !== search || prevState.page !== page) {
      await this.fetchImages(search, page);
    }
  };

  fetchImages = async (search, page) => {
    try {
      this.setState({ isLoading: true });

      const fetchedImages = await getAPI(search, page);

      const { hits, totalHits } = fetchedImages;

      console.log(hits, totalHits);
      if (hits.length === 0) {
        toast.error(
          'Sorry, there are no images matching your search query. please try again.'
        );
        return;
      }
      if (page === 1) {
        toast.success(`Hooray! We found ${totalHits} images!`);
      }
      if (page * 12 >= totalHits) {
        this.setState({ isEnd: true });
        toast("We're sorry, but you've reached the end of search results.");
      }

      this.setState(prevState => ({
        images: [...prevState.images, ...hits],
      }));
    } catch {
      this.setState({ isError: true });
      toast.error('Oops, something went wrong! Reload this page!');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    const { search } = this.state;
    const newSearch = e.target.search.value.trim().toLowerCase();

    if (newSearch !== search) {
      this.setState({ search: newSearch, page: 1, images: [] });
    }
  };

  handleClick = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { images, isLoading, isError, isEnd } = this.state;
    return (
      <div className="main-wrapper">
        <SearchBar onSubmit={this.handleSubmit} />

        {images.length >= 1 && <ImageGallery photos={images} />}
        {images.length >= 2 && !isEnd && <Button onClick={this.handleClick} />}
        {isLoading && <Loader />}
        {isError && toast.error('Oops, something went wrong!')}
        <Toaster position="top-left" reverseOder={false} />
      </div>
    );
  }
}
