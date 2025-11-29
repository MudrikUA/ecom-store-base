import React from 'react';
import { Create, Edit, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin';

const PriceBookCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="product_id" reference="product" />
            <NumberInput source="price" />
            <SelectInput source="currency" choices={[
                { id: 'hrn', name: 'Hryvni' },
                { id: 'usd', name: 'US Dollars' },
                { id: 'eur', name: 'Euros' },
            ]} label="Test Options" />
        </SimpleForm>
    </Create>
);

export default PriceBookCreate;