import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

export const BrandCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="country" />
            <TextInput source="description" />
        </SimpleForm>
    </Create>
);