import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';

interface DataGridProps {
        rows: any[];    // Replace 'any' with the actual type of your rows
        columns: any[]; // Replace 'any' with the actual type of your columns 
        onRowDoubleClick?: (params: any) => void;
        pageSize?: number;
}

export default function DataGrid({ columns, rows, onRowDoubleClick, pageSize }: DataGridProps) {
        return (
                <MuiDataGrid
                        rows={rows}
                        columns={columns}
                        onRowDoubleClick={onRowDoubleClick}
                        getRowClassName={(params) =>
                                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                        }
                        initialState={{
                                pagination: { paginationModel: { pageSize: pageSize || 20 } },
                        }}
                        pageSizeOptions={[5, 10, 20, 50]}
                        disableColumnResize
                        density="compact"
                        slotProps={{
                                filterPanel: {
                                        filterFormProps: {
                                                logicOperatorInputProps: {
                                                        variant: 'outlined',
                                                        size: 'small',
                                                },
                                                columnInputProps: {
                                                        variant: 'outlined',
                                                        size: 'small',
                                                        sx: { mt: 'auto' },
                                                },
                                                operatorInputProps: {
                                                        variant: 'outlined',
                                                        size: 'small',
                                                        sx: { mt: 'auto' },
                                                },
                                                valueInputProps: {
                                                        InputComponentProps: {
                                                                variant: 'outlined',
                                                                size: 'small',
                                                        },
                                                },
                                        },
                                },
                        }}
                />
        );
}