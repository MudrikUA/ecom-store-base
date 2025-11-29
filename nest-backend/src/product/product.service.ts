import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.model';
import { FilesService } from 'src/files/files.service';
import { Brand } from 'src/brand/brand.model';
import { Category } from 'src/category/category.model';
import { PriceBook } from 'src/pricebook/pricebook.model';
import { Op } from 'sequelize';
import { Stock } from 'src/stock/stock.model';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product) private ProductRepo: typeof Product,
        private fileService: FilesService,
        private categoryService: CategoryService) { }

    async createProduct(dto, images) {
        const imagesArray: string[] = [];
        if (images) {
            for (const image of images) {
                const createdImage = await this.fileService.createFile(image);
                imagesArray.push(createdImage);
            }
        }
        const product = await this.ProductRepo.create({ ...dto, images: imagesArray });
        return product;
    }

    async changeProduct(id, dto) {
        await this.ProductRepo.update(dto, { where: { id: id } });
        const updatedProduct = await this.ProductRepo.findOne({ where: { id: id } });
        return updatedProduct;
    }

    async getProductsByCategory(id) {
        const product = await this.ProductRepo.findAll({
            where: { category_id: id },
            include: [{ model: PriceBook }, { model: Brand }, { model: Category },
            { model: Stock }]
        });
        return product
    }

    async getAllByFilter(query: any) {
        const { filter, range, sort } = query;

        // Декодуємо JSON параметри
        const filters = filter ? JSON.parse(filter) : {};
        const [sortField, sortOrder] = sort ? JSON.parse(sort) : ['id', 'ASC'];
        const [offset, limit] = range ? JSON.parse(range) : [0, 10];

        // Побудова фільтрів для пошуку
        const whereClause: any = {};
        if (filters.id) {
            if (Array.isArray(filters.id)) {
                if (filters.id.length > 0 && typeof filters.id[0] === 'object') {
                    whereClause.id = { [Op.in]: filters.id.map((item) => item.id) };
                } else {
                    whereClause.id = { [Op.in]: filters.id };
                }
            } else {
                whereClause.id = filters.id;
            }
        }
        if (filters.name) whereClause.name = { [Op.iLike]: `%${filters.name}%` };

        // Отримання даних
        const { rows, count } = await this.ProductRepo.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[sortField, sortOrder]],
        });

        return { rows, count };
    }

    // async getProductsByCategoryAlias(
    //     alias: string,
    //     page: number = 1,
    //     pageSize: number = 10,
    //     currency: string,
    //     brand?: string[],
    //     country?: string[],
    //     minPrice?: number,
    //     maxPrice?: number
    // ) {
    //     const offset = (page - 1) * pageSize;
    //     const whereClause: any = {};

    //     // ✅ Виправлення: Фільтр по бренду тепер застосовується тільки якщо `brand` існує
    //     if (brand && brand.length > 0) {
    //         whereClause['$brand.id$'] = { [Op.ne]: null }; // Гарантуємо, що `brand` приєднано
    //         whereClause['$brand.name$'] = { [Op.in]: brand };
    //     }

    //     // ✅ Виправлення: Аналогічно для країни
    //     if (country && country.length > 0) {
    //         whereClause['$brand.id$'] = { [Op.ne]: null };
    //         whereClause['$brand.country$'] = { [Op.in]: country };
    //     }

    //     const priceWhere: any = { currency };

    //     // ✅ Фільтр по діапазону цін
    //     if (minPrice !== undefined) {
    //         priceWhere.price = { [Op.gte]: minPrice };
    //     }
    //     if (maxPrice !== undefined) {
    //         priceWhere.price = { ...(priceWhere.price || {}), [Op.lte]: maxPrice };
    //     }

    //     const { rows: products, count } = await this.ProductRepo.findAndCountAll({
    //         include: [
    //             {
    //                 model: PriceBook,
    //                 where: priceWhere,
    //                 required: true
    //             },
    //             {
    //                 model: Brand,
    //                 as: "brand", // ✅ Додано alias
    //                 required: (brand && brand.length > 0) || (country && country.length > 0) // Якщо фільтр є - робимо INNER JOIN
    //             },
    //             {
    //                 model: Category,
    //                 where: { alias }
    //             },
    //             { model: Stock }
    //         ],
    //         where: whereClause,
    //         limit: pageSize,
    //         offset: offset,
    //     });

    //     return {
    //         totalItems: count,
    //         totalPages: Math.ceil(count / pageSize),
    //         currentPage: page,
    //         pageSize: pageSize,
    //         products
    //     };
    // }


    async getProductsByCategoryAlias(
        alias: string,
        page: number = 1,
        pageSize: number = 10,
        currency: string,
        brand?: string[],
        country?: string[],
        minPrice?: number,
        maxPrice?: number
    ) {
        const offset = (page - 1) * pageSize;
        const whereClause: any = {};

        // Отримуємо всі аліаси категорій (включаючи дочірні)
        const categoryAliases = await this.categoryService.getAllChildCategoryAliases(alias);

        if (brand && brand.length > 0) {
            whereClause['$brand.id$'] = { [Op.ne]: null };
            whereClause['$brand.name$'] = { [Op.in]: brand };
        }

        if (country && country.length > 0) {
            whereClause['$brand.id$'] = { [Op.ne]: null };
            whereClause['$brand.country$'] = { [Op.in]: country };
        }

        const priceWhere: any = { currency };

        if (minPrice !== undefined) {
            priceWhere.price = { [Op.gte]: minPrice };
        }
        if (maxPrice !== undefined) {
            priceWhere.price = { ...(priceWhere.price || {}), [Op.lte]: maxPrice };
        }

        const { rows: products, count } = await this.ProductRepo.findAndCountAll({
            include: [
                {
                    model: PriceBook,
                    where: priceWhere,
                    required: true
                },
                {
                    model: Brand,
                    as: "brand",
                    required: (brand && brand.length > 0) || (country && country.length > 0)
                },
                {
                    model: Category,
                    where: {
                        alias: { [Op.in]: categoryAliases } // Змінено: тепер шукаємо по всім аліасам
                    }
                },
                { model: Stock }
            ],
            where: whereClause,
            limit: pageSize,
            offset: offset,
        });

        return {
            totalItems: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize: pageSize,
            products
        };
    }


    async getFiltersByCategoryAlias(alias: string, currency: string) {
        const products = await this.ProductRepo.findAll({
            include: [
                {
                    model: PriceBook,
                    where: { currency },
                    required: true
                },
                { model: Brand },
                {
                    model: Category,
                    where: { alias }
                }
            ]
        });

        // Отримуємо список брендів (унікальні значення)
        const brands = Array.from(new Set(products.map(p => p.brand.name)));

        // Отримуємо список країн (унікальні значення)
        const countries = Array.from(new Set(products.map(p => p.brand.country)));

        // Отримуємо мінімальну і максимальну ціну
        const prices = products.map(p => p.prices[0]?.price).filter(price => price !== undefined);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return {
            brands,
            countries,
            priceRange: { min: minPrice, max: maxPrice }
        };
    }


    async getProductById(id) {
        const product = await this.ProductRepo.findOne({
            where: { id: id },
            include: [{ model: PriceBook },
            { model: Brand },
            { model: Category },
            { model: Stock }]
        });
        return product
    }

    async getProductsByIds(ids: string[]) {
        const products = await this.ProductRepo.findAll({
            where: { id: { [Op.in]: ids.map(id => parseInt(id, 10)) } },
            include: [
                { model: PriceBook },
                { model: Brand },
                { model: Category },
                { model: Stock }
            ]
        });
        return products;
    }

    async delete(id) {
        return this.ProductRepo.destroy({ where: { id } });
    }

    async uploadProductImages(id, images) {
        if (!images || images.length === 0) {
            throw new BadRequestException('[ERR-15]: No files uploaded');
        }

        const product = await this.ProductRepo.findByPk(id);
        if (!product) {
            throw new NotFoundException('[ERR-16]: Product not found');
        }

        const imagesArray: string[] = [];
        for (const image of images) {
            const createdImage = await this.fileService.createFile(image);
            imagesArray.push(createdImage);
        }

        product.images = [...product.images, ...imagesArray];
        await product.save();
        return imagesArray;
    }

    async removeProductImage(id, image) {
        if (!image) {
            throw new BadRequestException('[ERR-17]: Image parameter is required');
        }

        const product = await this.ProductRepo.findByPk(id);
        if (!product) {
            throw new NotFoundException('[ERR-16]: Product not found');
        }

        await this.fileService.removeFileByName(image);

        // Оновлюємо масив зображень
        product.images = product.images.filter(img => img !== image);
        await product.save();

        return product;
    }

    async updateProductImages(id, images) {
        const product = await this.ProductRepo.findByPk(id);
        if (!product) {
            throw new NotFoundException('[ERR-16]: Product not found');
        }

        // Перевіряємо існування всіх файлів
        const allFilesExist = await this.fileService.checkIfAllFilesExist(images);

        if (!allFilesExist) {
            throw new BadRequestException('[ERR-18]: Some images do not exist');
        }

        product.images = images;
        await product.save();
        return product;
    }
}
