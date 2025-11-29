import React from 'react';
import { Create, ReferenceInput, SelectInput, SimpleForm, TextInput } from 'react-admin';

const StockCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="product_id" reference="product" label="Product">
                <SelectInput optionText={(record) => `${record.id} - ${record.title}`} />
            </ReferenceInput>
            <TextInput source="quantity" />
        </SimpleForm>
    </Create>
);

export default StockCreate