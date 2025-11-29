import React from 'react';
import { ReferenceInput, TextInput, Datagrid, List, TextField } from 'react-admin';

const brandFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <ReferenceInput source="name" label="Brand" reference="brand" />,
];

export const BrandList = () => (
    <List filters={brandFilters}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="country" />
            <TextField source="description" />
        </Datagrid>
    </List>
);