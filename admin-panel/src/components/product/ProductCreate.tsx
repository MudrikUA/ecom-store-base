import { Create, SimpleForm, TextInput, ReferenceInput, BooleanInput } from "react-admin";

export const ProductCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <TextInput source="title" />
                <TextInput source="descriptionLong" />
                <TextInput source="descriptionShort" />
                <ReferenceInput source="brand_id" reference="brand" />
                <TextInput source="type" />
                <TextInput source="size" />
                <TextInput source="sku" />
                <ReferenceInput source="category_id" reference="category" />
                <BooleanInput source="is_active" />
            </SimpleForm>
        </Create>
    );
};

export default ProductCreate;