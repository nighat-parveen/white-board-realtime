import CanvasBoard from "./feature/CanvasBoard"


function App() {

  return (
   <div className="main-app">
    <ul className="options">
      <li className="option-list">eraser</li>
      <li className="option-list">pen</li>
      <li className="option-list">brush</li>
      <li className="option-list">shapes</li>
    </ul>
    <CanvasBoard />
   </div>
  )
}

export default App
