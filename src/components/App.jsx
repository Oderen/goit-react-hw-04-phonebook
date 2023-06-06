import { useState, useEffect } from 'react';

import ContactList from './ContactList/ContactList';
import ContactForm from './ContactFrom/ContactFrom';
import Filter from './Filter/Filter';

import initialContacts from './data/contacts.json';

// const useLocalStorage = (key, defaultValue) => {
//   const [state, setState] = useState(() => {
//     return JSON.parse(window.localStorage.getItem(key)) ?? defaultValue;
//   });

// useEffect(() => {
//   window.localStorage.setItem(key, JSON.stringify(state));
// }, [key, state]);

//   return [state, setState];
// };

// const [contacts, setContacts] = useLocalStorage('contacts', initialContacts);

const App = () => {
  const [contacts, setContacts] = useState(() => {
    return (
      JSON.parse(window.localStorage.getItem('contacts')) ?? initialContacts
    );
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    window.localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const formOnSubmit = (data, newContact) => {
    console.log('Form data >>> ', data);

    setContacts(prevState => [JSON.parse(newContact), ...prevState]);
  };

  const changeFilter = e => {
    setFilter(e.currentTarget.value);
  };

  const deleteContact = contactId => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== contactId)
    );
  };

  const normalizedFilter = filter.toLowerCase();
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(normalizedFilter)
  );

  return (
    <div>
      <h1>Phonebook</h1>
      <ContactForm sendDataToApp={formOnSubmit} contacts={contacts} />

      <div>
        <h2>Contacts</h2>
        <Filter filterValue={filter} changeFilter={changeFilter} />
        <ContactList contacts={filteredContacts} onDelete={deleteContact} />
      </div>
    </div>
  );
};

export default App;
