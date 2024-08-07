import Modal from 'react-modal';
import css from './Modal.module.css';

Modal.setAppElement('#root');

const ImageModal = ({ modalClose, modalOpen, image }) => {
  return (
    <Modal
      onRequestClose={modalClose}
      isOpen={modalOpen}
      contentLabel="PopUp window"
      className={css.overlay}
    >
      <div className={css.modal}>
        <img className={css.bigImage} src={image} alt="" />
      </div>
    </Modal>
  );
};
export default ImageModal;
