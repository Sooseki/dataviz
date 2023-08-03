import { ReactNode } from "react";

interface Props {
  component: ReactNode;
  isOpen: boolean;
  closeModal: VoidFunction
}

const Modal = ({ component, isOpen, closeModal }: Props) => {
    return <>
        { isOpen && 
          <>
              <div className="modal">
                  <div className="modal_background" onClick={closeModal}></div>
                  <div className="modal_content">{component}</div> 
              </div>
          </>
        }
    </>;
};

export default Modal;