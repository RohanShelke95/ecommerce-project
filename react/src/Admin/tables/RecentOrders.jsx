import { Avatar, Box, Card, CardHeader, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getImageUrl } from '../../utils/getImageUrl'

const RecentOrders = () => {
    const navigate=useNavigate();
    const { adminsOrder } = useSelector((store) => store);

  return (
    <Card>
       <CardHeader
          title='Recent Orders'
          sx={{ pt: 2, alignItems: 'center', '& .MuiCardHeader-action': { mt: 0.6 } }}
          action={<Typography onClick={()=>navigate("/admin/orders")} variant='caption' sx={{color:"blue",cursor:"pointer",paddingRight:".8rem"}}>View All</Typography>}
          titleTypographyProps={{
            variant: 'h5',
            sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' }
          }}
        />
    <TableContainer>
      <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
        <TableHead>
          <TableRow>
             <TableCell>Image</TableCell>
            <TableCell>Title</TableCell>
          
            <TableCell>Price</TableCell>
             <TableCell>Order Id</TableCell>
             <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(adminsOrder.orders) && adminsOrder.orders.slice(0,5).map((item,index) => (
            <TableRow hover key={item.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
             <TableCell> <Avatar alt={item.orderItems[0]?.product.title} src={getImageUrl(item.orderItems[0]?.product.imageUrl)} /> </TableCell>
             
              <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{item.orderItems[0]?.product.title}</Typography>
                  <Typography variant='caption'>{item.orderItems[0]?.product.brand}</Typography>
                </Box>
              </TableCell>
              
              <TableCell>{item.totalDiscountedPrice}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell><Chip sx={{color:"white"}} label={item.orderStatus} size='small' color="success" className='text-white' /></TableCell>
             
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Card>
  )
}

export default RecentOrders