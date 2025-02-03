export const SegregatedBidMaterials = (inputArray) => {
  console.log("inputArray:-----", inputArray);

  const materialMap = new Map();
  inputArray.forEach((vendor) => {
    const bid = vendor.bids[0];
    console.log("vendor:-----", vendor);
    

    bid.bid_materials.forEach((material) => {
      if (!materialMap.has(material.material_id)) {
        materialMap.set(material.material_id, {
          material_id: material.id,
          material_name: material.material_name,
          vendor_name: material.vendor_name,
          total_amounts: [],
          bids_values: [],
          bid_ids: [],
          vendor_ids: [],
        });
      }
      const materialData = materialMap.get(material.material_id);
      materialData.bids_values.push({
        ...material,
        bid_id: bid.id,
        material_id: material.id,
        vendor_id: vendor.id,
      });
      materialData.bid_ids.push(bid.id);
      materialData.vendor_ids.push(vendor.id);
      materialData.total_amounts.push(material.total_amount);
    });
  });

  return Array.from(materialMap.values());
};
