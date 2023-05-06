# is-valid-structure

## Installation (master branch)

```
npm i github:MidSpike/is-valid-structure
```

## Use Case

Is Valid Structure is a simple utility that checks if a given input matches the structure of a given schema.

## Example

```ts
import { isValidStructure } from 'is-valid-structure';

const structure = {
    name: 'string',
    age: 'number',
    isAwesome: 'boolean',
    hobbies: 'string[]',
    address: {
        street: 'string',
        city: 'string',
        country: 'string',
    },
};

const mock_user_input = {
    name: 'John Doe',
    age: 35,
    isAwesome: true,
    hobbies: ['coding', 'gaming'],
    address: {
        street: '123 Fake Street',
        city: 'Fake City',
        country: 'Fake Country',
    },
};

const is_valid = isValidStructure(mock_user_input, structure);

console.log(is_valid); // true
```
