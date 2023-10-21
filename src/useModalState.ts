import { useState } from "react";

export const useModalState = () => {
  const [modals, setModals] = useState({
    upgradeModalOpen: false,
    historyModalOpen: false,
    helpModalOpen: false,
    menuModalOpen: false,
    mushroomStoreModalOpen: false,
    ladybugModalOpen: false,
    reportModalOpen: false,
    textboxModalOpen: false,
    // ... any other modal states
  });

  const handleOpenModal = (modalName: string) => {
    setModals({
      ...modals,
      [modalName]: true,
    });
  };

  const handleCloseModal = (modalName: string) => {
    setModals({
      ...modals,
      [modalName]: false,
    });
  };

  return {
    modals,
    handleOpenModal,
    handleCloseModal,
  };
};
