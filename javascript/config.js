var host 				= 'http://lib-ldiv.lancs.ac.uk:8080';
var suburi 				= 'dmaonline';
var use_case_prefix 	= 'use_case_';

function getUseCase(code)
{
	return use_case_prefix + code;
}

function getUrl(url) {
	return host + '/' + suburi + '/' + getUseCase(url.use_case_code) + '/' + url.institution;
}