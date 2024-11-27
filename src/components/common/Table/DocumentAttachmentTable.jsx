import React from 'react'
import Table from '../../base/Table/Table';
import ShowIcon from '../Icon/ShowIcon';
import { documentColumns, documentData } from '../../../constant/data';

export default function DocumentAttachmentTable({handleDocumentModalShow}) {
    return (
        <Table
          columns={documentColumns}
          data={documentData}
          onActionClick={handleDocumentModalShow}
          // @ts-ignore
          actionIcon={<ShowIcon />}
        />
      )
}
