const DrawToolComponent = () => {
  return (
    <div>
      <h1>Draw:</h1>
      <div className="tool-wrapper">
        <div>
          <button>Free</button>
          <div className="divider-horizontal-m"></div>
          <button>Line</button>
        </div>
        <div>
          <button>Area</button>
        </div>
      </div>
    </div>
  )
}

export default DrawToolComponent;