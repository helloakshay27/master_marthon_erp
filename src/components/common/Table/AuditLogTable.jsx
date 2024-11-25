import React from 'react'
import { auditLogColumns, auditLogData } from '../../../constant/data'
import Table from '../../base/Table/Table'

export default function AuditLogTable() {
  return (
    <Table columns={auditLogColumns} data={auditLogData} />
  )
}
