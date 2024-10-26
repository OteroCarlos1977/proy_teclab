// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useContext } from 'react';
import Modal from './Modal';

const ModalContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => useContext(ModalContext);

// eslint-disable-next-line react/prop-types
export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [data, setData] = useState(null);

  const openModal = (msg, additionalData = null) => {
    setMessage(msg);
    setData(additionalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setMessage('');
    setData(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} message={message} data={data} onClose={closeModal} />
    </ModalContext.Provider>
  );
};
