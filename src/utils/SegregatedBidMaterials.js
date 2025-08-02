export const SegregatedBidMaterials = (inputArray) => {
  console.log("inputArray----", inputArray);
  const materialMap = new Map();
  inputArray.forEach((vendor) => {
    const bid = vendor.bids[0];

    bid.bid_materials.forEach((material) => {
      // Use po_exist from material, fallback to po_exists if po_exist is undefined
      const poExistValue = material.po_exist !== undefined
        ? material.po_exist
        : material.po_exists !== undefined
          ? material.po_exists
          : null;

      if (!materialMap.has(material.event_material_id)) {
        materialMap.set(material.event_material_id, {
          id: material.id,
          material_id: material.event_material_id,
          material_name: material.material_name,
          vendor_name: material.vendor_name,
          pms_supplier_id: vendor.pms_supplier_id,
          total_amounts: [],
          bids_values: [],
          bid_ids: [],
          vendor_ids: [],
          additionTaxData: material.addition_bid_material_tax_details,
          deductionTaxData: material.deduction_bid_material_tax_details,
          realised_tax_amount: material.realised_tax_amount,
          po_exists: material.po_exists,
        });
      }
      const materialData = materialMap.get(material.event_material_id);
      console.log("materialData----", materialData);
      
      materialData.bids_values.push({
        ...material,
        bid_id: bid.id,
        id: material.id,
        material_id: material.material_id,
        material_name: material.material_name,
        event_vendor_id: bid.event_vendor_id,
        vendor_id: vendor.id,
        pms_supplier_id: vendor.pms_supplier_id,
        extra: bid.extra, // Pass the extra object from the bid
        isChecked: false, // Add the isChecked property with a default value
        status: bid.status,
        original_bid_id: bid.original_bid_id,
        serialized_last_bid : bid.serialized_last_bid,
        po_exist: poExistValue,
      });
      materialData.bid_ids.push(bid.id);
      materialData.vendor_ids.push(vendor.id);
      materialData.total_amounts.push(material.total_amount);
    });
  });

  return Array.from(materialMap.values());
};
