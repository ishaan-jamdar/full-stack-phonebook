const PersonForm = ({ addPerson, newPerson, setNewPerson }) =>
  <form onSubmit={addPerson}>
    <div>
      name: <input 
        value={newPerson.name}
        onChange={e => setNewPerson({...newPerson, name: e.target.value})}
      />
    </div>
    <div>
      number: <input
        value={newPerson.number}
        onChange={e => setNewPerson({...newPerson, number: e.target.value})}
      />
    </div>
    <div><button type='submit'>add</button></div>
  </form>

export default PersonForm;
