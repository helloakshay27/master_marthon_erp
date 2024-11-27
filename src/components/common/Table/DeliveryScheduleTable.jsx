import React from 'react'
import Table from '../../base/Table/Table'
import { deliveryColumns, deliveryData } from '../../../constant/data';

export default function DeliveryScheduleTable() {
  return (
    <Table columns={deliveryColumns} data={deliveryData} />
  )
}
