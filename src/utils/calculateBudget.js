export default function calculateBudget(category) {
    if (category.sub_categories_4 && category.sub_categories_4.length > 0) {
        category.budget = category.sub_categories_4.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateBudget(subCategory));
        }, 0);
    } else if (category.sub_categories_3 && category.sub_categories_3.length > 0) {
        category.budget = category.sub_categories_3.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateBudget(subCategory));
        }, 0);
    } else if (category.sub_categories_2 && category.sub_categories_2.length > 0) {
        category.budget = category.sub_categories_2.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateBudget(subCategory));
        }, 0);
    } else if (category.material_type_details && category.material_type_details.length > 0) {
        category.budget = category.material_type_details.reduce((sum, material) => {
            return sum + material.budget;
        }, 0);
    }
    return category.budget > 0 ? parseFloat(category.budget).toFixed(2) : "0";
}