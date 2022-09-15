import { ToastContainer } from 'react-toastify';
import PickerComponent from './components/ColorPicker/PickerComponent';
import DrawingComponent from './components/Drawing/DrawingComponent';

import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
      < PickerComponent/>
      < DrawingComponent/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  )
}

export default App
