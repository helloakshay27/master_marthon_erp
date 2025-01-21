export const SegregatedBidMaterials = (inputArray) => {
    const materialMap = new Map();    
    inputArray.forEach((vendor) => {
      const bid = vendor.bids[0];
      // vendor.bids.forEach((bid) => {
        bid.bid_materials.forEach((material) => {
          if (!materialMap.has(material.material_id)) {
            materialMap.set(material.material_id, {
              material_id: material.material_id,
              material_name: material.material_name,
              bids_values: [],
            });
          }
          materialMap.get(material.material_id).bids_values.push(material);
        });
      // });
    });
  
    return Array.from(materialMap.values());
  };
  