type RowObj = {
  pageName: string;
  visitors: string | number;
  unique: string | number;
  clients: string | number;
  bounceRate: string | number;
};

const tableDataComplex: RowObj[] = [
  {
    pageName: 'Project 01',
    visitors: '4.847',
    unique: '3.455',
    clients: '439',
    bounceRate: '+2.45%',
  },
  {
    pageName: 'Project 02',
    visitors: '4.034',
    unique: '2.943',
    clients: '427',
    bounceRate: '-9.45%',
  },
  {
    pageName: 'Project 03',
    visitors: '3.502',
    unique: '2.478',
    clients: '403',
    bounceRate: '+7.87%',
  },
  {
    pageName: 'Project 04',
    visitors: '3.323',
    unique: '2.336',
    clients: '397',
    bounceRate: '-1.44%',
  },
  {
    pageName: 'Project 05',
    visitors: '3.244',
    unique: '2.302',
    clients: '287',
    bounceRate: '-0.21%',
  },
];
export default tableDataComplex;
