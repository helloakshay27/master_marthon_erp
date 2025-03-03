const calculateOrderValues = (category) => {
    if (category.sub_categories_4 && category.sub_categories_4.length > 0) {
        category.order_draft_value = category.sub_categories_4.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_draft_value);
        }, 0);
        category.order_submitted_value = category.sub_categories_4.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_submitted_value);
        }, 0);
        category.order_approved_value = category.sub_categories_4.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_approved_value);
        }, 0);
        category.overdue_budget = category.sub_categories_4.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).overdue_budget);
        }, 0);
        category.balance_bugdet = category.sub_categories_4.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).balance_bugdet);
        }, 0);
    } else if (category.sub_categories_3 && category.sub_categories_3.length > 0) {
        category.order_draft_value = category.sub_categories_3.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_draft_value);
        }, 0);
        category.order_submitted_value = category.sub_categories_3.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_submitted_value);
        }, 0);
        category.order_approved_value = category.sub_categories_3.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_approved_value);
        }, 0);
        category.overdue_budget = category.sub_categories_3.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).overdue_budget);
        }, 0);
        category.balance_bugdet = category.sub_categories_3.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).balance_bugdet);
        }, 0);
    } else if (category.sub_categories_2 && category.sub_categories_2.length > 0) {
        category.order_draft_value = category.sub_categories_2.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_draft_value);
        }, 0);
        category.order_submitted_value = category.sub_categories_2.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_submitted_value);
        }, 0);
        category.order_approved_value = category.sub_categories_2.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).order_approved_value);
        }, 0);
        category.overdue_budget = category.sub_categories_2.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).overdue_budget);
        }, 0);
        category.balance_bugdet = category.sub_categories_2.reduce((sum, subCategory) => {
            return sum + parseFloat(calculateOrderValues(subCategory).balance_bugdet);
        }, 0);
    } else if (category.material_type_details && category.material_type_details.length > 0) {
        category.order_draft_value = category.material_type_details.reduce((sum, material) => {
            return sum + (material.order_draft_value || 0);
        }, 0);
        category.order_submitted_value = category.material_type_details.reduce((sum, material) => {
            return sum + (material.order_submitted_value || 0);
        }, 0);
        category.order_approved_value = category.material_type_details.reduce((sum, material) => {
            return sum + (material.order_approved_value || 0);
        }, 0);
        category.overdue_budget = category.material_type_details.reduce((sum, material) => {
            return sum + (material.overdue_budget || 0);
        }, 0);
        category.balance_bugdet = category.material_type_details.reduce((sum, material) => {
            return sum + (material.balance_bugdet || 0);
        }, 0);
    }
    category.order_draft_value = category.order_draft_value > 0 ? parseFloat(category.order_draft_value).toFixed(2)  : 0;
    category.order_submitted_value = category.order_submitted_value > 0 ? parseFloat(category.order_submitted_value).toFixed(2) : 0;
    category.order_approved_value = category.order_approved_value > 0 ? parseFloat(category.order_approved_value).toFixed(2) : 0;
    category.overdue_budget = category.overdue_budget > 0 ? parseFloat(category.overdue_budget).toFixed(2) : 0;
    category.balance_bugdet = category.balance_bugdet > 0 ? parseFloat(category.balance_bugdet).toFixed(2) : 0;
    return category;
};

export default calculateOrderValues;