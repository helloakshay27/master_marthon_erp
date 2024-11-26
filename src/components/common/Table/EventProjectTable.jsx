import React from 'react'
import Table from '../../base/Table/Table'
import {eventProjectColumns, eventProjectData} from '../../../constant/data'

export default function EventProjectTable() {  
  return (
    <Table columns={eventProjectColumns} data={eventProjectData} showCheckbox={true} />
  )
}
