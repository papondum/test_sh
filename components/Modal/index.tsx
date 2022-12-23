interface ConfirmData {
    children: any;
    onOk: (event: React.MouseEvent<HTMLElement>) => void;
}
const Modal = (props:ConfirmData) => {
    const { onOk, children } = props
    return (
        <div className="flex justify-center items-center h-full w-full absolute bg-black bg-opacity-60 top-0">
            <div className='relative max-w-2xl rounded-lg shadow bg-gray-700'>
                <div className="h-modal md:h-full">
                <div className="relative w-full h-full max-w-md md:h-auto">
                    <div className="relative bg-white rounded-lg shadow bg-gray-700">
                        <button onClick={onOk} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-gray-800 hover:text-white" data-modal-toggle="popup-modal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="p-6 text-center">
                            {children}
                            <button onClick={onOk} data-modal-toggle="popup-modal" type="button" className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}

export default Modal