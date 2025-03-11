const calculateOrderValues = (category) => {
    let orderDraftValue = 0;
    let orderSubmittedValue = 0;
    let orderApprovedValue = 0;
    let overdueBudget = 0;

    const calculateSubCategory = (subCategory) => {
        subCategory.material_type_details.forEach((material) => {
            orderDraftValue += material.order_draft_value;
            orderSubmittedValue += material.order_submitted_value;
            orderApprovedValue += material.order_approved_value;
            overdueBudget += material.overdue_budget;
        });

        subCategory.sub_categories_3.forEach(calculateSubCategory);
        subCategory.sub_categories_4.forEach(calculateSubCategory);
        subCategory.sub_categories_5.forEach(calculateSubCategory);
    };

    category.sub_categories_2.forEach(calculateSubCategory);

    category.order_draft_value = orderDraftValue;
    category.order_submitted_value = orderSubmittedValue;
    category.order_approved_value = orderApprovedValue;
    category.overdue_budget = overdueBudget;
};

export default calculateOrderValues;