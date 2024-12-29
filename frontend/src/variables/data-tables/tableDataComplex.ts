type RowObj = {
  name: string;
  status: string;
  date: string;
  progress: number;
};

const tableDataComplex: RowObj[] = [
  {
    name: 'Project 01',
    progress: 75.5,
    status: 'Approved',
    date: '12 Jan 2021',
  },
  {
    name: 'Project 02',
    progress: 25.5,
    status: 'Disable',
    date: '21 Feb 2021',
  },
  {
    name: 'Project 03',
    progress: 90,
    status: 'Error',
    date: '13 Mar 2021',
  },
  {
    name: 'Project 04',
    progress: 50.5,
    status: 'Approved',
    date: '24 Oct 2022',
  },
];
export default tableDataComplex;
