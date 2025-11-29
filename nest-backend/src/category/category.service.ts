import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './category.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class CategoryService {

    constructor(@InjectModel(Category) private categoryRepo: typeof Category) { }

    async createCategory(dto) {
        const category = this.categoryRepo.create(dto);
        return category;
    }

    async updateCategory(id, dto) {
        await this.categoryRepo.update(dto, { where: { id: id } });
        const updatedCategory = await this.categoryRepo.findByPk(id);
        if (!updatedCategory) {
            throw new NotFoundException(`[ERR-14]: Category with id ${id} not found`);
        }
        return updatedCategory;
    }

    async deleteCategory(id) {
        return this.categoryRepo.destroy({ where: { id } });
    }

    async getAllCategories(offset, perPage) {
        const categories = await this.categoryRepo.findAll({
            offset,
            limit: perPage,
        });

        const count = await this.categoryRepo.count();

        return { count, rows: categories };
    }

    async getById(id) {
        const category = await this.categoryRepo.findByPk(id);
        return category;
    }

    async getAllActiveChildCategoriesByParentAlias(parentAlias: string) {
        const categoryInstance = await Category.findOne({ where: { [Op.and]: [{ alias: parentAlias }, { isActive: true }] } });
        if (!categoryInstance) return null;

        const category = categoryInstance.get({ plain: true });

        async function loadSubcategories(cat: any): Promise<any> {
            const childrenInstances = await Category.findAll({ where: { parent_id: cat.id } });

            const children = childrenInstances.map(child => child.get({ plain: true }));

            if (children.length > 0) {
                cat.subcategories = await Promise.all(children.map(child => loadSubcategories(child)));
            } else {
                cat.subcategories = [];
            }
            return cat;
        }

        return loadSubcategories(category);
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
                console.log("array of objects-> " + JSON.stringify(filters.id));
                if (filters.id.length > 0 && typeof filters.id[0] === 'object') {
                    console.log("array of objects 2-> " + JSON.stringify(filters.id));
                    whereClause.id = { [Op.in]: filters.id.map((item) => item.id) };
                } else {
                    console.log("array-> " + JSON.stringify(filters.id));
                    whereClause.id = { [Op.in]: filters.id };
                }
            } else {
                console.log("single-> " + JSON.stringify(filters.id));
                whereClause.id = filters.id;
            }
        }
        if (filters.name) whereClause.name = { [Op.iLike]: `%${filters.name}%` };

        // Отримання даних
        const { rows, count } = await this.categoryRepo.findAndCountAll({
            where: whereClause,
            limit,
            offset,
            order: [[sortField, sortOrder]],
        });

        return { rows, count };
    }

    async getAllChildCategoryAliases(parentAlias: string): Promise<string[]> {
        const aliases: string[] = [parentAlias];
        const categoryRepo = this.categoryRepo;

        // Рекурсивна функція для знаходження всіх дочірніх категорій
        async function getChildAliases(alias: string) {
            const children = await categoryRepo.findAll({
                where: {
                    parent_id: {
                        [Op.eq]: Sequelize.literal(`(SELECT id FROM categories WHERE alias = '${alias}')`)
                    }
                }
            });

            for (const child of children) {
                aliases.push(child.alias);
                await getChildAliases(child.alias);
            }
        }

        await getChildAliases(parentAlias);
        return aliases;
    }

}
