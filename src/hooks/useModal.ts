import { useState } from "react";
import { create } from "zustand";

// dùng riêng
const useModal = () => {
  const [open, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  return { open, openModal, closeModal };
};

// dùng chung
const toggleModal = () => {
  return create((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  }));
};

const useAuthModal = toggleModal();
const useSubscribeModal = toggleModal();
const useAdModal = toggleModal();

export { useModal, useAuthModal, useSubscribeModal, useAdModal };
