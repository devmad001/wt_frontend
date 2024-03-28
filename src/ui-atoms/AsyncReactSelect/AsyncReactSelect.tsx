import clsx from 'clsx'
import { HiChevronDown, HiLockClosed, HiOutlineX } from 'react-icons/hi'
import { ClearIndicatorProps, DropdownIndicatorProps, MultiValueRemoveProps, components } from 'react-select'
import AsyncSelect from 'react-select/async'

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <HiChevronDown />
    </components.DropdownIndicator>
  )
}

const ClearIndicator = (props: ClearIndicatorProps) => {
  return (
    <components.ClearIndicator {...props}>
      <HiOutlineX />
    </components.ClearIndicator>
  )
}

const MultiValueRemove = (props: MultiValueRemoveProps) => {
  return (
    <components.MultiValueRemove {...props}>
      <HiOutlineX />
    </components.MultiValueRemove>
  )
}

const controlStyles = {
  base: 'form-control react-select py-0 border rounded-lg bg-white hover:cursor-pointer',
  focus: 'ring-1 ring-wt-primary-1 border-wt-primary-90',
  nonFocus: 'border-wt-primary-75 hover:border-wt-primary-75'
}
const placeholderStyles = 'text-gray-500 text-base pl-1'
const selectInputStyles = 'pl-1'
const valueContainerStyles = 'gap-1'
const singleValueStyles = 'leading-7 ml-1'
const multiValueStyles = 'bg-gray-100 rounded items-center pl-2 pr-1 gap-1.5'
const multiValueLabelStyles = 'leading-6 py-0.5'
const multiValueRemoveStyles =
  'border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md'
const indicatorsContainerStyles = 'pr-0' //p-1 gap-1
const clearIndicatorStyles = 'text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800'
const indicatorSeparatorStyles = 'bg-gray-300 hidden'
const dropdownIndicatorStyles = 'p-0 hover:bg-gray-100 text-gray-500 rounded-md hover:text-black'
const menuStyles = 'p-1 mt-2 border border-gray-200 bg-white rounded-lg'
const groupHeadingStyles = 'ml-3 mt-2 mb-1 text-gray-500 text-sm'
const optionStyles = {
  base: 'hover:cursor-pointer px-3 py-2 rounded',
  focus: 'bg-gray-200 active:bg-gray-200',
  selected: 'bg-wt-primary-30 text-gray-800'
}
const noOptionsMessageStyles = 'text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm'

const AsyncReactSelect = (props: any) => (
  <AsyncSelect
    cacheOptions
    closeMenuOnSelect={false}
    hideSelectedOptions={false}
    unstyled
    styles={{
      input: (base) => ({
        ...base,
        'input:focus': {
          boxShadow: 'none'
        }
      }),
      // On mobile, the label will truncate automatically, so we want to
      // override that behaviour.
      multiValueLabel: (base) => ({
        ...base,
        whiteSpace: 'normal',
        overflow: 'visible'
      }),
      control: (base) => ({
        ...base,
        transition: 'none'
      })
    }}
    components={{ DropdownIndicator, ClearIndicator, MultiValueRemove }}
    {...props}
    classNames={{
      control: ({ isFocused }) => clsx(isFocused ? controlStyles.focus : controlStyles.nonFocus, controlStyles.base),
      placeholder: () => placeholderStyles,
      input: () => selectInputStyles,
      valueContainer: () => valueContainerStyles,
      singleValue: () => singleValueStyles,
      multiValue: () => multiValueStyles,
      multiValueLabel: () => multiValueLabelStyles,
      multiValueRemove: () => multiValueRemoveStyles,
      indicatorsContainer: () => indicatorsContainerStyles,
      clearIndicator: () => clearIndicatorStyles,
      indicatorSeparator: () => indicatorSeparatorStyles,
      dropdownIndicator: () => dropdownIndicatorStyles,
      menu: () => menuStyles,
      groupHeading: () => groupHeadingStyles,
      option: ({ isFocused, isSelected }) =>
        clsx(isFocused && optionStyles.focus, isSelected && optionStyles.selected, optionStyles.base),
      noOptionsMessage: () => noOptionsMessageStyles,
      ...props.classNames
    }}
  />
)

export default AsyncReactSelect
