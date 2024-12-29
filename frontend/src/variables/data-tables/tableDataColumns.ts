type RowObj = {
  name: string;
  progress: string;
  quantity: number;
  date: string;
};

const tableDataColumns: RowObj[] = [
  {
    name: 'Project 01',
    quantity: 2458,
    progress: '17.5%',
    date: '12 Jan 2021',
  },
  {
    name: 'Project 02',
    quantity: 1485,
    progress: '10.8%',
    date: '21 Feb 2021',
  },
  {
    name: 'Project 03',
    quantity: 1024,
    progress: '21.3%',
    date: '13 Mar 2021',
  },
  {
    name: 'Project 04',
    quantity: 858,
    progress: '31.5%',
    date: '24 Jan 2021',
  },
];

export default tableDataColumns;
