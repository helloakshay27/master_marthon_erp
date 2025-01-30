export const SegregatedBidMaterials = (inputArray) => {  
  const materialMap = new Map();    
  inputArray.forEach((vendor) => {
    const bid = vendor.bids[0];
    bid.bid_materials.forEach((material) => {
      if (!materialMap.has(material.material_id)) {
        materialMap.set(material.material_id, {
          material_id: material.material_id,
          material_name: material.material_name,
          total_amounts: [],
          bids_values: [],
        });
      }
      const materialData = materialMap.get(material.material_id);
      materialData.bids_values.push(material);
      materialData.total_amounts.push(material.total_amount);
    });
  });

  return Array.from(materialMap.values());
};
