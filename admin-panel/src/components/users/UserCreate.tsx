import React from 'react';
import { Edit, SimpleForm, TextInput, ReferenceArrayInput, AutocompleteArrayInput, Create } from 'react-admin';

export const UserCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="email" />
            <TextInput source="password" />
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="phone" />
            <ReferenceArrayInput source="roles" reference="role">
                <AutocompleteArrayInput optionText="name" source='role' />
            </ReferenceArrayInput>
        </SimpleForm>
    </Create>
);