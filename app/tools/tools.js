const dateIsInRange = (fromYear, fromMonth, fromDay, toYear, toMonth, toDay, year, month, day) => {
  return dateIsLargerThan(fromYear, fromMonth, fromDay, year, month, day) && dateIsSmallerThan(toYear, toMonth, toDay, year, month, day)
}

const dateIsLargerThan = (fromYear, fromMonth, fromDay, year, month, day) => {
  let result = false
  if (year === fromYear && month === fromMonth && day >= fromDay) {
    result = true
  } else if (year === fromYear && month > fromMonth) {
    result = true
  } else if (year > fromYear) {
    result = true
  }
  return result
}

const dateIsSmallerThan = (toYear, toMonth, toDay, year, month, day) => {
  let result = false
  if (year === toYear && month === toMonth && day <= toDay) {
    result = true
  } else if (year === toYear && month < toMonth) {
    result = true
  } else if (year < toYear) {
    result = true
  }
  return result
}

export {
  dateIsInRange
}
