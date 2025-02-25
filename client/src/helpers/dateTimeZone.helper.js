import moment from 'moment-timezone'

export const currentDate = moment().tz('America/Guayaquil').format('YYYY-MM-DD_HH-mm')

export const formatISOToDate = (isoDate, timezone = 'America/Guayaquil') => {
	return moment(isoDate).tz(timezone).format('DD/MM/YYYY HH:mm')
}

export const formatISOToDateOnlyDate = (isoDate, timezone = 'America/Guayaquil') => {
	return moment(isoDate).tz(timezone).format('DD/MM/YYYY')
}
