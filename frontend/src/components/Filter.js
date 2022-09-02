const Filter = ({ filterString, setFilterString }) => 
  <div>
    filter shown with <input 
      value={filterString}
      onChange={e => setFilterString(e.target.value)}
    />
  </div>

export default Filter;
