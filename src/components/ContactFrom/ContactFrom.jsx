import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Notiflix from 'notiflix';
import { nanoid } from 'nanoid';

const useLocalStorage = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    return JSON.parse(window.localStorage.getItem(key)) ?? defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

const ContactForm = ({ sendDataToApp, contacts }) => {
  const [name, setName] = useLocalStorage('name', '');
  const [number, setNumber] = useLocalStorage('number', '');

  const handleChange = e => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'number':
        setNumber(value);
        break;
      default:
        return;
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    const { name, number } = e.currentTarget.elements;

    const contact = {
      id: nanoid(),
      name: name.value,
      number: number.value,
    };

    if (onDuplicateCheck(contact.name)) {
      e.currentTarget.reset();
      // name.focus() || number.focus()
      Notiflix.Notify.failure(`${contact.name} is already in contacts`);
      return;
    }

    sendDataToApp(
      { name: name.value, number: number.value },
      JSON.stringify(contact)
    );
    reset();
  };

  const onDuplicateCheck = identificator => {
    const normalizedIdentificator = identificator.toLowerCase();

    return contacts.some(contact =>
      contact.name.toLowerCase().includes(normalizedIdentificator)
    );
  };

  const reset = () => {
    setName('');
    setNumber('');
  };

  return (
    <form onSubmit={onSubmit}>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={name}
          pattern="^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$"
          title="Name may contain only letters, apostrophe, dash and spaces. For example Adrian, Jacob Mercer, Charles de Batz de Castelmore d'Artagnan"
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Number
        <input
          type="tel"
          name="number"
          value={number}
          pattern="\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}"
          title="Phone number must be digits and can contain spaces, dashes, parentheses and can start with +"
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Add contact</button>
    </form>
  );
};

export default ContactForm;

// Інший варіант

//............................................

// const [name, setName] = useState(() => {
//   return JSON.parse(window.localStorage.getItem('name')) ?? '';
// });
// const [number, setNumber] = useState(
//   () => JSON.parse(window.localStorage.getItem('number')) ?? ''
// );

// useEffect(() => {
//   window.localStorage.setItem('name', JSON.stringify(name));
// }, [name]);

// useEffect(() => {
//   window.localStorage.setItem('number', JSON.stringify(number));
// }, [number]);

//............................................

ContactForm.propTypes = {
  sendDataToApp: PropTypes.func.isRequired,
  contacts: PropTypes.array.isRequired,
};
