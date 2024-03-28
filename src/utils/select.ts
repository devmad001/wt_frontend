export const getOption = (value: any, listOptions: any): any => {
  return listOptions.find((option: any) => value === option.value) || null
}

export const getOptionByLabel = (label: any, listOptions: any): any => {
  return (
    listOptions.find((option: any) => {
      return label === option.label
    }) || null
  )
}
