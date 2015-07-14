var App = {
    institutionId: 'lancaster',
    startDateDefault: '20000101',
    endDateDefault: '20350101', //moment().add(20, 'years').format('YYYYMMDD'),       
    startDate: '20000101',
    endDate: '20350101', //moment().add(20, 'years').format('YYYYMMDD'),
    faculty: '',
    facultyDefault: '',
    facultyMap: {
       '': 'All faculties',
        1: 'FASS',
        2: 'FST',
        3: 'FHM',
        4: 'LUMS'
    },
    updateDelay: 600000,
    dataAccessResponseData: {},
    metadataAccessResponseData: {},
};