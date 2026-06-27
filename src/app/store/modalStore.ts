import { create } from "zustand";
import { ReactNode } from "react";

interface ModalOptions {
	id?: string;
	title?: string;
	description?: string;
	content: ReactNode;
	size?: "sm" | "md" | "lg" | "xl" | "full";
	onClose?: () => void;
	onOpen?: () => void;
	className?: string;
	disableOutsideClick?: boolean;
	disableEscape?: boolean;
}

interface ModalItem extends ModalOptions {
	id: string;
	isOpen: boolean;
}

interface ModalStore {
	modals: ModalItem[];
	openModal: (opts: ModalOptions) => string;
	closeModal: (id?: string) => void;
	closeAllModals: () => void;
	getOpenModals: () => ModalItem[];
}

let modalIdCounter = 0;

export const useModalStore = create<ModalStore>((set, get) => ({
	modals: [],

	openModal: (opts) => {
		const id = opts.id || `modal-${++modalIdCounter}`;

		set((state) => ({
			modals: state.modals
				.map((modal) => ({
					...modal,
					isOpen: false,
				}))
				.concat({
					...opts,
					id,
					isOpen: true,
					disableOutsideClick: opts.disableOutsideClick || false,
					disableEscape: opts.disableEscape || false,
				}),
		}));

		if (opts.onOpen) {
			opts.onOpen();
		}

		return id;
	},

	closeModal: (id) => {
		set((state) => {
			const modals = state.modals;

			if (id) {
				const modal = modals.find((m) => m.id === id);
				if (modal?.onClose) {
					modal.onClose();
				}

				const newModals = modals.filter((m) => m.id !== id);

				if (newModals.length > 0) {
					const lastModal = newModals[newModals.length - 1];
					return {
						modals: newModals.map((m, index) => ({
							...m,
							isOpen: index === newModals.length - 1,
						})),
					};
				}

				return { modals: newModals };
			} else {
				const openModals = modals.filter((m) => m.isOpen);

				if (openModals.length === 0) return state;

				const topModal = openModals[openModals.length - 1];

				if (topModal?.onClose) {
					topModal.onClose();
				}

				const newModals = modals.filter((m) => m.id !== topModal.id);

				if (newModals.length > 0) {
					const lastModal = newModals[newModals.length - 1];
					return {
						modals: newModals.map((m, index) => ({
							...m,
							isOpen: index === newModals.length - 1,
						})),
					};
				}

				return { modals: newModals };
			}
		});
	},

	closeAllModals: () => {
		set((state) => {
			state.modals.forEach((modal) => {
				if (modal.onClose) {
					modal.onClose();
				}
			});
			return { modals: [] };
		});
	},

	getOpenModals: () => {
		return get().modals.filter((m) => m.isOpen);
	},
}));
