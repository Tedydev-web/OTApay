import { IRoute } from 'types/navigation';
import { 
  MdHome,
  MdPayment, 
  MdSettings,
  MdInsertChart,
  MdPeople,
} from 'react-icons/md';

const routes: IRoute[] = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Quản lý giao dịch',
    layout: '/admin',
    path: 'transactions',
    icon: <MdPayment className="h-6 w-6" />,
    children: [
      {
        name: 'Tra cứu giao dịch',
        layout: '/admin',
        path: 'transactions/search',
      },
      {
        name: 'Tạo hoàn giao dịch', 
        layout: '/admin',
        path: 'transactions/refund',
      },
      {
        name: 'Xuất hoá đơn',
        layout: '/admin', 
        path: 'transactions/invoice',
      }
    ]
  },
  {
    name: 'Quản lý hệ thống',
    layout: '/admin',
    path: 'systems',
    icon: <MdSettings className="h-6 w-6" />,
    children: [
      {
        name: 'Tra cứu thông tin',
        layout: '/admin',
        path: 'systems/search',
      },
      {
        name: 'Quản lý hệ thống',
        layout: '/admin',
        path: 'systems/manage',
      }
    ]
  },
  {
    name: 'Báo cáo thống kê',
    layout: '/admin', 
    path: 'reports',
    icon: <MdInsertChart className="h-6 w-6" />,
    children: [
      {
        name: 'Báo cáo giao dịch thanh toán',
        layout: '/admin',
        path: 'reports/payment',
      },
      {
        name: 'Báo cáo giao dịch hoàn',
        layout: '/admin',
        path: 'reports/refund', 
      },
      {
        name: 'Báo cáo tổng hợp',
        layout: '/admin',
        path: 'reports/summary',
      },
      {
        name: 'Báo cáo chiết khấu',
        layout: '/admin',
        path: 'reports/commission',
      }
    ]
  },
  {
    name: 'Quản lý người dùng',
    layout: '/admin',
    path: 'users',
    icon: <MdPeople className="h-6 w-6" />,
    children: [
      {
        name: 'Danh sách người dùng',
        layout: '/admin',
        path: 'users/list',
      },
      {
        name: 'Phân quyền',
        layout: '/admin',
        path: 'users/roles',
      }
    ]
  }
];

export default routes;
