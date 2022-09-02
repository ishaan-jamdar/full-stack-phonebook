const Persons = ({ persons, filterString, deleteEntry }) =>
  <div>
    {persons.filter(person => person.name.toLowerCase().includes(filterString.toLowerCase()))
    .map(person => 
      <div key={person.name}>
        {person.name} {person.number} <button onClick={() => deleteEntry(person.id, person.name)}>delete</button>
      </div>
    )}
  </div>

export default Persons;
