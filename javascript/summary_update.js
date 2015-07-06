function summaryUpdate(){
	console.log('SummaryUpdate fired');

	DataAccessSummary.update({  dateFilter: 'project_start',
                    startDate: App.startDate, 
                    endDate: App.endDate,
            	});
}